require("dotenv").config();
const Manager = require("../models/managerModel");
const Waiter = require("../models/waiterModel");
const MenuCard = require("../models/menuCardModel");
const Table = require("../models/tableModel");
const KitchenStaff = require("../models/kitchenStaffModel");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { generateQR } = require("../helpers/qrCodeGenerator");
const { uploadFile, deleteFile } = require("../helpers/s3");

const S3Url = process.env.AWS_BUCKET_URL;
const QRBase = process.env.MENU_CARD_QR_URL;

const generateFileName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");

const managerDashboard = async (req, res, next) => {
  try {
    const managerID = req.user._id;
    const manager = await Manager.findById(managerID);
    if (!manager) {
      return res.status(404).json({ message: "Manager not found" });
    }
    return res.status(200).json({
      success: true,
      message: "Manager Dashboard",
      data: manager,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

/*----------------------------------------MANAGER----------------------------------------*/
const createMenuCard = async (req, res, next) => {
  console.log("Create req.files", req.files);
  try {
    // Handle coverImage
    const managerID = req.user._id;
    const manager = await Manager.findById(managerID);
    const coverImageFile = req.files.find(
      (file) => file.fieldname === "coverImage"
    );
    const coverImageName = coverImageFile ? generateFileName() : "";
    if (coverImageFile) {
      await uploadFile(
        coverImageFile.buffer,
        coverImageName,
        coverImageFile.mimetype
      );
    }

    // Handle logoImage
    // const logoImageFile = req.files?.logoImage ? req.files.logoImage[0] : null;
    const logoImageFile = req.files.find(
      (file) => file.fieldname === "logoImage"
    );
    const logoImageName = logoImageFile ? generateFileName() : "";
    if (logoImageFile) {
      await uploadFile(
        logoImageFile.buffer,
        logoImageName,
        logoImageFile.mimetype
      );
    }

    req.body.menuItems = JSON.parse(req.body.menuItems);
    // Handle itemImages
    // console.log("to check label is coming", req.body.menuItems);
    const menuItems = req.body.menuItems.map(async (menuItem, panelIndex) => {
      menuItem.items = menuItem.items.map(async (item, itemIndex) => {
        const itemImageFile = req.files.find(
          (file) => file.fieldname === `itemImage-${panelIndex}-${itemIndex}`
        );
        const itemImageName = itemImageFile ? generateFileName() : "";
        if (itemImageFile) {
          await uploadFile(
            itemImageFile.buffer,
            itemImageName,
            itemImageFile.mimetype
          );
        }

        return {
          ...item,
          itemImage: itemImageFile ? S3Url + itemImageName : "",
        };
      });

      return {
        ...menuItem,
        items: await Promise.all(menuItem.items),
      };
    });

    const newMenuCard = await MenuCard.create({
      name: req.body.name,
      coverImage: coverImageFile ? S3Url + coverImageName : "",
      logoImage: logoImageFile ? S3Url + logoImageName : "",
      managerID: managerID,
      adminID: manager.adminID,
      menuItems: await Promise.all(menuItems),
    });

    res.status(201).json({
      success: true,
      message: "Menu Card created successfully!",
      menucard: newMenuCard,
    });
  } catch (error) {
    console.error("Detailed Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
    next(error);
  }
};

const editMenuCard = async (req, res, next) => {
  console.log("req.files", req.files);
  try {
    const managerID = req.user._id;
    const MenuCardID = req.params.id;
    const manager = await Manager.findById(managerID);

    // Fetch the existing Menu Card
    const existingMenuCard = await MenuCard.findById(MenuCardID);
    if (!existingMenuCard) {
      return res.status(404).json({
        success: false,
        message: "Menu Card not found",
      });
    }

    const coverImageFile = req.files.find(
      (file) => file.fieldname === "coverImage"
    );
    let coverImageUrl = existingMenuCard.coverImage;

    if (coverImageFile) {
      const coverImageName = generateFileName();

      await uploadFile(
        coverImageFile.buffer,
        coverImageName,
        coverImageFile.mimetype
      );
      coverImageUrl = S3Url + coverImageName;

      // Delete the old cover image from S3
      if (existingMenuCard.coverImage) {
        const oldCoverImageKey = existingMenuCard.coverImage.split(S3Url)[1];
        await deleteFile(oldCoverImageKey);
      }
    }

    const logoImageFile = req.files.find(
      (file) => file.fieldname === "logoImage"
    );
    let logoImageUrl = existingMenuCard.logoImage;

    if (logoImageFile) {
      const logoImageName = generateFileName();

      await uploadFile(
        logoImageFile.buffer,
        logoImageName,
        logoImageFile.mimetype
      );

      logoImageUrl = S3Url + logoImageName;

      // Delete the old logo image from S3
      if (existingMenuCard.logoImage) {
        const oldLogoImageKey = existingMenuCard.logoImage.split(S3Url)[1];
        await deleteFile(oldLogoImageKey);
      }
    }

    //Handle Menu Items
    req.body.menuItems = JSON.parse(req.body.menuItems);
    const menuItems = req.body.menuItems.map(async (menuItem, panelIndex) => {
      menuItem.items = await Promise.all(
        menuItem.items.map(async (item, itemIndex) => {
          let itemImageUrl = item.itemImage[0].url; // Extract the url from the itemImage object
          const itemImageFile = req.files.find(
            (file) => file.fieldname === `itemImage-${panelIndex}-${itemIndex}`
          );
          if (itemImageFile) {
            const itemImageName = generateFileName();
            await uploadFile(
              itemImageFile.buffer,
              itemImageName,
              itemImageFile.mimetype
            );
            itemImageUrl = S3Url + itemImageName; // Update the itemImage only if a new file is sent
          }
          return {
            ...item,
            itemImage: itemImageUrl,
          };
        })
      );
      return menuItem;
    });
    // Update the Menu Card in the database
    existingMenuCard.name = req.body.name;
    existingMenuCard.coverImage = coverImageUrl;
    existingMenuCard.logoImage = logoImageUrl;
    existingMenuCard.managerID = managerID;
    existingMenuCard.adminID = manager.adminID;
    existingMenuCard.menuItems = await Promise.all(menuItems);

    const updatedMenuCard = await existingMenuCard.save();

    res.status(200).json({
      success: true,
      message: "Menu Card updated successfully!",
      menucard: updatedMenuCard,
    });
  } catch (error) {
    console.error("Detailed Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
    next(error);
  }
};

const viewAllMenuCards = async (req, res, next) => {
  try {
    const menucard = await MenuCard.find({
      managerID: req.user._id,
      status: { $ne: "delete" },
    })
      .sort({ createdDate: -1 })
      .exec();

    res.status(200).json({
      success: true,
      menucard,
      message: "All Menu Card Under This Service Manager",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const createWaiter = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const managerID = req.user._id;
    const menuCardID = req.params.id;
    const manager = await Manager.findById(managerID);
    const waiter = await Waiter.create({
      name,
      email,
      password: hash,
      managerID,
      menuCardID,
      adminID: manager.adminID,
    });

    res.status(200).json({
      success: true,
      message: "Waiter Created Successfully",
      data: waiter,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ success: false, message: "Manager Email Already exists" });
    }
    next(error);
  }
};

const viewAllWaiters = async (req, res, next) => {
  try {
    const managerID = req.user._id;
    const waiters = await Waiter.find({
      managerID: managerID,
      status: { $ne: "delete" },
    })
      .populate("menuCardID")
      .sort({ createdDate: -1 });

    const manager = await Manager.findOne({ _id: managerID });
    if (!manager) {
      return res.status(404).json({ message: "Manager not found" });
    }
    res.status(200).json({
      success: true,
      waiters,
      message: "All Employees Under This Service Manager",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const editWaiter = async (req, res, next) => {
  try {
    const waiterID = req.params.id;

    const waiter = await Waiter.findById(waiterID);

    // Update the in the database
    waiter.name = req.body.name;
    waiter.email = req.body.email;
    waiter.waiterID = req.body.waiterID;

    const updatedWaiter = await waiter.save();

    res.status(200).json({
      update: true,
      message: "Waiter updated successfully!",
      data: updatedWaiter,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ success: false, message: "Waiter Email Already exists" });
    }
    next(error);
  }
};
const createTable = async (req, res, next) => {
  try {
    const managerID = req.user._id;
    const manager = await Manager.findById(managerID);
    const table = await Table.create({
      tableID: req.body.tableID,
      managerID: managerID,
      adminID: manager.adminID,
    });

    // Generating QR code for the Table
    const URL = QRBase + table._id;
    const QRCodeLink = await generateQR(URL);
    table.QRCode = QRCodeLink;

    await table.save();
    res.status(200).json({
      success: true,
      message: "Table Created Successfully",
      data: table,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ success: false, message: "Table ID Already exists" });
    }
    next(error);
  }
};

const editTable = async (req, res, next) => {
  try {
    const tableID = req.params.id;

    const table = await Table.findById(tableID);

    // Update the in the database
    table.tableID = req.body.tableID;

    const updatedTable = await table.save();

    res.status(200).json({
      update: true,
      message: "Table updated successfully!",
      data: updatedTable,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ success: false, message: "Table ID Already exists" });
    }
    next(error);
  }
};

const viewAllTables = async (req, res, next) => {
  try {
    const managerID = req.user._id;
    const tables = await Table.find({
      managerID: managerID,
      status: { $ne: "delete" },
    })
      .populate("menuCardID")
      .sort({ createdDate: -1 });

    const manager = await Manager.findOne({ _id: managerID });
    if (!manager) {
      return res.status(404).json({ message: "Manager not found" });
    }
    res.status(200).json({
      success: true,
      tables,
      message: "All Tables Under This Service Manager",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const createKitchenStaff = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const managerID = req.user._id;
    const menuCardID = req.params.id;
    const manager = await Manager.findById(managerID);
    const kitchenStaff = await KitchenStaff.create({
      name,
      email,
      password: hash,
      managerID,
      menuCardID,
      adminID: manager.adminID,
    });

    res.status(200).json({
      success: true,
      message: "Kitchen Staff Created Successfully",
      data: kitchenStaff,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Kitchen Staff Email Already exists",
      });
    }
    next(error);
  }
};

const editKitchenStaff = async (req, res, next) => {
  try {
    const kitchenStaffID = req.params.id;

    const kitchenStaff = await KitchenStaff.findById(kitchenStaffID);

    // Update the in the database
    kitchenStaff.name = req.body.name;
    kitchenStaff.email = req.body.email;
    kitchenStaff.kitchenStaffID = req.body.kitchenStaffID;

    const updatedKitchenStaff = await kitchenStaff.save();

    res.status(200).json({
      update: true,
      message: "Kitchen Staff updated successfully!",
      data: updatedKitchenStaff,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Kitchen Staff Email Already exists",
      });
    }
    next(error);
  }
};

const viewAllKitchenStaff = async (req, res, next) => {
  try {
    const managerID = req.user._id;
    const kitchenStaff = await KitchenStaff.find({
      managerID: managerID,
      status: { $ne: "delete" },
    })
      .populate("menuCardID")
      .sort({ createdDate: -1 });

    const manager = await Manager.findOne({ _id: managerID });
    if (!manager) {
      return res.status(404).json({ message: "Manager not found" });
    }
    res.status(200).json({
      success: true,
      kitchenStaffs: kitchenStaff,
      message: "All Employees Under This Service Manager",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = {
  managerDashboard,
  createMenuCard,
  editMenuCard,
  viewAllMenuCards,
  createTable,
  editTable,
  viewAllTables,
  createWaiter,
  viewAllWaiters,
  editWaiter,
  createKitchenStaff,
  editKitchenStaff,
  viewAllKitchenStaff,
};

require("dotenv").config();
const Manager = require("../models/managerModel");
const Waiter = require("../models/waiterModel");
const MenuCard = require("../models/menuCardModel");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
// const {generateQR} = require("../helpers/qrCodeGenerator");
const { uploadFile, deleteFile } = require("../helpers/s3");

const S3Url = process.env.AWS_BUCKET_URL;

const generateFileName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");

const createMenuCard = async (req, res, next) => {
  try {
    // Handle coverImage
    const managerID = req.user._id;
    const manager = await Manager.findById(managerID);
    const coverImageFile = req.files?.coverImage
      ? req.files.coverImage[0]
      : null;
    const coverImageName = coverImageFile ? generateFileName() : "";
    if (coverImageFile) {
      await uploadFile(
        coverImageFile.buffer,
        coverImageName,
        coverImageFile.mimetype
      );
    }

    // Handle logoImage
    const logoImageFile = req.files?.logoImage ? req.files.logoImage[0] : null;
    const logoImageName = logoImageFile ? generateFileName() : "";
    if (logoImageFile) {
      await uploadFile(
        logoImageFile.buffer,
        logoImageName,
        logoImageFile.mimetype
      );
    }

    const newMenuCard = await MenuCard.create({
      name: req.body.name,
      coverImage: coverImageFile ? S3Url + coverImageName : "",
      logoImage: logoImageFile ? S3Url + logoImageName : "",
      managerID: managerID,
      adminID: manager.adminID,
    });

    res.status(201).json({
      success: true,
      message: "Menu Card created successfully!",
      newMenuCard,
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
  try {
    const MenuCardID = req.params.id;

    // Fetch the existing feedback
    const existingMenuCard = await MenuCard.findById(MenuCardID);
    if (!existingMenuCard) {
      return res.status(404).json({
        success: false,
        message: "Menu Card not found",
      });
    }

    // Handle coverImage
    const coverImageFile = req.files?.coverImage
      ? req.files.coverImage[0]
      : null;
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

    // Handle logoImage
    const logoImageFile = req.files?.logoImage ? req.files.logoImage[0] : null;
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

    // Update the feedback in the database
    existingMenuCard.name = req.body.name;
    existingMenuCard.type = req.body.type;
    existingMenuCard.coverImage = coverImageUrl;
    existingMenuCard.logoImage = logoImageUrl;

    const updatedMenuCard = await existingMenuCard.save();

    res.status(200).json({
      success: true,
      message: "Menu Card updated successfully!",
      updatedMenuCard,
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

const viewWaiters = async (req, res, next) => {
  try {
    const managerID = req.user._id;
    // const admin = await Admin.findById(adminID).exec();

    const waiters = await Waiter.find({
      managerID: managerID,
      status: { $ne: "delete" },
    }).sort({ createdDate: -1 });

    res.status(200).json({
      success: true,
      message: "Waiters Fetched Successfully",
      data: waiters,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createMenuCard,
  editMenuCard,
  viewAllMenuCards,
  createWaiter,
  editWaiter,
  viewWaiters,
};

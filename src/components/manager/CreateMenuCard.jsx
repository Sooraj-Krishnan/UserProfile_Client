import PropTypes from "prop-types";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { createMenuCard, editMenuCard } from "../../api/ManagerRequest";
import {
  Input,
  Typography,
  Form,
  Upload,
  Row,
  Col,
  Collapse,
  Tooltip,
  Select,
} from "antd";
import { IoAddCircleOutline, IoRemoveCircleOutline } from "react-icons/io5";
import UseSpinner from "../hooks/UseSpinner";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import "./CreateMenuCard.css";
import CoverImage from "../menuCard/CoverImage";
import HandleImageUpload from "../helper/ImageCompress";
import { UploadOutlined } from "@ant-design/icons";
import currencyCodes from "currency-codes";

const { Title } = Typography;
const { Panel } = Collapse;
const { TextArea } = Input;
const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

function CreateMenuCard({ menuCardData, edit }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loader] = UseSpinner();
  const [fileList3, setFileList3] = useState({});
  const [menuItems, setMenuItems] = useState(
    menuCardData?.menuItems
      ? menuCardData.menuItems
      : [
          {
            key: "1",
            label: "",
            currency: "",
            items: [
              { itemImage: "", itemName: "", price: "", description: "" },
            ],
          },
        ]
  );

  const addPanel = () => {
    const newPanel = {
      key: (menuItems.length + 1).toString(),
      label: "",
      currency: "",
      items: [{ itemImage: "", itemName: "", price: "", description: "" }],
    };
    setMenuItems([...menuItems, newPanel]);
  };

  const removePanel = (panelIndex) => {
    const newMenuItems = menuItems.filter((_, index) => index !== panelIndex);
    setMenuItems(newMenuItems);
  };

  const handleLabelChange = (panelIndex, newLabel) => {
    const newMenuItems = [...menuItems];
    newMenuItems[panelIndex].label = newLabel;
    setMenuItems(newMenuItems);
  };

  const handleCurrencyChange = (panelIndex, value) => {
    const newMenuItems = [...menuItems];
    newMenuItems[panelIndex].currency = value;
    setMenuItems(newMenuItems);
  };

  const addItem = (panelIndex) => {
    const newItems = [
      ...menuItems[panelIndex].items,
      { itemImage: "", itemName: "", price: "", description: "", image: "" },
    ];
    const newMenuItems = [...menuItems];
    newMenuItems[panelIndex].items = newItems;
    setMenuItems(newMenuItems);
  };

  const removeItem = (panelIndex, itemIndex) => {
    const newItems = menuItems[panelIndex].items.filter(
      (_, index) => index !== itemIndex
    );
    const newMenuItems = [...menuItems];
    newMenuItems[panelIndex].items = newItems;
    setMenuItems(newMenuItems);
  };

  const handleItemChange = (panelKey, itemKey, field, value) => {
    const newMenuItems = menuItems.map((panel) => {
      if (panel.key === panelKey) {
        const newItems = panel.items.map((item, index) => {
          if (index === itemKey) {
            return { ...item, [field]: value };
          }
          return item;
        });
        return { ...panel, items: newItems };
      }
      return panel;
    });
    setMenuItems(newMenuItems);
  };

  const [fileList1, setFileList1] = useState(
    menuCardData?.coverImage
      ? [
          {
            uid: "-1",
            name: "image.png",
            // status:  feedbackData.coverImage ? "done" : "",
            thumbUrl: menuCardData.coverImage,
          },
        ]
      : []
  );
  const [fileList2, setFileList2] = useState(
    menuCardData?.logoImage
      ? [
          {
            uid: "-1",
            name: "image.png",
            // status:  feedbackData.coverImage ? "done" : "",
            thumbUrl: menuCardData.logoImage,
          },
        ]
      : []
  );

  const onFinish = async (values) => {
    console.log("Received values of form: ", values);
    const errors = validateForm(values);
    if (Object.keys(errors).length === 0) {
      // showLoader();
      setIsSubmitting(true);

      const CoverImgCompress = await HandleImageUpload(fileList1);
      const LogoImgCompress = await HandleImageUpload(fileList2);

      const datas = new FormData();
      datas.append("name", values.name);
      datas.append("coverImage", values.fileList1[0].originFileObj);
      // datas.append("fileList2", values.fileList2);
      datas.append("logoImage", values.fileList2[0].originFileObj);

      datas.append("menuItems", JSON.stringify(values.menuItems));

      if (fileList1[0]?.originFileObj && fileList1[0]?.status !== "removed") {
        datas.append("coverImage", CoverImgCompress);
      }

      if (!fileList1[0]?.originFileObj && fileList1[0]?.status === "removed") {
        datas.append("coverImage", "delete");
      }

      if (fileList2[0]?.originFileObj && fileList2[0]?.status !== "removed") {
        datas.append("logoImage", LogoImgCompress);
      }

      if (!fileList2[0]?.originFileObj && fileList2[0]?.status === "removed") {
        datas.append("logoImage", "delete");
      }

      // Iterate over each key-value pair in fileList3
      for (const [key, fileList] of Object.entries(fileList3)) {
        if (fileList[0]?.originFileObj && fileList[0]?.status !== "removed") {
          const ItemImgCompress = await HandleImageUpload(fileList);
          datas.append(`itemImage-${key}`, ItemImgCompress);
        }
      }

      // Iterate again for deletion
      for (const [key, fileList] of Object.entries(fileList3)) {
        if (!fileList[0]?.originFileObj && fileList[0]?.status === "removed") {
          datas.append(`itemImage-${key}`, "delete");
        }
      }

      try {
        if (edit) {
          const response = await editMenuCard(menuCardData._id, datas);
          // hideLoder();
          console.log("Response from editMenuCard:", response);
          toast.success("Menu Card Updated", {
            position: "top-right",
            autoClose: 3000,
            theme: "dark",
          });
        } else {
          const response = await createMenuCard(datas);
          console.log("Response from createMenuCard:", response);

          toast.success("New Menu Card Created", {
            position: "top-right",
            autoClose: 3000,
            theme: "dark",
          });
        }

        setTimeout(() => {
          navigate("/all-menu-cards");
        }, 3000);
      } catch (error) {
        console.log(error);
        // hideLoder();
        toast.error("Error Creating Menu card", {
          position: "top-right",
          autoClose: 3000,
          theme: "dark",
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  const validateForm = (data) => {
    const error = {};

    if (!data.name) {
      error.name = " Restaurant name required";
    }
    return error;
  };

  const onFileChange1 = (e) => {
    let { fileList } = e;

    // Filter out any files that have been "removed"
    fileList = fileList.filter((file) => file.status !== "removed");

    setFileList1(fileList);
    return fileList;
  };

  const onFileChange2 = (e) => {
    let { fileList } = e;

    // Filter out any files that have been "removed"
    fileList = fileList.filter((file) => file.status !== "removed");

    setFileList2(fileList);
    return fileList;
  };

  const onFileChange3 = (panelIndex, itemIndex) => (e) => {
    let { fileList } = e;
    fileList = fileList.filter((file) => file.status !== "removed");

    setFileList3((prevFileLists) => ({
      ...prevFileLists,
      [`${panelIndex}-${itemIndex}`]: fileList,
    }));

    return fileList;
  };

  return (
    <div className="previewWrapBlock">
      <div className="md:w-7/12 flex justify-center scrollbar-hide">
        <div className="w-100">
          <div className="w-12/12  mt-10 ">
            <Title level={2}>
              {" "}
              {edit ? "Edit your Menu Card" : "Create your Menu Card"}{" "}
            </Title>
            <h3 className="text-md mb-7">Customize your profile</h3>

            <div className="my-5 flex flex-col gap-2 ">
              {/* ------------------------------ Here Put form -----------------------------  */}
              {(edit || (!edit && !menuCardData)) && (
                <Form
                  {...formItemLayout}
                  form={form}
                  name="register"
                  onFinish={onFinish}
                  initialValues={{
                    name: menuCardData?.name,
                    fileList1: fileList1,
                    fileList2: fileList2,
                    menuItems: menuCardData?.menuItems
                      ? menuCardData.menuItems.map(
                          (menuItem, menuItemIndex) => ({
                            ...menuItem,
                            items: menuItem.items.map((item, itemIndex) => ({
                              ...item,
                              itemImage: item.itemImage
                                ? [
                                    {
                                      uid: "-1",
                                      name: `image-${menuItemIndex}-${itemIndex}.png`,
                                      status: "done",
                                      url: item.itemImage,
                                    },
                                  ]
                                : [],
                            })),
                          })
                        )
                      : [
                          {
                            label: "",
                            currency: "",
                            items: [
                              {
                                itemImage: [],
                                itemName: "",
                                price: "",
                                description: "",
                              },
                            ],
                          },
                        ],
                  }}
                  style={{
                    width: 600,
                  }}
                  scrollToFirstError
                >
                  <div>
                    <label htmlFor="" className="text-xl font-semibold">
                      Name{" "}
                    </label>
                    <Form.Item
                      name="name"
                      // label="Name "
                      className="mb-2"
                      tooltip="What do you want others to call you?"
                      rules={[
                        {
                          required: true,
                          message: "Please input restaurant name!",
                          whitespace: true,
                        },
                      ]}
                    >
                      <Input className="py-2" />
                    </Form.Item>
                  </div>
                  <div className="grid grid-cols-2 gap-2 ">
                    <div>
                      <label htmlFor="" className="text-xl font-semibold">
                        Cover Image
                      </label>
                      <Form.Item
                        name="fileList1"
                        valuePropName="fileList"
                        getValueFromEvent={onFileChange1}
                        rules={[
                          {
                            required: true,
                            message: "Please upload cover image",
                          },
                        ]}
                      >
                        {/* <ImgCrop aspect={16 / 9} aspectSlider showReset> */}
                        {/* <ImgCrop rotationSlider> */}
                        <Upload
                          name="image1"
                          action="/create-menu-card"
                          listType="picture"
                          fileList={fileList1}
                          beforeUpload={() => false} // Prevent automatic upload
                        >
                          <Button icon={<UploadOutlined />}>
                            Click to Upload
                          </Button>
                        </Upload>
                        {/* </ImgCrop> */}
                      </Form.Item>
                    </div>
                    <div>
                      <label htmlFor="" className="text-xl font-semibold">
                        Logo Image
                      </label>
                      <Form.Item
                        name="fileList2"
                        valuePropName="fileList"
                        getValueFromEvent={onFileChange2}
                        rules={[
                          {
                            required: true,
                            message: "Please upload logo image",
                          },
                        ]}
                      >
                        {/* <ImgCrop aspect={16 / 9} aspectSlider showReset> */}
                        <Upload
                          name="fileList2"
                          action="/create-menu-card"
                          listType="picture"
                          fileList={fileList2}
                          beforeUpload={() => false} // Prevent automatic upload
                        >
                          <Button icon={<UploadOutlined />}>
                            Click to Upload
                          </Button>
                        </Upload>
                        {/* </ImgCrop> */}
                      </Form.Item>
                    </div>
                  </div>
                  <label htmlFor="" className="text-xl font-semibold">
                    Enter Your item details{" "}
                  </label>
                  <Tooltip title="Add Category">
                    <IoAddCircleOutline
                      onClick={addPanel}
                      size="1.7em"
                      style={{
                        color: "green",
                        marginLeft: "50%",
                        marginBottom: "8px",
                      }}
                    />
                  </Tooltip>

                  <Collapse>
                    {menuItems.map((panel, panelIndex) => (
                      <Panel header={panel.label} key={panel.key} forceRender>
                        <label htmlFor="" className="text-xl font-semibold">
                          Category{" "}
                        </label>
                        <Form.Item name={["menuItems", panelIndex, "label"]}>
                          <Input
                            value={panel.label}
                            onChange={(e) =>
                              handleLabelChange(panelIndex, e.target.value)
                            }
                          />
                        </Form.Item>
                        <label htmlFor="" className="text-xl font-semibold">
                          Select Currency{" "}
                        </label>
                        <Form.Item name={["menuItems", panelIndex, "currency"]}>
                          <Select
                            showSearch
                            placeholder="Select a currency"
                            onChange={(value) =>
                              handleCurrencyChange(panelIndex, value)
                            }
                          >
                            {currencyCodes.codes().map((code) => (
                              <Option key={code} value={code}>
                                {code}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                        {panel.items.map((item, itemIndex) => (
                          <Row key={itemIndex}>
                            {itemIndex !== 0 && (
                              <Tooltip title="Remove">
                                <IoRemoveCircleOutline
                                  onClick={() =>
                                    removeItem(panelIndex, itemIndex)
                                  }
                                  size="1.7em"
                                  style={{ color: "red", marginLeft: "50%" }}
                                />
                              </Tooltip>
                            )}
                            {/* Your existing item content here */}
                            <Col span={12}>
                              <label
                                htmlFor=""
                                className="text-xl font-semibold"
                              >
                                Item photo{" "}
                              </label>
                              <Form.Item
                                //  name={`menuItems[${panelIndex}].items[${itemIndex}].itemImage`}
                                name={[
                                  "menuItems",
                                  panelIndex,
                                  "items",
                                  itemIndex,
                                  "itemImage",
                                ]}
                                valuePropName="fileList"
                                getValueFromEvent={onFileChange3(
                                  panelIndex,
                                  itemIndex
                                )}
                                rules={[
                                  {
                                    required: true,
                                    message: "Please upload an image!",
                                  },
                                ]}
                              >
                                <Upload
                                  name={`itemImage_${panelIndex}-${itemIndex}`}
                                  action="/create-menu-card"
                                  listType="picture"
                                  beforeUpload={() => false} // Prevent automatic upload
                                >
                                  <Button icon={<UploadOutlined />}>
                                    Click to Upload
                                  </Button>
                                </Upload>
                              </Form.Item>
                              <div className="grid grid-cols-2 gap-2 ">
                                <div>
                                  <label
                                    htmlFor=""
                                    className="text-xl font-semibold"
                                  >
                                    Item Name{" "}
                                  </label>
                                  <Form.Item
                                    name={[
                                      "menuItems",
                                      panelIndex,
                                      "items",
                                      itemIndex,
                                      "itemName",
                                    ]}
                                    rules={[
                                      {
                                        required: true,
                                        message: "Please input item name!",
                                      },
                                    ]}
                                  >
                                    <Input
                                      placeholder="Item Name"
                                      value={item.name}
                                      onChange={(e) =>
                                        handleItemChange(
                                          panel.key,
                                          itemIndex,
                                          "itemName",
                                          e.target.value
                                        )
                                      }
                                    />
                                  </Form.Item>
                                </div>
                                <div>
                                  <label
                                    htmlFor=""
                                    className="text-xl font-semibold"
                                  >
                                    Item Price{" "}
                                  </label>
                                  <Form.Item
                                    name={[
                                      "menuItems",
                                      panelIndex,
                                      "items",
                                      itemIndex,
                                      "price",
                                    ]}
                                    rules={[
                                      {
                                        required: true,
                                        message: "Please input item price!",
                                      },
                                    ]}
                                  >
                                    <Input
                                      placeholder="Price"
                                      value={item.price}
                                      onChange={(e) =>
                                        handleItemChange(
                                          panel.key,
                                          itemIndex,
                                          "price",
                                          e.target.value
                                        )
                                      }
                                    />
                                  </Form.Item>
                                </div>
                              </div>
                              <label
                                htmlFor=""
                                className="text-xl font-semibold"
                              >
                                Item description{" "}
                              </label>
                              <Form.Item
                                name={[
                                  "menuItems",
                                  panelIndex,
                                  "items",
                                  itemIndex,
                                  "description",
                                ]}
                                rules={[
                                  {
                                    required: true,
                                    message: "Please input item description!",
                                  },
                                ]}
                              >
                                <TextArea
                                  placeholder="Item Description"
                                  value={item.description}
                                  onChange={(e) =>
                                    handleItemChange(
                                      panel.key,
                                      itemIndex,
                                      "description",
                                      e.target.value
                                    )
                                  }
                                />
                              </Form.Item>
                            </Col>
                          </Row>
                        ))}
                        <Tooltip title="Add more">
                          <IoAddCircleOutline
                            onClick={() => addItem(panelIndex)}
                            size="1.7em"
                            style={{ color: "green", marginLeft: "50%" }}
                          />
                        </Tooltip>
                      </Panel>
                    ))}
                  </Collapse>
                  {menuItems.length > 1 && (
                    <Tooltip title="Remove Category">
                      <IoRemoveCircleOutline
                        onClick={() => removePanel(menuItems.length - 1)}
                        size="1.7em"
                        style={{
                          color: "red",
                          marginLeft: "50%",
                          marginTop: "8px",
                        }}
                      />
                    </Tooltip>
                  )}
                  <Form.Item {...tailFormItemLayout} className="flex">
                    <Button
                      className="bg-blue-800 w-45 mt-2 "
                      loading={isSubmitting}
                      type="primary"
                      htmlType="submit"
                      style={{ marginLeft: "-36px", height: "40px" }}
                    >
                      {edit ? "Update your card" : "Create your card"}
                    </Button>
                  </Form.Item>
                </Form>
              )}

              <div></div>
              <div className="mt-5"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="md:w-5/12 flex items-center justify-end">
        <div className="flex ">
          <div className="mobilePreview">
            <div className="mobilePreviewB">
              <div className="themepreviewWrap">
                <CoverImage fileList1={fileList1} fileList2={fileList2} />
              </div>
            </div>
          </div>
        </div>
      </div>
      {loader}
      <ToastContainer />
    </div>
  );
}
CreateMenuCard.propTypes = {
  edit: PropTypes.bool,
  menuCardData: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    coverImage: PropTypes.string,
    logoImage: PropTypes.string,
    menuItems: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string,
        label: PropTypes.string,
        currency: PropTypes.string,
        items: PropTypes.arrayOf(
          PropTypes.shape({
            itemImage: PropTypes.string,
            itemName: PropTypes.string,
            price: PropTypes.string,
            description: PropTypes.string,
          })
        ),
      })
    ),
  }),
};

export default CreateMenuCard;

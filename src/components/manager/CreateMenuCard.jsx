import PropTypes from "prop-types";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { createMenuCard, editMenuCard } from "../../api/ManagerRequest";
import { Input, Typography, Form, Upload } from "antd";
import UseSpinner from "../hooks/UseSpinner";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import "./CreateMenuCard.css";
import HandleImageUpload from "../helper/ImageCompress";
import { UploadOutlined } from "@ant-design/icons";

const { Title } = Typography;

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

function CreateMenuCard({ MenuCardData, edit }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loader] = UseSpinner();

  const [fileList1, setFileList1] = useState(
    MenuCardData?.logoImage
      ? [
          {
            uid: "-1",
            name: "image.png",
            // status:  feedbackData.coverImage ? "done" : "",
            thumbUrl: MenuCardData.logoImage,
          },
        ]
      : []
  );
  const [fileList2, setFileList2] = useState(
    MenuCardData?.coverImage
      ? [
          {
            uid: "-1",
            name: "image.png",
            // status:  feedbackData.coverImage ? "done" : "",
            thumbUrl: MenuCardData.coverImage,
          },
        ]
      : []
  );

  const onFinish = async (values) => {
    const errors = validateForm(values);
    if (Object.keys(errors).length === 0) {
      // showLoader();
      setIsSubmitting(true);

      const LogoImgCompress = await HandleImageUpload(fileList1);
      const CoverImgCompress = await HandleImageUpload(fileList2);

      const datas = new FormData();
      datas.append("name", values.name);
      datas.append("type", values.type);
      if (fileList1[0]?.originFileObj && fileList1[0]?.status !== "removed") {
        datas.append("logoImage", LogoImgCompress);
      }

      if (!fileList1[0]?.originFileObj && fileList1[0]?.status === "removed") {
        datas.append("logoImage", "delete");
      }

      if (fileList2[0]?.originFileObj && fileList2[0]?.status !== "removed") {
        datas.append("coverImage", CoverImgCompress);
      }

      if (!fileList2[0]?.originFileObj && fileList2[0]?.status === "removed") {
        datas.append("coverImage", "delete");
      }

      try {
        if (edit) {
          const response = await editMenuCard(MenuCardData._id, datas);
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
        toast.error("Error Creating Feedback", {
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

  return (
    <div className="previewWrapBlock">
      <div className="md:w-7/12 flex justify-center overflow-auto scrollbar-hide">
        <div className="w-100">
          <div className="mt-3"></div>

          <div className="w-12/12  mt-10 ">
            <Title level={2}> Create your Menu Card</Title>
            <h3 className="text-md mb-7">Customize your profile</h3>

            <div className="my-5 flex flex-col gap-2 ">
              {/* ------------------------------ Here Put form -----------------------------  */}
              {(edit || (!edit && !MenuCardData)) && (
                <Form
                  {...formItemLayout}
                  form={form}
                  name="register"
                  onFinish={onFinish}
                  initialValues={{
                    name: MenuCardData?.name,
                    fileList1: fileList1,
                    fileList2: fileList2,
                  }}
                  style={{
                    // maxWidth: 600,
                    width: 600,
                  }}
                  scrollToFirstError
                >
                  <div className="grid grid-cols-2 gap-2 ">
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
                            message: "Please input service name!",
                            whitespace: true,
                          },
                        ]}
                      >
                        <Input className="py-2" />
                      </Form.Item>
                    </div>

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
                            message: "Please upload an Logo image",
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
                            message: "Please upload an cover image",
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
              <div className="themepreviewWrap"></div>
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
  MenuCardData: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    coverImage: PropTypes.string,
    logoImage: PropTypes.string,
  }),
};

export default CreateMenuCard;

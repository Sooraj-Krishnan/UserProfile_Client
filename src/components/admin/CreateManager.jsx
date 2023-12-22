import PropTypes from "prop-types";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Spin } from "antd";
import { Input, Typography, Form, InputNumber } from "antd";
// import Spinner from "../hooks/Spinner";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import Whatsapp from "../../../assests/images/WhatsApp.svg";

import { createManager, editManager } from "../../api/AdminRequest";
import "./CreateManager.css";

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
      span: 24,
      offset: 0,
    },
  },
};

function CreateManager({ edit, managerData }) {
  console.log("managerData", managerData);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const showLoader = () => {
    setLoading(true);
  };

  const hideLoader = () => {
    setLoading(false);
  };

  const onFinish = async (details) => {
    try {
      showLoader();
      const { data } = edit
        ? await editManager(managerData?._id, details)
        : await createManager(details);

      if (data.success) {
        hideLoader();
        toast.success("New Manager Created", {
          position: "top-right",
          autoClose: 3000,
          theme: "dark",
        });
      } else if (data.update) {
        hideLoader();
        toast.success("Updated Successfully", {
          position: "top-right",
          autoClose: 3000,
          theme: "dark",
        });
      }
      setTimeout(() => {
        navigate("/view-managers");
      }, 3000);
    } catch (error) {
      console.log(error);
      hideLoader();
      console.log("Error Message : ", error.response.data.message);
      toast.error(error.response.data.message, {
        position: "top-right",
        autoClose: 3000,
        theme: "dark",
      });
    }
  };

  const passRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return (
    <div className="previewWrapBlock">
      {loading && <Spin size="large" />}
      <div className="md:w-7/12 flex justify-center overflow-auto scrollbar-hide">
        <div className="w-100">
          <div className="w-12/12  mt-10 ">
            <Title level={2}>{edit ? "Edit Manager" : "Add Manager"}</Title>

            <div className="my-5 flex flex-col gap-2 ">
              <Form
                {...formItemLayout}
                form={form}
                name="register"
                onFinish={onFinish}
                initialValues={{
                  name: managerData?.name,
                  email: managerData?.email,
                  cardLimit: managerData?.cardLimit,
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
                      Manager's Name{" "}
                    </label>
                    <Form.Item
                      name="name"
                      // label="Name "
                      className="mb-2"
                      tooltip="What do you want others to call you?"
                      rules={[
                        {
                          required: true,
                          message: "Please input your name!",
                          whitespace: true,
                        },
                      ]}
                    >
                      <Input className="py-2" />
                    </Form.Item>
                  </div>

                  <div>
                    <label htmlFor="" className="text-xl font-semibold">
                      E-mail
                    </label>
                    <Form.Item
                      name="email"
                      // label="E-mail"
                      className="mb-2"
                      rules={[
                        {
                          type: "email",
                          message: "The input is not valid E-mail!",
                        },
                        {
                          required: true,
                          message: "Please input your E-mail!",
                        },
                      ]}
                    >
                      <Input className="py-2" />
                    </Form.Item>
                  </div>
                </div>
                <div>
                  <label htmlFor="" className="text-xl font-semibold">
                    Card Limit
                  </label>
                  <Form.Item
                    name="cardLimit"
                    // label="Employee Limit"
                    className="mb-2"
                    rules={[
                      {
                        required: true,
                        message: "Please input the employee limit!",
                      },
                      {
                        type: "number",
                        min: 0,
                        message: "Employee limit must be a positive number!",
                      },
                    ]}
                  >
                    <InputNumber
                      className="py-2 hide-input-arrows"
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </div>

                <div className="grid grid-cols-2 gap-2 "></div>

                {edit ? (
                  ""
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-2 ">
                      <div>
                        <label htmlFor="" className="text-xl font-semibold">
                          Password
                        </label>
                        <Form.Item
                          name="password"
                          //   label="Password"
                          className="mb-2"
                          rules={[
                            {
                              required: true,
                              message: "Please input your password!",
                            },
                            {
                              pattern: passRegex,
                              message:
                                "password should contain Minimum 8 characters, at least one number, one uppercase and one lowercase letter and one special character!",
                            },
                          ]}
                          hasFeedback
                        >
                          <Input.Password className="py-2" />
                        </Form.Item>
                      </div>
                      <div>
                        <label htmlFor="" className="text-xl font-semibold">
                          Confirm Password
                        </label>
                        <Form.Item
                          name="confirm"
                          // label="Confirm Password"
                          className="mb-2"
                          dependencies={["password"]}
                          hasFeedback
                          rules={[
                            {
                              required: true,
                              message: "Please confirm your password!",
                            },
                            ({ getFieldValue }) => ({
                              validator(_, value) {
                                if (
                                  !value ||
                                  getFieldValue("password") === value
                                ) {
                                  return Promise.resolve();
                                }
                                return Promise.reject(
                                  new Error(
                                    "The two passwords that you entered do not match!"
                                  )
                                );
                              },
                            }),
                          ]}
                        >
                          <Input.Password className="py-2" />
                        </Form.Item>
                      </div>
                    </div>
                  </>
                )}
                <Form.Item {...tailFormItemLayout} className="flex ">
                  <Button
                    className="bg-blue-800  mt-2 "
                    type="primary"
                    htmlType="submit"
                  >
                    {edit ? "Update" : " Register"}
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer />
      <button className="fixed bottom-5 right-3">
        <a href="https://wa.me/+971505363704?text=Hi%2C" target="blank">
          <img src={Whatsapp} alt="WhatsappImage" />
        </a>
      </button>
    </div>
  );
}
CreateManager.propTypes = {
  edit: PropTypes.bool,
  managerData: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    cardLimit: PropTypes.number,
  }),
};

export default CreateManager;

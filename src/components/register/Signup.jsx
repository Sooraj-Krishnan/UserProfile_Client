import { useState } from "react";
import Styles from "./styles.module.scss";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Form, Input, Checkbox, Modal } from "antd";
import { FiX } from "react-icons/fi";
// import "antd/dist/reset.css";

import { register } from "../../api/AdminRequest";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
function Signup() {
  // const [checked, setCheckedL] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const togglePasswordVisibility1 = () => {
    setShowPassword1(!showPassword1);
  };

  const togglePasswordVisibility2 = () => {
    setShowPassword2(!showPassword2);
  };

  // const onChangeL = (e) => {
  //   setCheckedL(e.target.checked);
  //   navigate("/login");
  // };

  const passRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const phoneRegex = /^!*([0-9]!*){10,}$/;
  const navigate = useNavigate();
  const location = useLocation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    // setIsModalOpen(true);
    navigate("/privacy-policy", { state: { from: location } });
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const [loginError, setLoginError] = useState("");
  // const dispatch = useDispatch();
  const handleSubmit = async (loginData) => {
    try {
      const { data } = await register(loginData);
      console.log("sign up", data);
      if (data.success) {
        toast.success("Succesfully registered, Please login..", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        setTimeout(() => {
          navigate("/login");
        }, 2500);
      }
    } catch (error) {
      console.log(error.response.data.message);
      setLoginError(error.response.data.message);
    }
  };

  return (
    <>
      <div className={Styles.bgRegister}>
        <div className={Styles.container}>
          <div className="flex justify-start items-center h-screen">
            <div className={Styles.bgformbgimg}>
              <Link to="/" className="flex justify-end m-0  p-3 items-center">
                <FiX className="text-white text-[25px] font-bold m-0" />
              </Link>

              <div className={Styles.bgform}>
                <h1 className="text-white text-3xl mt-0 font-semibold tracking-wide flex items-center justify-center lg:w-96 m-auto ">
                  Welcome
                </h1>
                <p className="text-[#CEAF54] text-base font-medium flex lg:mt-4 md:mt-4 mt-2 items-center text-center justify-center lg:w-[431px] m-auto ">
                  Create your account to get started.
                </p>
                <Form
                  className="lg:mt-[20px] md:mt-[20px] mt-2"
                  onFinish={handleSubmit}
                >
                  {/* <form className="mt-[20px]" onSubmit={handleSubmit}> */}
                  <Form.Item
                    name="name"
                    rules={[
                      {
                        type: "text",
                        message: "The input is name",
                      },
                      {
                        required: true,
                        message: "Please input your name",
                      },
                    ]}
                  >
                    <Input
                      className="px-4 py-2  text-[14px] font-medium flex items-center text-[#E6E6E6] outline-none lg:w-full md:w-96 w-full h-11 border border-gray-300 rounded-lg bg-transparent placeholder:text-[#E6E6E6] focus:ring-0 focus:border-gray-300 focus:outline-none hover:bg-transparent hover:border-gray-300"
                      placeholder="Name"
                      type="text"
                    />
                  </Form.Item>
                  {/* <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`px-4 py-2 text-xs font-medium flex items-center text-gray-400 focus:outline-none lg:w-96 md:w-96 w-full h-11 border border-gray-300 rounded-lg bg-transparent ${
                    errors.name && "border-red-500"
                  }`}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs">{errors.name}</p>
                )} */}
                  <Form.Item
                    name="email"
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
                    <Input
                      className="px-4 py-2  text-[14px] font-medium flex items-center text-[#E6E6E6] outline-none lg:w-full md:w-96 w-full h-11 border border-gray-300 rounded-lg bg-transparent placeholder:text-[#E6E6E6] focus:ring-0 focus:border-gray-300 focus:outline-none hover:bg-transparent hover:border-gray-300"
                      placeholder="Official Email"
                    />
                  </Form.Item>

                  <Form.Item
                    name="phone"
                    rules={[
                      {
                        pattern: phoneRegex,
                        message: "The input is not valid Mobile Number",
                      },
                      {
                        required: true,
                        message: "Please input your Phone number!",
                      },
                    ]}
                  >
                    <Input
                      className="px-4 py-2  text-[14px] font-medium flex items-center text-[#E6E6E6] outline-none lg:w-full md:w-96 w-full h-11 border border-gray-300 rounded-lg bg-transparent placeholder:text-[#E6E6E6] focus:ring-0 focus:border-gray-300 focus:outline-none hover:bg-transparent hover:border-gray-300"
                      placeholder="Phone number"
                    />
                  </Form.Item>
                  <div className="relative">
                    <Form.Item
                      name="password"
                      className="lg:w-[430px] md:w-[430px]"
                      rules={[
                        {
                          pattern: passRegex,
                          message:
                            "Minimum 8 characters, 1 number, 1 uppercase and lowercase letter and 1 special character!",
                        },
                        {
                          required: true,
                          message: "Please input your password!",
                        },
                      ]}
                    >
                      <Input
                        type={showPassword1 ? "text" : "password"}
                        className="px-4 py-2 text-[14px] font-medium flex items-center text-[#E6E6E6] outline-none lg:w-full md:w-96 w-full h-11 border border-gray-300 rounded-lg bg-transparent placeholder:text-[#E6E6E6] focus:ring-0 focus:border-gray-300 focus:outline-none hover:bg-transparent hover:border-gray-300"
                        placeholder="Password*"
                      />
                    </Form.Item>
                    <span
                      className="absolute top-[12px] right-[20px]"
                      onClick={togglePasswordVisibility1}
                    >
                      {showPassword1 ? (
                        <EyeOutlined
                          style={{ fontSize: "16px", color: "#DDB34A" }}
                        />
                      ) : (
                        <EyeInvisibleOutlined
                          style={{ fontSize: "16px", color: "#DDB34A" }}
                        />
                      )}
                    </span>
                  </div>

                  <div className="relative">
                    <Form.Item
                      name="confirmPassword"
                      dependencies={["password"]}
                      rules={[
                        {
                          required: true,
                          message: "Please confirm your password!",
                        },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (!value || getFieldValue("password") === value) {
                              return Promise.resolve();
                            }
                            return Promise.reject(
                              new Error("Passwords do not match!")
                            );
                          },
                        }),
                      ]}
                      style={{ margin: 0 }}
                    >
                      <Input
                        type={showPassword2 ? "text" : "password"}
                        className="px-4 py-2 text-[14px] font-medium flex items-center text-[#E6E6E6] outline-none lg:w-full md:w-96 w-full h-11 border border-gray-300 rounded-lg bg-transparent placeholder:text-[#E6E6E6] focus:ring-0 focus:border-gray-300 focus:outline-none hover:bg-transparent hover:border-gray-300"
                        placeholder="Confirm Password"
                      />
                    </Form.Item>
                    <span
                      className="absolute right-[20px] top-[12px] "
                      onClick={togglePasswordVisibility2}
                    >
                      {showPassword2 ? (
                        <EyeOutlined
                          style={{ fontSize: "16px", color: "#DDB34A" }}
                        />
                      ) : (
                        <EyeInvisibleOutlined
                          style={{ fontSize: "16px", color: "#DDB34A" }}
                        />
                      )}
                    </span>
                  </div>

                  <Form.Item
                    name="agreement"
                    valuePropName="checked"
                    rules={[
                      {
                        validator: (_, value) =>
                          value
                            ? Promise.resolve()
                            : Promise.reject(
                                new Error("Should accept terms and conditions")
                              ),
                      },
                    ]}
                    style={{ marginTop: 10 }} // Change marginTop to 0 to remove the space
                  >
                    <Checkbox style={{ margin: 0 }}>
                      <span
                        style={{ color: "white" }}
                        className="lg:w-263 md:w-263 h-18 font-poppins font-medium  text-[12px] text-white flex items-center justify-end"
                      >
                        {" "}
                        Accept the{" "}
                        <span className="" onClick={showModal}>
                          {" "}
                          Terms of Use and Privacy Policy.
                        </span>{" "}
                      </span>
                    </Checkbox>
                  </Form.Item>

                  {loginError && (
                    <span className="text-red-500 mx-2">{loginError}</span>
                  )}
                  <button
                    type="submit"
                    className="flex justify-center items-center text-black text-base font-medium leading-5 tracking-wide gap-2 p-2 lg:w-full md:w-96 w-full h-11 bg-[#CEAF54] rounded-lg"
                  >
                    Sign Up
                  </button>

                  {/* </form> */}
                </Form>
                <Link
                  to="/login"
                  className=" lg:mt-3 md:mt-3 mt-2 text-base font-medium cursor-pointer flex items-center justify-center tracking-wide"
                >
                  <p className="text-white m-0">
                    Already member?{" "}
                    <span className="text-[#CEAF54]">Login</span>
                  </p>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <Modal
          title="Terms and Conditions"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={null}
          bodyStyle={{ height: "400px" }}
        >
          <div className="h-[400px] overflow-auto scrollbar-hide">
            <p>
              At ZEEQR, we are committed to protecting the privacy and security
              of your personal information. This Privacy Policy outlines the
              types of information we collect through our NFC QR-enabled smart
              business card signup process, how we use and protect that
              information, and your rights and choices regarding your personal
              data.
            </p>
            <p>Information Collection and Usage</p>
            <p>
              1.1 Personal Information During the NFC QR-enabled smart business
              card signup process, we may collect the following personal
              information from you:
            </p>
            <p>
              Full name Email address Phone number Company name Job title
              Profile picture (optional) Social media profiles (optional)
            </p>
            <p>
              1.2 Usage of Personal Information We use the collected personal
              information for the following purposes:
            </p>
            <p>
              To create and manage your account To provide you with access to
              our services and features To communicate with you regarding our
              products, services, and updates To personalize your experience and
              tailor our services to your preferences To improve our services,
              analyze usage patterns, and conduct research To respond to your
              inquiries and provide customer support To protect the security and
              integrity of our systems Data Sharing and Disclosure
            </p>
            <p>
              2.1 Third-Party Service Providers We may engage trusted
              third-party service providers to assist us in delivering our
              services. These service providers have access to your personal
              information solely for the purpose of performing specific tasks on
              our behalf and are obligated not to disclose or use it for any
              other purpose.
            </p>
            <p>
              2.2 Legal Compliance and Protection We may disclose your personal
              information if required by law, regulation, or legal process, or
              if we believe it is necessary to protect our rights, property, or
              the safety of our users or others.
            </p>
            <p>
              Data Security We take reasonable precautions to protect your
              personal information from unauthorized access, use, or disclosure.
              We use industry-standard security measures, including encryption
              and access controls, to safeguard your data. However, please be
              aware that no method of transmission over the Internet or
              electronic storage is 100% secure, and we cannot guarantee
              absolute security.
            </p>
            <p>
              Data Retention We retain your personal information for as long as
              necessary to fulfill the purposes outlined in this Privacy Policy
              unless a longer retention period is required or permitted by law.
              When your personal information is no longer needed, we will
              securely dispose of it in accordance with applicable laws and
              regulations.
            </p>
            <p>Your Rights and Choices</p>
            <p>
              5.1 Access and Updates You have the right to access, update, and
              correct inaccuracies in your personal information. You can do this
              by accessing your account settings or by contacting us using the
              information provided at the end of this Privacy Policy.
            </p>
            <p>
              5.2 Marketing Communications You can choose to opt-out of
              receiving promotional emails or marketing communications from us
              by following the unsubscribe instructions provided in those
              communications or by contacting us. However, please note that even
              if you opt out, we may still send you non-promotional messages,
              such as those related to your account or our ongoing business
              relationship.
            </p>
            <p>
              5.3 Cookies and Tracking Technologies We use cookies and similar
              tracking technologies to collect information about your usage of
              our services. You can manage your cookie preferences by adjusting
              your browser settings or by using the cookie consent management
              tools provided on our website.
            </p>
            <p>
              Children's Privacy Our services are not intended for individuals
              under the age of 16. We do not knowingly collect personal
              information from children. If we become aware that we have
              inadvertently collected personal information from a child under
              16, we will take steps to delete it as soon as possible. If you
              believe that we may have collected personal information from a
              child under 16, please contact us.
            </p>
            <p>
              Changes to this Privacy Policy We may update this Privacy Policy
              from time to time. The most.
            </p>
          </div>
        </Modal>
        <ToastContainer />
      </div>
    </>
  );
}

export default Signup;

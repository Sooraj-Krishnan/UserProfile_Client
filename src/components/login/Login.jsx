import { useState } from "react";
import { Form, Input, Button, Checkbox } from "antd";
import Styles from "./styles.module.scss";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiX } from "react-icons/fi";
import "antd/dist/reset.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { login, forgotPassword } from "../../api/AdminRequest";

import Countdown from "react-countdown";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
function LoginArea() {
  const navigate = useNavigate();
  const [checkedS, setCheckedS] = useState(false);
  const onChangeS = (e) => {
    setCheckedS(e.target.checked);
    navigate("/register");
  };
  const [loginError, setLoginError] = useState("");
  const [, setOTPError] = useState("");
  const [otpCmp, setOtpCmp] = useState(false);
  const [resend, setResend] = useState(false);
  const [resendBtn, setResendBtn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [loadings, setLoadings] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const handleSubmit = async (loginData) => {
    setLoginError("");

    try {
      const { data } = await login(loginData);

      if (data.success) {
        if (data.admin) {
          localStorage.setItem("admin-refToken", data.refreshToken);
          navigate("/admin-dashboard");
        } else if (data.user) {
          localStorage.setItem("manager-refToken", data.refreshToken);
          navigate("/manager-dashboard");
        }
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Something went wrong";
      console.log("error message : ", errorMessage);
      setLoginError(errorMessage);
    }
  };

  const handleOTPSubmit = async (otpEmail) => {
    setOTPError("");

    const datas = {
      email: otpEmail.email,
    };

    try {
      setResendBtn(false);
      setLoadings(true);
      const { data } = await forgotPassword(datas);
      if (data.success) {
        toast.success(`Link Send to your Email ID ${otpEmail.email}`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        setResend(true);
        setLoadings(false);
        setTimeout(() => {
          setResendBtn(true);
        }, "60000");
      }
    } catch (error) {
      console.log("error message", error?.response?.data?.message);
      setOTPError(error.response.data.message);
      setResend(false);
      setLoadings(false);
      toast.warn(error.response.data.message);
    }
  };

  return (
    <div>
      <div className={Styles.background}>
        <div className={Styles.loginwrap}>
          {otpCmp ? (
            //---------------------------Forgott Form-----------------------------
            <div className={Styles.loginForm}>
              <div className={Styles.content}>
                <h3>
                  We get it, stuff happens. Just enter your email address below
                  and we'll send you a link to reset your password!
                </h3>
              </div>

              <div>
                <div className={Styles.card_body}>
                  <Form onFinish={handleOTPSubmit}>
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
                        className={Styles.form_control}
                        placeholder="Official Email"
                      />
                    </Form.Item>

                    <div
                      className="form-group mb-0"
                      style={{ display: "flex" }}
                    >
                      <button
                        className={Styles.btn_primary}
                        onClick={() => {
                          setOtpCmp(false);
                          setResendBtn(false);
                          setResend(false);
                        }}
                      >
                        Back
                      </button>

                      {resend ? (
                        resendBtn ? (
                          <Button
                            className={Styles.btn_primary}
                            style={{ marginLeft: "20px" }}
                            htmlType="submit"
                            loading={loadings}
                          >
                            Resend Link
                          </Button>
                        ) : (
                          <button
                            className={Styles.btn_primary}
                            style={{ marginLeft: "20px" }}
                            type="submit"
                          >
                            <Countdown
                              className="ml-3"
                              date={Date.now() + 60000}
                            />
                          </button>
                        )
                      ) : (
                        <Button
                          className={Styles.btn_primary}
                          style={{ marginLeft: "20px" }}
                          htmlType="submit"
                          loading={loadings}
                        >
                          Send
                        </Button>
                      )}
                    </div>
                  </Form>
                </div>
              </div>
            </div>
          ) : (
            //---------------------------------------Login Form---------------------------------------------------------------
            <div className={Styles.loginForm}>
              <div className={Styles.signin}>
                <h3>Please signing to continue</h3>

                <a href="http://zeeqr.com">
                  <FiX className={Styles.fix} />
                </a>
              </div>

              <div>
                <div className={Styles.checkbox}>
                  <div>
                    <div className={Styles.Privacy}>
                      <Checkbox checked={checkedS} onChange={onChangeS}>
                        <span style={{ color: "white" }}>
                          New User? Sign UP
                        </span>
                      </Checkbox>
                    </div>
                  </div>
                  <div className={Styles.check}>
                    <div className={Styles.Privacy}>
                      {/* <Checkbox checked={true}>
                        {" "}
                        <span style={{ color: "white" }}>
                          I’m an existing user{" "}
                        </span>{" "}
                      </Checkbox> */}
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <Form onFinish={handleSubmit}>
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
                        className={Styles.form_control}
                        placeholder="Official Email"
                      />
                    </Form.Item>

                    <Form.Item
                      name="password"
                      rules={[
                        {
                          required: true,
                          message: "Please input your password!",
                        },
                      ]}
                    >
                      <Input
                        type={showPassword ? "text" : "password"}
                        className={Styles.form_control}
                        placeholder="Password*"
                      />
                    </Form.Item>
                    <span
                      className="absolute top-[85px] right-5 cursor-pointer"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? (
                        <EyeOutlined
                          style={{ fontSize: "16px", color: "#DDB34A" }}
                        />
                      ) : (
                        <EyeInvisibleOutlined
                          style={{ fontSize: "16px", color: "#DDB34A" }}
                        />
                      )}
                    </span>

                    {loginError ? (
                      <span className="text-red-500 mx-2">{loginError}</span>
                    ) : (
                      ""
                    )}

                    <div className="form-group mb-0">
                      <button className={Styles.btn_primary} type="submit">
                        LogIn
                      </button>
                    </div>
                    <div
                      className={Styles.forgot}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <a href="/forgot_password" className={Styles.text_white}>
                        <Link
                          onClick={() => {
                            setOtpCmp(true);
                          }}
                        >
                          Forgot Password?
                        </Link>
                      </a>
                    </div>
                  </Form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default LoginArea;

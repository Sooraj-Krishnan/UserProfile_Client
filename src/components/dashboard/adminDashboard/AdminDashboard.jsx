import { useState, useEffect } from "react";
import ms from "ms";
import { Typography, Row, Col, Spin, Form, Input, Avatar, Switch } from "antd";
import { adminDashboard, editAdminProfile } from "../../../api/AdminRequest";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const { TextArea } = Input;
const { Title } = Typography;

const AdminDashboard = () => {
  const [loader, setLoader] = useState(true);
  const [adminData, setAdminData] = useState(null);
  const [form] = Form.useForm();

  const fetchAdminData = async () => {
    try {
      const { data } = await adminDashboard();
      setAdminData(data);
    } catch (error) {
      console.log(error.message);
      if (error.response && error.response.status === 403) {
        // ErrorLogout(error);
      }
    }
  };

  useEffect(() => {
    fetchAdminData();
    const interval = setInterval(() => {
      fetchAdminData();
    }, ms("1d"));

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setLoader(!adminData);
    if (adminData) {
      form.setFieldsValue({
        name: adminData.admin.name,
        email: adminData.admin.email,
        role: adminData.admin.isAdmin ? "Admin" : "Normal User",
        bio: adminData.admin.bio,
        profileImage: adminData.admin.profileImage,
        profileImageUrl: adminData.admin.profileImage,
        isPublic: adminData.admin.isPublic,
      });
    }
  }, [adminData, form]);

  const handleFormSubmit = async (values) => {
    try {
      const response = await editAdminProfile(values);
      if (response.data.success) {
        toast.success("Profile updated successfully!", {
          position: "top-right",
          autoClose: 2000,
        });
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        toast.error(response.message, {
          position: "top-right",
          autoClose: 2000,
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("An error occurred while updating the profile.", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const adminName = adminData?.admin?.name;

  return (
    <div>
      <Spin spinning={loader} size="large">
        <Row style={{ width: "100%" }}>
          <Col span={12}>
            <Title level={1}>{`Hello, ${adminName}`}</Title>
          </Col>
          <Col span={12} style={{ textAlign: "right" }}></Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleFormSubmit}
              initialValues={{
                name: adminData?.admin?.name,
                email: adminData?.admin?.email,
                role: adminData?.admin?.isAdmin ? "Admin" : "Normal User",
                bio: adminData?.admin?.bio,
                profileImage: adminData?.admin?.profileImage,
                profileImageUrl: adminData?.admin?.profileImage,
                isPublic: adminData?.admin?.isPublic,
              }}
            >
              <Form.Item name="profileImage">
                <Avatar size={128} src={form.getFieldValue("profileImage")} />
              </Form.Item>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="profileImageUrl"
                    label="Profile Image URL"
                    rules={[
                      {
                        // required: true,
                        message: "Please provide an image URL",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="name"
                    label="Name"
                    rules={[
                      {
                        required: true,
                        message: "Please input your name",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                      {
                        required: true,
                        message: "Please input your email",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="role" label="Role">
                    <Input disabled />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="password"
                    label="Change Password"
                    rules={[
                      {
                        // required: true,
                        message: "Please input your password",
                      },
                    ]}
                  >
                    <Input.Password />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="confirmPassword"
                    label="Confirm Password"
                    dependencies={["password"]}
                    rules={[
                      {
                        // required: true,
                        message: "Please confirm your password",
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue("password") === value) {
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
                    <Input.Password />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item name="bio" label="Bio">
                <TextArea rows={4} />
              </Form.Item>
              <Row>
                <Col span={12}>
                  <Form.Item
                    name="isPublic"
                    label="Make Public"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                </Col>
                <Col span={12} style={{ textAlign: "right" }}>
                  <button
                    type="submit"
                    style={{
                      backgroundColor: "blue",
                      color: "white",
                      border: "none",
                      padding: "10px 20px",
                    }}
                  >
                    Edit Profile
                  </button>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </Spin>

      <ToastContainer />
    </div>
  );
};

export default AdminDashboard;

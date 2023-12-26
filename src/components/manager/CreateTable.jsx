import PropTypes from "prop-types";
//import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { createTable, editTable } from "../../api/ManagerRequest";
import { Input, Typography, Form, Button } from "antd";
import UseSpinner from "../hooks/UseSpinner";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import "./CreateMenuCard.css";

const { Title } = Typography;
// const { Option } = Select;

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

function CreateTable({ id, tableData, edit }) {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loader, showLoader, hideLoader] = UseSpinner();
  const onFinish = async (details) => {
    try {
      showLoader();
      const { data } = edit
        ? await editTable(tableData?._id, details)
        : await createTable(id, details);

      if (data.success) {
        hideLoader();
        toast.success("New Table Created", {
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
        navigate("/all-tables");
      }, 3000);
    } catch (error) {
      console.log(error);
      hideLoader();
      if (error.response) {
        console.log("Error Message : ", error.response.data.message);
        toast.error(error.response.data.message, {
          position: "top-right",
          autoClose: 3000,
          theme: "dark",
        });
      } else {
        console.log("Error: ", error);
      }
    }
  };

  return (
    <div className="previewWrapBlock">
      <div className="md:w-7/12 flex justify-center overflow-auto scrollbar-hide">
        <div className="w-100">
          <div className="mt-3"></div>
          <div className="w-12/12 mt-10 ">
            <Title level={2}>{edit ? "Edit Table" : "Create Table"}</Title>
            <h3 className="text-md mb-7">Customize your table</h3>
            <div className="my-5 flex flex-col gap-2 ">
              {/* {(edit || (!edit && id)) && ( */}
              <Form
                {...formItemLayout}
                form={form}
                name="register"
                onFinish={onFinish}
                initialValues={{
                  tableID: edit ? tableData?.tableID : "",
                }}
                style={{
                  width: 600,
                }}
                scrollToFirstError
              >
                <div className="grid grid-cols-2 gap-2 ">
                  {/* <div className="flex flex-col gap-2"> */}

                  <div>
                    <label htmlFor="" className="text-xl font-semibold">
                      Table ID{" "}
                    </label>
                    <Form.Item
                      name="tableID"
                      className="mb-2"
                      rules={[
                        {
                          required: true,
                          message: "Please enter table id!",
                          whitespace: true,
                        },
                      ]}
                    >
                      <Input className="py-2" placeholder="Enter Table ID" />
                    </Form.Item>
                  </div>

                  <Form.Item
                    {...tailFormItemLayout}
                    className="col-span-2 flex"
                  >
                    <Button
                      style={{ marginLeft: "-36px", height: "40px" }}
                      className="bg-blue-800 w-45 mt-2"
                      type="primary"
                      htmlType="submit"
                    >
                      {edit ? "Update Table" : "Create Table"}
                    </Button>
                  </Form.Item>
                </div>
              </Form>
              {/* )} */}
            </div>
          </div>
        </div>
      </div>
      {loader}
      <ToastContainer />
    </div>
  );
}
CreateTable.propTypes = {
  edit: PropTypes.bool,
  id: PropTypes.string,
  tableData: PropTypes.shape({
    _id: PropTypes.string,
    tableID: PropTypes.number,
  }),
};
export default CreateTable;

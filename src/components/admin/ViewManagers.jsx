import { useState, useEffect } from "react";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { Button, Table, Col, Row, Typography } from "antd";
import { Modal } from "antd";
//import ErrorLogout from "../../../helper/ErrorLogout";
import "./ViewManagers.css";
import {
  viewManagers,
  blockManager,
  deleteManager,
} from "../../api/AdminRequest";
import useColumnSearch from "../hooks/useColumnSearch";

import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const { confirm } = Modal;

function ViewManagers() {
  const getColumnSearchProps = useColumnSearch();
  const navigate = useNavigate();

  const [managers, setManagers] = useState([]);
  const [block, setBlock] = useState();
  const [loader, setLoader] = useState(true);
  const [BtLoaderId, setBtLoaderId] = useState("");
  const [delLoaderId, setDelLoaderId] = useState("");

  const handleBlock = async (id) => {
    confirm({
      title: `${
        id?.block
          ? "Do you Want to Unblock the Service "
          : "Do you Want to Block the Service"
      }`,
      icon: <ExclamationCircleFilled />,
      //   content: 'Some descriptions',
      onOk() {
        setBtLoaderId(id._id);
        const block = async () => {
          try {
            const { data } = await blockManager(id._id);

            if (data.success) {
              setBlock(Date.now());
              setBtLoaderId("");
            }
          } catch (error) {
            console.log(error.message);
          }
        };
        block();
      },
      onCancel() {},
    });
  };

  const handleDelete = async (id) => {
    confirm({
      title: "Do you Want to Delete the Service",
      icon: <ExclamationCircleFilled />,
      content:
        "if you delete the service  it will effect all the features under the service .",
      onOk() {
        setDelLoaderId(id._id);
        const block = async () => {
          try {
            const { data } = await deleteManager(id._id);

            if (data.delete) {
              setBlock(Date.now());
              setDelLoaderId("");
            }
          } catch (error) {
            console.log(error.message);
          }
        };
        block();
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const handleEdit = (details) => {
    navigate("/edit-manager", { state: { details } });
  };

  useEffect(() => {
    const getService = async () => {
      try {
        const { data } = await viewManagers();
        console.log("view managers", data);
        setManagers(data.data);
        console.log("managers", data.data);
        setLoader(false);
      } catch (error) {
        console.log(error.message);
        //     if (error.response.status === 403) {
        //   ErrorLogout(error);
        //     }
      }
    };

    getService();
    //   limit();
  }, [block]);

  const columns = [
    {
      title: "No.",
      dataIndex: "_id",
      key: "index",
      width: "5%",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "25%",
      ...getColumnSearchProps("name"),
    },
    {
      title: "Employee Limit",
      dataIndex: "cardLimit",
      key: "cardLimit",
      width: "15%",
    },

    {
      title: "Created Date",
      dataIndex: "createdDate",
      key: "createdDate",
      render: (date) => {
        const formattedDate = new Date(date);
        const dateString = formattedDate.toLocaleDateString();
        const timeString = formattedDate.toLocaleTimeString();
        return (
          <div>
            <div>{dateString}</div>
            <div>{timeString}</div>
          </div>
        );
      },
      width: "15%",
    },

    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        return status === "active" ? "Active" : "Blocked";
      },
      width: "15%",
    },
    {
      title: "Action",
      dataIndex: "status._id",
      key: "_id",
      render: (status, _id) => {
        return (
          <div className="flex gap-3">
            <div>
              <Button
                className="bg-orange-600 text-white w-28"
                loading={delLoaderId === _id._id ? true : false}
                onClick={() => handleEdit(_id)}
              >
                Edit
              </Button>
            </div>
            <div>
              {_id.status === "active" ? (
                <Button
                  className="bg-blue-500 text-white w-28"
                  loading={BtLoaderId === _id._id ? true : false}
                  onClick={() => handleBlock(_id)}
                >
                  Block
                </Button>
              ) : (
                <Button
                  className="bg-neutral-500 text-white w-28 "
                  loading={BtLoaderId === _id._id ? true : false}
                  onClick={() => handleBlock(_id)}
                >
                  Unblock
                </Button>
              )}
            </div>
            <div>
              <Button
                className="bg-red-600 text-white w-28"
                loading={delLoaderId === _id._id ? true : false}
                onClick={() => handleDelete(_id)}
              >
                Delete
              </Button>
            </div>
          </div>
        );
      },
    },
  ];
  return (
    <>
      <Row gutter={16} align="middle">
        <Col span={12}>
          <Title level={2}> Managers</Title>
        </Col>
        <Col span={12} className="text-right"></Col>
      </Row>
      <div className="flex justify-center">
        <div className="w-full mt-5">
          <Table
            columns={columns}
            loading={loader}
            dataSource={managers}
            pagination={managers.length > 10 ? true : false}
          />
        </div>
      </div>
    </>
  );
}

export default ViewManagers;

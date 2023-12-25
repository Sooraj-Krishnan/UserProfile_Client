import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { FaEye, FaEdit } from "react-icons/fa";
import { AiOutlineUserAdd } from "react-icons/ai";
import { DownOutlined } from "@ant-design/icons";

import {
  Button,
  Table,
  Col,
  Row,
  Typography,
  Tooltip,
  Menu,
  Dropdown,
} from "antd";
// import { Modal } from "antd";
//import ErrorLogout from "../../../helper/ErrorLogout";

import { viewAllMenuCards } from "../../api/ManagerRequest";
import useColumnSearch from "../hooks/useColumnSearch";
import { Link, useNavigate } from "react-router-dom";

const { Title } = Typography;

// const { confirm } = Modal;

function ViewMenuCard() {
  console.log("View All Menu Cards Route Hit");
  const getColumnSearchProps = useColumnSearch();
  const navigate = useNavigate();

  const [menucard, setMenuCard] = useState([]);
  // const [block, setBlock] = useState();
  // const [block] = useState();
  const [loader, setLoader] = useState(true);

  // const [, setBtLoaderId] = useState("");
  // const [, setDelLoaderId] = useState("");

  //   const handleBlock = async (id) => {
  //     confirm({
  //       title: `${
  //         id?.block
  //           ? "Do you Want to Unblock the Feedback "
  //           : "Do you Want to Block the Feedback"
  //       }`,
  //       icon: <ExclamationCircleFilled />,
  //       //   content: 'Some descriptions',
  //       onOk() {
  //         setBtLoaderId(id._id);
  //         const block = async () => {
  //           try {
  //             const { data } = await blockFeedback(id._id);

  //             if (data.update) {
  //               setBlock(Date.now());
  //               setBtLoaderId("");
  //             }
  //           } catch (error) {
  //             console.log(error.message);
  //           }
  //         };
  //         block();
  //       },
  //       onCancel() {},
  //     });
  //   };

  //   const handleDelete = async (id) => {
  //     console.log("Attempting to delete feedback with ID:", id._id);
  //     confirm({
  //       title: "Do you Want to Delete the Feedback",
  //       icon: <ExclamationCircleFilled />,
  //       content:
  //         "if you delete the Feedback  it will effect all the features under the Feedback.",
  //       onOk() {
  //         setDelLoaderId(id._id);
  //         const deleteFeedbackFromDB = async () => {
  //           try {
  //             const { data } = await deleteFeedback(id._id);

  //             if (data.success) {
  //               // Filter out the deleted feedback
  //               const updatedFeedbacks = feedback.filter(
  //                 (feed) => feed._id !== id._id
  //               );
  //               setFeedback(updatedFeedbacks);
  //               setBlock(Date.now());
  //               setDelLoaderId("");
  //             }
  //           } catch (error) {
  //             console.log(error.message);
  //           }
  //         };
  //         deleteFeedbackFromDB();
  //       },
  //       onCancel() {
  //         console.log("Cancel");
  //       },
  //     });
  //   };

  const handleEdit = (_id) => {
    const MenuCardID = _id._id;
    navigate(`/edit-menu-card/${MenuCardID}`, {
      state: { details: _id },
    });
  };

  const handleViewMenuCard = (_id) => {
    const MenuCardID = _id._id;
    const url = `/menu-card-view/${MenuCardID}`;
    window.open(url, "_blank");
  };

  const handleAddWaiter = (_id) => {
    const MenuCardID = _id._id;
    navigate(`/create-waiter/${MenuCardID}`);
  };

  // Create a menu for the dropdown
  const DropdownMenu = ({ _id }) => (
    <Menu>
      <Menu.Item
        key="edit"
        onClick={() => handleEdit(_id)}
        style={{ textAlign: "center" }}
      >
        Edit
      </Menu.Item>
      {/* <Menu.Item
        key="block"
        onClick={() => handleBlock(_id)}
        style={{ textAlign: "center" }}
      >
        {_id.status === "active" ? "Block" : "Unblock"}
      </Menu.Item>
      <Menu.Item
        key="delete"
        onClick={() => handleDelete(_id)}
        style={{ textAlign: "center" }}
      >
        Delete
      </Menu.Item> */}
    </Menu>
  );

  DropdownMenu.propTypes = {
    _id: PropTypes.shape({
      status: PropTypes.string,
    }),
  };

  useEffect(() => {
    const getMenuCard = async () => {
      try {
        const { data } = await viewAllMenuCards();
        console.log("data", data);
        if (data && data.menucard) {
          setMenuCard(data.menucard);
        }
        setLoader(false);
      } catch (error) {
        console.log("Error fetching menu cards:", error);
        console.log(error.message);
        if (error.response && error.response.status === 403) {
          //    ErrorLogout(error);
        }
      }
    };

    getMenuCard();
  }, []);

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
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        //  return status === "active" ? "Active" : "Blocked";
        return (
          <span style={{ color: status === "active" ? "black" : "red" }}>
            {status === "active" ? "Active" : "Blocked"}
          </span>
        );
      },
      width: "10%",
    },
    {
      title: "Action",
      dataIndex: "status",
      key: "_id",
      render: (status, _id) => {
        const isBlocked = status === "blocked";
        return (
          <div className="flex gap-3">
            <div>
              <Tooltip title={isBlocked ? "" : "Add Waiter"}>
                <AiOutlineUserAdd
                  onClick={isBlocked ? undefined : () => handleAddWaiter(_id)}
                  size={28}
                  style={{
                    cursor: isBlocked ? "default" : "pointer",
                    opacity: isBlocked ? 0.5 : 1,
                  }}
                />
              </Tooltip>
            </div>
            <div>
              <Tooltip title={isBlocked ? "" : "Edit Your Menu Card"}>
                <FaEdit
                  onClick={isBlocked ? undefined : () => handleEdit(_id)}
                  size={28}
                  style={{
                    cursor: isBlocked ? "default" : "pointer",
                    opacity: isBlocked ? 0.5 : 1,
                  }}
                />
              </Tooltip>
            </div>
            <div>
              <Tooltip title={isBlocked ? "" : "Demo view only"}>
                <FaEye
                  onClick={
                    isBlocked ? undefined : () => handleViewMenuCard(_id)
                  }
                  size={28}
                  style={{
                    cursor: isBlocked ? "default" : "pointer",
                    opacity: isBlocked ? 0.5 : 1,
                  }}
                />
              </Tooltip>
            </div>

            <div>
              {/* Wrap the next three buttons in a Dropdown */}
              <Dropdown
                overlay={<DropdownMenu _id={_id} />}
                placement="bottomCenter"
              >
                <Button style={{ marginLeft: "10px", width: "150px" }}>
                  More{" "}
                  <DownOutlined style={{ position: "relative", top: "-2px" }} />
                </Button>
              </Dropdown>
            </div>
          </div>
        );
      },
    },
  ];
  return (
    <>
      <Row justify="space-between" align="middle">
        <Col span={12}>
          <Title level={2}>Menu Cards</Title>
        </Col>
        <Col span={12} className="text-right">
          <Link className="add-button rounded-lg" to="/create-menu-card">
            <PlusOutlined />
            Add Menu Card
          </Link>
        </Col>
      </Row>
      <div className="flex justify-center">
        <div className="w-full mt-5">
          <Table
            columns={columns}
            loading={loader}
            dataSource={menucard}
            pagination={menucard.length > 10 ? true : false}
          />
        </div>
      </div>
    </>
  );
}

export default ViewMenuCard;

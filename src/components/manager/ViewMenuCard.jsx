import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { PlusOutlined } from "@ant-design/icons";
import { FaEye, FaEdit } from "react-icons/fa";
import { AiOutlineUserAdd } from "react-icons/ai";
import { GiRoundTable } from "react-icons/gi";
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
  const getColumnSearchProps = useColumnSearch();
  const navigate = useNavigate();
  // const [block, setBlock] = useState();
  // const [block] = useState();
  const [loader, setLoader] = useState(true);

  // const [, setBtLoaderId] = useState("");
  // const [, setDelLoaderId] = useState("");

  const handleEdit = (_id) => {
    const MenuCardID = _id._id;
    navigate(`/edit-menu-card/${MenuCardID}`, {
      state: { details: _id },
    });
  };

  const handleViewMenuCard = (_id) => {
    const MenuCardID = _id._id;
    const url = `/menu-view/${MenuCardID}`;
    window.open(url, "_blank");
  };

  const handleAddWaiter = (_id) => {
    const MenuCardID = _id._id;
    navigate(`/create-waiter/${MenuCardID}`);
  };
  const handleAddKitchenStaff = (_id) => {
    const MenuCardID = _id._id;
    navigate(`/create-kitchen-staff/${MenuCardID}`);
  };

  const handleAddTable = (_id) => {
    const MenuCardID = _id._id;
    navigate(`/create-table/${MenuCardID}`);
  };

  // Create a menu for the dropdown
  const DropdownMenu = ({ _id }) => (
    <Menu>
      <Menu.Item
        key="edit"
        onClick={() => handleAddKitchenStaff(_id)}
        style={{ textAlign: "center" }}
      >
        Kitchen Staff
      </Menu.Item>
    </Menu>
  );

  DropdownMenu.propTypes = {
    _id: PropTypes.shape({
      status: PropTypes.string,
    }),
  };

  const getMenuCard = async () => {
    const { data } = await viewAllMenuCards();
    return data;
  };

  const { data, error, isLoading } = useQuery({
    queryKey: ["menucard"],
    queryFn: getMenuCard,
  });
  const menucard = data?.menucard;
  if (error) {
    console.log(error.message);
    if (error.respose && error.response.status === 403) {
      // ErrorLogout(error);
    }
  }
  useEffect(() => {
    setLoader(isLoading);
  }, [isLoading]);

  const cardLimit = data?.cardLimit;
  const tableCount = data?.tableCount;
  const remainingCards = cardLimit - tableCount;

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
              <Tooltip
                title={
                  remainingCards === 0
                    ? "Card limit over"
                    : isBlocked
                    ? ""
                    : "Add Table"
                }
              >
                <GiRoundTable
                  onClick={
                    isBlocked || remainingCards === 0
                      ? undefined
                      : () => handleAddTable(_id)
                  }
                  size={28}
                  style={{
                    cursor:
                      isBlocked || remainingCards === 0 ? "default" : "pointer",
                    opacity: isBlocked || remainingCards === 0 ? 0.5 : 1,
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
                overlay={
                  <DropdownMenu
                    _id={_id}
                    handleAddKitchenStaff={handleAddKitchenStaff}
                  />
                }
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
          <Link to="/create-menu-card">
            <Button
              size="large"
              className="add-button rounded-lg"
              style={{ backgroundColor: "#1f6ff0", color: "white" }}
            >
              <PlusOutlined />
              Add Menu Card
            </Button>
          </Link>
        </Col>
      </Row>
      <div className="flex justify-center">
        <div className="w-full mt-5">
          <Table
            columns={columns}
            loading={loader}
            dataSource={menucard}
            pagination={menucard?.length > 10 ? true : false}
          />
        </div>
      </div>
    </>
  );
}

export default ViewMenuCard;

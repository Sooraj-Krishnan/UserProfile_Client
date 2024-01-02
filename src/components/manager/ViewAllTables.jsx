import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { DownOutlined } from "@ant-design/icons";
import { FaEye } from "react-icons/fa";
import {
  Button,
  Table,
  Col,
  Row,
  Typography,
  Menu,
  Dropdown,
  Modal,
  Tooltip,
} from "antd";
import { MdOutlineQrCodeScanner } from "react-icons/md";
// import ErrorLogout from "../../../helper/ErrorLogout";
import { viewAllTables } from "../../api/ManagerRequest";
import useColumnSearch from "../hooks/useColumnSearch";
import { useNavigate } from "react-router-dom";
import { saveAs } from "file-saver";

const { Title } = Typography;
// const { confirm } = Modal;

function ViewTables() {
  const getColumnSearchProps = useColumnSearch();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [singleCard, setSingleCard] = useState("");
  const [tables, setTables] = useState([]);

  //  const [block, setBlock] = useState("");

  const [loader, setLoader] = useState(true);
  // const [, setBtLoaderId] = useState("");
  // const [, setDelLoaderId] = useState("");

  const handleEdit = (_id) => {
    const tableID = _id._id;
    navigate(`/edit-table/${tableID}`, {
      state: { details: _id },
    });
  };
  const handleViewMenuCard = (_id) => {
    const TableID = _id._id;
    const url = `/menu-view/${TableID}`;
    window.open(url, "_blank");
  };

  //Create a menu for drop down
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
    const getTables = async () => {
      try {
        // Replace with your method to fetch all employees
        const { data } = await viewAllTables();
        console.log("data", data);
        if (data && data.tables) {
          setTables(data.tables);
        }
        setLoader(false);
      } catch (error) {
        console.log(error.message);
        if (error.response.status === 403) {
          //   ErrorLogout(error);
        }
      }
    };

    getTables();
  }, []);
  const showModal = (record) => {
    setSingleCard(record);
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleDownload = () => {
    if (singleCard) {
      let url = singleCard.QRCode;
      let name = singleCard.name;
      saveAs(url, name);
    }
  };

  const columns = [
    {
      title: "No.",
      dataIndex: "_id",
      key: "index",
      width: "5%",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Table ID",
      dataIndex: "tableID",
      key: "tableID",
      width: "25%",
      ...getColumnSearchProps("tableID"),
    },

    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        // return   status === "active" ? "Active" : "Blocked";
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
            {/* ... */}
            <div>
              <Tooltip title={isBlocked ? "" : "Scan QR Code"}>
                <MdOutlineQrCodeScanner
                  size={28}
                  style={{
                    cursor: isBlocked ? "default" : "pointer",
                    opacity: isBlocked ? 0.5 : 1,
                  }}
                  onClick={isBlocked ? undefined : () => showModal(_id)}
                />
              </Tooltip>
            </div>
            <div>
              <Tooltip title={isBlocked ? "" : "View Menu"}>
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
      <Modal
        title="Menu QR Code"
        style={{ width: "300px" }}
        visible={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={false}
      >
        <div className="flex flex-col items-center justify-center">
          <img
            src={singleCard.QRCode}
            className="my-qr-code p-3 bg-white  border-2 rounded-xl border-black"
            width="200px"
            alt=""
          />
          <p className="my-qr-download cursor-pointer" onClick={handleDownload}>
            Download QR Code
          </p>
        </div>
      </Modal>

      <Row justify="space-between" align="middle">
        <Col span={12}>
          <Title level={2}>All Tables</Title>
        </Col>
        <Col span={12} className="text-right"></Col>
      </Row>
      <div className="flex justify-center">
        <div className="w-full mt-5">
          <Table
            columns={columns}
            loading={loader}
            dataSource={tables}
            pagination={tables.length > 10 ? true : false}
          />
        </div>
      </div>
    </>
  );
}

export default ViewTables;

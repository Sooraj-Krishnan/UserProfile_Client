import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { DownOutlined } from "@ant-design/icons";
import {} from "@ant-design/icons";
import { Button, Table, Col, Row, Typography, Menu, Dropdown } from "antd";

// import ErrorLogout from "../../../helper/ErrorLogout";
import { viewAllTables } from "../../api/ManagerRequest";
import useColumnSearch from "../hooks/useColumnSearch";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

function ViewTables() {
  const getColumnSearchProps = useColumnSearch();
  const navigate = useNavigate();

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
        //   const isBlocked = status === "blocked";
        return (
          <div className="flex gap-3">
            {/* ... */}
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

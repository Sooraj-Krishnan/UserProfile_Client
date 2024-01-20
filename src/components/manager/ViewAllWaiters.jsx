import PropTypes from "prop-types";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { DownOutlined } from "@ant-design/icons";
import {} from "@ant-design/icons";
import { ToastContainer, toast } from "react-toastify";
import {
  Button,
  Table,
  Col,
  Form,
  Select,
  Row,
  Typography,
  Menu,
  Dropdown,
} from "antd";

// import ErrorLogout from "../../../helper/ErrorLogout";
import { assignTablesToWaiter, viewAllWaiters } from "../../api/ManagerRequest";
import useColumnSearch from "../hooks/useColumnSearch";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

function ViewWaiters() {
  const [form] = Form.useForm();
  const getColumnSearchProps = useColumnSearch();
  const navigate = useNavigate();

  //  const [block, setBlock] = useState("");

  const [loader, setLoader] = useState(true);
  const [selectedTables, setSelectedTables] = useState({});
  // const [, setBtLoaderId] = useState("");
  // const [, setDelLoaderId] = useState("");

  const fetchWaiters = async () => {
    const { data } = await viewAllWaiters();
    if (data && data.waiters && data.waiterTables) {
      const allAssignedTables = data.waiters.flatMap((waiter) =>
        waiter.assignedTables && waiter.assignedTables.length > 0
          ? waiter.assignedTables
              .filter((table) => table !== null)
              .map((table) => table.tableID)
          : []
      );
      const merged = data.waiters.map((waiter) => {
        const waiterTablesItem = data.waiterTables.find(
          (item) => item.waiterID.toString() === waiter._id.toString()
        );
        const tables = waiterTablesItem
          ? waiterTablesItem.tables.filter(
              (table) =>
                !allAssignedTables.includes(table) ||
                waiter.assignedTables.includes(table)
            )
          : [];
        return {
          ...waiter,
          tables,
          assignedTables: waiter.assignedTables,
        };
      });
      return merged;
    }
    return [];
  };
  const {
    data: mergedData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["waiters"],
    queryFn: fetchWaiters,
  });

  if (error) {
    console.log(error.message);
    if (error.respose && error.response.status === 403) {
      // ErrorLogout(error);
    }
  }
  useEffect(() => {
    setLoader(isLoading);
  }, [isLoading]);

  useEffect(() => {
    if (mergedData) {
      const initialSelectedTables = mergedData.reduce((acc, waiter) => {
        acc[waiter._id] =
          form.getFieldValue(`select-tables-${waiter._id}`) || [];
        return acc;
      }, {});
      setSelectedTables(initialSelectedTables);
    }
  }, [mergedData, form]);

  const handleEdit = (_id) => {
    const waiterID = _id._id;
    navigate(`/edit-waiter/${waiterID}`, {
      state: { details: _id },
    });
  };

  const handleAssignTables = async (_id) => {
    const waiterID = _id;

    const tableIDs = form.getFieldValue(`select-tables-${waiterID}`);

    try {
      const { data } = await assignTablesToWaiter(waiterID, tableIDs);

      toast.success(data.message);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.log(error.message);
      const serverMessage =
        error.response && error.response.data && error.response.data.message;
      toast.error(serverMessage || error.message);
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    }
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
      title: "Assigned Tables",
      dataIndex: "assignedTables",
      key: "assignedTables",
      render: (assignedTables, record) => {
        return (
          <Form.Item
            name={`select-tables-${record._id}`}
            initialValue={record.assignedTables || []}
            //  defaultValue={record.assignedTables || []}
            rules={[
              {
                required: true,
                message: "Please select your favourite colors!",
                type: "array",
              },
            ]}
          >
            <div style={{ display: "flex" }}>
              <Select
                key={selectedTables[record._id]}
                mode="multiple"
                placeholder="Please select tables"
                //  defaultValue={record.assignedTables || []}
                // value={form.getFieldValue(`select-tables-${record._id}`) || []}
                value={selectedTables[record._id]}
                onChange={(value) => {
                  const newSelectedTables = {
                    ...selectedTables,
                    [record._id]: value,
                  };
                  setSelectedTables(newSelectedTables);
                  form.setFieldsValue({
                    [`select-tables-${record._id}`]: value,
                  });
                }}
              >
                {record.tables
                  ? record.tables
                      .filter((table) => {
                        // Get all tables assigned to other waiters
                        const otherWaitersTables = Object.values(selectedTables)
                          .flat()
                          .filter(
                            (assignedTable) => assignedTable !== record._id
                          );
                        // Only include tables that haven't been assigned to other waiters
                        return !otherWaitersTables.includes(table);
                      })
                      .map((table) => (
                        <Select.Option key={table} value={table}>
                          {table}
                        </Select.Option>
                      ))
                  : null}
              </Select>
              <Button
                style={{
                  backgroundColor: "#1f6ff0",
                  color: "white",
                  marginLeft: "4px",
                }}
                onClick={() => handleAssignTables(record._id)}
              >
                OK
              </Button>
            </div>
          </Form.Item>
        );
      },
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
              <Dropdown overlay={<DropdownMenu _id={_id} />} placement="bottom">
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
          <Title level={2}>Waiters</Title>
        </Col>
        <Col span={12} className="text-right"></Col>
      </Row>
      <div className="flex justify-center">
        <div className="w-full mt-5">
          <Form form={form}>
            <Table
              columns={columns}
              loading={loader}
              // dataSource={waiters}
              dataSource={mergedData}
              //  pagination={mergedData && mergedData.length > 10 ? true : false}
            />
          </Form>
        </div>
        <ToastContainer />
      </div>
    </>
  );
}

export default ViewWaiters;

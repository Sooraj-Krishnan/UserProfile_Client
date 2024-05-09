import { useEffect, useState } from "react";
import { Card, Spin, Row, Col } from "antd";
import { viewAllUsers } from "../../../api/AdminRequest";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await viewAllUsers();
        if (response.data.success) {
          setUsers(response.data.users);
        } else {
          console.error("Error fetching users:", response.data.message);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div>
      {loading ? (
        <Spin />
      ) : users.length > 0 ? (
        <Row gutter={16}>
          {users.map((user) => (
            <Col span={8} key={user._id}>
              <Card style={{ marginBottom: "16px" }}>
                {user.profileImage ? (
                  <div
                    style={{
                      width: "100px",
                      height: "100px",
                      overflow: "hidden",
                      borderRadius: "50%",
                      margin: "auto",
                    }}
                  >
                    <img
                      src={user.profileImage}
                      alt="Profile"
                      style={{ width: "100%", height: "auto" }}
                    />
                  </div>
                ) : (
                  ""
                )}
                <p>name : {user.name}</p>
                <p>email : {user.email}</p>
                <p>Bio : {user.bio}</p>
                <p>Phone :{user.phone}</p>
                <p>Visibility: {user.isPublic ? "Public" : "Private"}</p>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <p>No user found</p>
      )}
    </div>
  );
};

export default UserList;

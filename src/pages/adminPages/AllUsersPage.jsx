import { Layout } from "antd";
const { Content } = Layout;
import Sidebar from "../../components/sidebar/Sidebar";
import UserList from "../../components/dashboard/adminDashboard/AllUsers";

function AllUsers() {
  return (
    <div className="flex">
      <Layout>
        <Sidebar />
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: "white",
          }}
        >
          <UserList />
        </Content>
      </Layout>
    </div>
  );
}

export default AllUsers;

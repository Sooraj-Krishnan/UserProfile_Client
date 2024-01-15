import { Layout } from "antd";
const { Content } = Layout;
import Sidebar from "../../components/sidebar/Sidebar";
import AdminDashboard from "../../components/dashboard/adminDashboard/AdminDashboard";

function DashboardPage() {
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
          <AdminDashboard />
        </Content>
      </Layout>
    </div>
  );
}

export default DashboardPage;

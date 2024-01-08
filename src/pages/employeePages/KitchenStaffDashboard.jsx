import { Layout } from "antd";
const { Content } = Layout;
import KitchenStaffSidebar from "../../components/sidebar/KitchenStaffSidebar";
import KitchenStaff from "../../components/dashboard/kitchenStaff/KitchenStaff";
function KitchenStaffDashboard() {
  return (
    <div className="flex">
      <Layout>
        <KitchenStaffSidebar />
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: "white",
          }}
        >
          <KitchenStaff />
        </Content>
      </Layout>
    </div>
  );
}

export default KitchenStaffDashboard;

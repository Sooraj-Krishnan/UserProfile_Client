import ManagerSidebar from "../../components/sidebar/ManagerSidebar";
import ViewKitchenStaffs from "../../components/manager/ViewAllKitchenStaff";
import { Layout } from "antd";

const { Content } = Layout;

function ViewAllKitchenStaffs() {
  return (
    <div>
      <Layout>
        <ManagerSidebar />
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: "white",
          }}
        >
          <ViewKitchenStaffs />
        </Content>
      </Layout>
    </div>
  );
}

export default ViewAllKitchenStaffs;

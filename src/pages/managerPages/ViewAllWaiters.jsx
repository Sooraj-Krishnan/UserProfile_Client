import ManagerSidebar from "../../components/sidebar/ManagerSidebar";
import ViewWaiters from "../../components/manager/ViewAllWaiters";
import { Layout } from "antd";

const { Content } = Layout;

function ViewAllWaiters() {
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
          <ViewWaiters />
        </Content>
      </Layout>
    </div>
  );
}

export default ViewAllWaiters;

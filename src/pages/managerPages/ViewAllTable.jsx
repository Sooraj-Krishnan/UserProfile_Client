import ManagerSidebar from "../../components/sidebar/ManagerSidebar";
import ViewTables from "../../components/manager/ViewAllTables";
import { Layout } from "antd";

const { Content } = Layout;

function ViewAllTables() {
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
          <ViewTables />
        </Content>
      </Layout>
    </div>
  );
}

export default ViewAllTables;

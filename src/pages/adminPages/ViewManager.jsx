import ViewManagers from "../../components/admin/ViewManagers";
import { Layout } from "antd";
import Sidebar from "../../components/sidebar/Sidebar";

const { Content } = Layout;

function ViewAllManagers() {
  return (
    <div>
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
          <ViewManagers />
        </Content>
      </Layout>
    </div>
  );
}

export default ViewAllManagers;

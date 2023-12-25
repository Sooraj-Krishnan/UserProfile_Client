import { Layout } from "antd";
import ManagerSidebar from "../../components/sidebar/ManagerSidebar";
import ViewMenuCard from "../../components/manager/ViewMenuCard";
const { Content } = Layout;

function ViewAllMenuCard() {
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
          <ViewMenuCard />
        </Content>
      </Layout>
    </div>
  );
}

export default ViewAllMenuCard;

import ManagerSidebar from "../../components/sidebar/ManagerSidebar";
import CreateMenuCard from "../../components/manager/CreateMenuCard";
import { Layout } from "antd";
const { Content } = Layout;

function CreateMenuCardPage() {
  const edit = false;
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
          <CreateMenuCard edit={edit} />
        </Content>
      </Layout>
    </div>
  );
}

export default CreateMenuCardPage;

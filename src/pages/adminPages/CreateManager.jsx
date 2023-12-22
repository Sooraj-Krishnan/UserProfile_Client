import CreateManager from "../../components/admin/CreateManager";
import { Layout } from "antd";
import Sidebar from "../../components/sidebar/Sidebar";
const { Content } = Layout;

function CreateManagerPage() {
  const edit = false;
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
          <CreateManager edit={edit} />
        </Content>
      </Layout>
    </div>
  );
}

export default CreateManagerPage;

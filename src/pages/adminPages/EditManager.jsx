import EditManager from "../../components/admin/CreateManager";
import { Layout } from "antd";
import { useLocation } from "react-router-dom";
import Sidebar from "../../components/sidebar/Sidebar";
const { Content } = Layout;

function EditManagerPage() {
  const location = useLocation();
  const managerData = location.state?.details;
  const edit = managerData ? true : false;

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
          <EditManager managerData={managerData} edit={edit} />
        </Content>
      </Layout>
    </div>
  );
}

export default EditManagerPage;

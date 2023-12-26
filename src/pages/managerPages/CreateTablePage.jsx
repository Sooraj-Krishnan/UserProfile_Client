import CreateTable from "../../components/manager/CreateTable.jsx";
import { Layout } from "antd";
import ManagerSidebar from "../../components/sidebar/ManagerSidebar";
import { useParams } from "react-router-dom";
const { Content } = Layout;

function CreateTablePage() {
  const { id: menuCardID } = useParams();
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
          <CreateTable id={menuCardID} edit={edit} />
        </Content>
      </Layout>
    </div>
  );
}

export default CreateTablePage;

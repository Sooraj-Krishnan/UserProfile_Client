import EditTable from "../../components/manager/CreateTable.jsx";
import ManagerSidebar from "../../components/sidebar/ManagerSidebar";
import { Layout } from "antd";
import { useLocation } from "react-router-dom";

const { Content } = Layout;

function EditTablePage() {
  const location = useLocation();
  const tableData = location.state?.details;
  const edit = tableData ? true : false;

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
          <EditTable tableData={tableData} edit={edit} />
        </Content>
      </Layout>
    </div>
  );
}

export default EditTablePage;

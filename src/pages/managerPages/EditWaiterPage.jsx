import EditWaiter from "../../components/manager/CreateWaiter";
import ManagerSidebar from "../../components/sidebar/ManagerSidebar";
import { Layout } from "antd";
import { useLocation } from "react-router-dom";

const { Content } = Layout;

function EditWaiterPage() {
  const location = useLocation();
  const waiterData = location.state?.details;
  const edit = waiterData ? true : false;

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
          <EditWaiter waiterData={waiterData} edit={edit} />
        </Content>
      </Layout>
    </div>
  );
}

export default EditWaiterPage;

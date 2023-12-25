import ManagerSidebar from "../../components/sidebar/ManagerSidebar";
import EditMenuCard from "../../components/manager/CreateMenuCard";
import { Layout } from "antd";
import { useLocation } from "react-router-dom";
const { Content } = Layout;

function EditMenuCardPage() {
  const edit = true;
  const location = useLocation();
  const menuCardData = location.state?.details;
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
          <EditMenuCard
            id={menuCardData?._id}
            menuCardData={menuCardData}
            edit={edit}
          />
        </Content>
      </Layout>
    </div>
  );
}

export default EditMenuCardPage;

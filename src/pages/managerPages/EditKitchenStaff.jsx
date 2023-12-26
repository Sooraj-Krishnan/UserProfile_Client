import EditKitchenStaff from "../../components/manager/CreateKitchenStaff";
import ManagerSidebar from "../../components/sidebar/ManagerSidebar";
import { Layout } from "antd";
import { useLocation } from "react-router-dom";

const { Content } = Layout;

function EditKitchenEmployee() {
  const location = useLocation();
  const kitchenStaffData = location.state?.details;
  const edit = kitchenStaffData ? true : false;

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
          <EditKitchenStaff kitchenStaffData={kitchenStaffData} edit={edit} />
        </Content>
      </Layout>
    </div>
  );
}

export default EditKitchenEmployee;

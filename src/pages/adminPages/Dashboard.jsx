import Sidebar from "../../components/sidebar/Sidebar";
import AdminDashboard from "../../components/dashboard/AdminDashboard";

function DashboardPage() {
  return (
    <div className="flex">
      <Sidebar />
      <AdminDashboard />
    </div>
  );
}

export default DashboardPage;

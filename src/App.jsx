import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

/*---------------Common Pages ----------------*/
import LoginPage from "./pages/LoginPage";
/*---------------Admin Pages ----------------*/
import AdminLoginProtect from "./auth/AdminLoginProtect";
import DashboardPage from "./pages/adminPages/Dashboard";
import CreateManagerPage from "./pages/adminPages/CreateManager";
import EditManagerPage from "./pages/adminPages/EditManager";
import ViewAllManagers from "./pages/adminPages/ViewManager";

/*---------------Manager Pages ----------------*/
import ManagerLoginProtect from "./auth/ManagerLoginProtect";
import ManagerDashboardPage from "./pages/managerPages/Dashboard";
import CreateWaiterPage from "./pages/managerPages/CreateWaiterPage";
import EditWaiterPage from "./pages/managerPages/EditWaiterPage";
import ViewAllWaiters from "./pages/managerPages/ViewAllWaiters";
import CreateMenuCardPage from "./pages/managerPages/CreateMenuCard";
import EditMenuCardPage from "./pages/managerPages/EditMenuCard";
import ViewAllMenuCard from "./pages/managerPages/ViewAllMenuCards";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route path="/" element={<AdminLoginProtect />} />
        <Route path="admin-dashboard" element={<DashboardPage />} />
        <Route path="create-manager" element={<CreateManagerPage />} />
        <Route path="edit-manager" element={<EditManagerPage />} />
        <Route path="view-managers" element={<ViewAllManagers />} />
        {/* other routes can go here */}
        <Route path="/" element={<ManagerLoginProtect />} />
        <Route path="manager-dashboard" element={<ManagerDashboardPage />} />
        <Route path="create-menu-card" element={<CreateMenuCardPage />} />
        <Route path="edit-menu-card/:id" element={<EditMenuCardPage />} />
        <Route path="all-menu-cards" element={<ViewAllMenuCard />} />
        <Route path="create-waiter/:id" element={<CreateWaiterPage />} />
        <Route path="all-waiters" element={<ViewAllWaiters />} />
        <Route path="edit-waiter" element={<EditWaiterPage />} />
      </Routes>
    </Router>
  );
}

export default App;

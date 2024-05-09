import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./components/state-management/ThemeContext";

/*---------------Public Pages ----------------*/

import LoginPage from "./pages/LoginPage";
import Registration from "./pages/publicPages/RegisterPage";
import EmployeeLoginPage from "./pages/employeePages/EmployeeLogin";
import MenuCardView from "./pages/publicPages/MenuCardView";
import OrderView from "./pages/publicPages/OrderViewPage";

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
import CreateTablePage from "./pages/managerPages/CreateTablePage";
import EditTablePage from "./pages/managerPages/EditTablePage";
import ViewAllTables from "./pages/managerPages/ViewAllTable";
import ViewAllWaiters from "./pages/managerPages/ViewAllWaiters";
import CreateMenuCardPage from "./pages/managerPages/CreateMenuCard";
import EditMenuCardPage from "./pages/managerPages/EditMenuCard";
import ViewAllMenuCard from "./pages/managerPages/ViewAllMenuCards";
import CreateKitchenEmployee from "./pages/managerPages/CreateKitchenStaff";
import EditKitchenEmployee from "./pages/managerPages/EditKitchenStaff";
import ViewAllKitchenStaffs from "./pages/managerPages/ViewAllKitchenStaff";

/*---------------Employee Pages ----------------*/
import KitchenStaffLoginProtect from "./auth/KitchenLoginProtect";
import WaiterLoginProtect from "./auth/WaiterLoginProtext";
import KitchenStaffDashboard from "./pages/employeePages/KitchenStaffDashboard";
import WaiterDashboard from "./pages/employeePages/WaiterDashboard";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/employee-login" element={<EmployeeLoginPage />} />
          <Route path="/menu-view/:id" element={<MenuCardView />} />
          <Route path="/menu-view/:id/order" element={<OrderView />} />

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
          <Route path="create-table/:id" element={<CreateTablePage />} />
          <Route path="edit-table/:id" element={<EditTablePage />} />
          <Route path="all-tables" element={<ViewAllTables />} />
          <Route path="create-waiter/:id" element={<CreateWaiterPage />} />
          <Route path="all-waiters" element={<ViewAllWaiters />} />
          <Route path="edit-waiter/:id" element={<EditWaiterPage />} />
          <Route
            path="create-kitchen-staff/:id"
            element={<CreateKitchenEmployee />}
          />
          <Route
            path="edit-kitchen-staff/:id"
            element={<EditKitchenEmployee />}
          />
          <Route path="all-kitchen-staffs" element={<ViewAllKitchenStaffs />} />
          {/* other routes can go here */}
          <Route path="/" element={<KitchenStaffLoginProtect />} />
          <Route
            path="kitchenStaff-dashboard"
            element={<KitchenStaffDashboard />}
          />
          {/* other routes can go here */}
          <Route path="/" element={<WaiterLoginProtect />} />
          <Route path="waiter-dashboard" element={<WaiterDashboard />} />
          {/* other routes can go here */}
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;

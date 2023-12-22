import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

/*---------------Common Pages ----------------*/
import LoginPage from "./pages/LoginPage";
/*---------------Admin Pages ----------------*/
import AdminLoginProtect from "./auth/AdminLoginProtect";
import DashboardPage from "./pages/adminPages/Dashboard";
import CreateManagerPage from "./pages/adminPages/CreateManager";
import EditManagerPage from "./pages/adminPages/EditManager";
import ViewAllManagers from "./pages/adminPages/ViewManager";

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
      </Routes>
    </Router>
  );
}

export default App;

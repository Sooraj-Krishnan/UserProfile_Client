import { Navigate, Outlet } from "react-router-dom";

const AdminLoginProtect = () => {
  let auth = { token: localStorage.getItem("admin-refToken") };
  if (auth.token) {
    return <Navigate to={"/admin-dashboard"} />;
  } else {
    let auth = { token: localStorage.getItem("refToken") };
    return !auth.token ? <Outlet /> : <Navigate to={"/dashboard"} />;
  }
};

export default AdminLoginProtect;

import { Navigate, Outlet } from "react-router-dom";

const ManagerLoginProtect = () => {
  let auth = { token: localStorage.getItem("manager-refToken") };
  if (auth.token) {
    return <Navigate to={"/manager-dashboard"} />;
  } else {
    let auth = { token: localStorage.getItem("refToken") };
    return !auth.token ? <Outlet /> : <Navigate to={"/dashboard"} />;
  }
};

export default ManagerLoginProtect;

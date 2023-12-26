import { Navigate, Outlet } from "react-router-dom";

const KitchenStaffLoginProtect = () => {
  let auth = { token: localStorage.getItem("kitchenStaff-refToken") };
  if (auth.token) {
    return <Navigate to={"/kitchenStaff-dashboard"} />;
  } else {
    let auth = { token: localStorage.getItem("refToken") };
    return !auth.token ? <Outlet /> : <Navigate to={"/dashboard"} />;
  }
};

export default KitchenStaffLoginProtect;

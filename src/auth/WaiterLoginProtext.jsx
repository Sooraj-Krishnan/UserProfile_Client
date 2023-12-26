import { Navigate, Outlet } from "react-router-dom";

const WaiterLoginProtect = () => {
  let auth = { token: localStorage.getItem("waiter-refToken") };
  if (auth.token) {
    return <Navigate to={"/waiter-dashboard"} />;
  } else {
    let auth = { token: localStorage.getItem("refToken") };
    return !auth.token ? <Outlet /> : <Navigate to={"/dashboard"} />;
  }
};

export default WaiterLoginProtect;

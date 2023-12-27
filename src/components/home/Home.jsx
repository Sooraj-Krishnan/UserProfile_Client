import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <Link style={{ textDecoration: "underline" }} to="/login">
        Admin/Manager Login
      </Link>
      <Link style={{ textDecoration: "underline" }} to="/employee-login">
        Waiter/KitchenStaff Login
      </Link>
    </div>
  );
};

export default Home;

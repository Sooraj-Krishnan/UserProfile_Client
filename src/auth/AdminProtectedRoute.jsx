import ProtectedRoute from "./ProtectedRoute";
import PropTypes from "prop-types";
const AdminProtectedRoute = ({ element, ...rest }) => (
  <ProtectedRoute
    authToken="admin-refToken"
    redirectTo="/admin-dashboard"
    element={element}
    {...rest}
  />
);
AdminProtectedRoute.propTypes = {
  element: PropTypes.element.isRequired,
};

export default AdminProtectedRoute;

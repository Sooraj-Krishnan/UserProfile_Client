import { Navigate, useLocation, Route } from "react-router-dom";
import PropTypes from "prop-types";

const ProtectedRoute = ({ authToken, redirectTo, element, ...rest }) => {
  let auth = { token: localStorage.getItem(authToken) };
  let location = useLocation();

  return auth.token ? (
    <Route {...rest} element={element} />
  ) : (
    <Navigate to={redirectTo} state={{ from: location }} />
  );
};
ProtectedRoute.propTypes = {
  authToken: PropTypes.string.isRequired,
  redirectTo: PropTypes.string.isRequired,
  element: PropTypes.element.isRequired,
};

export default ProtectedRoute;

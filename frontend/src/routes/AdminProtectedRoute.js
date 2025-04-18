import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Loader from "../components/Layout/Loader";

const AdminProtectedRoute = ({ children }) => {
  const { isLoading, isAdmin } = useSelector((state) => state.admin);

  if (isLoading === true) {
    return <Loader />;
  } else {
    if (!isAdmin) {
      return <Navigate to={`/admin-login`} replace />;
    }
    return children;
  }
};

export default AdminProtectedRoute;

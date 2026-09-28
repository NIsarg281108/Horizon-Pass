// src/Components/Common/ProtectedRoute.jsx
import { Navigate } from "react-router";
import { useAuth } from "../../context/AuthContext";

function ProtectedRoute({ children, role }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/" />;
  }

  return children;
}

export default ProtectedRoute;

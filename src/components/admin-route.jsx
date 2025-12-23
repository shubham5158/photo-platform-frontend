import { Navigate } from "react-router-dom";
import { useAuth } from "../context/auth-context.jsx";

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return null;

  // 🔥 BLOCK non-admin
  if (!user || user.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;

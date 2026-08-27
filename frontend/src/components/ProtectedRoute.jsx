import { Navigate } from "react-router-dom";
import { useAuth } from "../api/AuthContext";
import { Loading } from "../components/Feedback";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <Loading label="Đang kiểm tra đăng nhập..." />;
  if (!user) return <Navigate to="/signin" replace />;

  return children;
}

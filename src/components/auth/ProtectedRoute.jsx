import { Navigate } from "react-router-dom";
import { useAppStore } from "../../store/useAppStore";

export default function ProtectedRoute({ children }) {
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const authLoading = useAppStore((s) => s.authLoading);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-primary-bg">
        <div className="w-10 h-10 border-2 border-primary-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

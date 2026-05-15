import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";

export default function ProtectedRoute() {
  const { user, isReady } = useAuth();

  if (!isReady) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background px-4">
        <p className="text-sm text-muted-foreground">Checking session...</p>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
}

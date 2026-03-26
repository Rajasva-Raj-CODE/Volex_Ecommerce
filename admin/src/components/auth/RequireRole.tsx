import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import type { Role } from "@/lib/types";

interface RequireRoleProps {
  allowed: Role[];
}

export default function RequireRole({ allowed }: RequireRoleProps) {
  const { hasRole } = useAuth();
  if (!hasRole(allowed)) return <Navigate to="/" replace />;
  return <Outlet />;
}

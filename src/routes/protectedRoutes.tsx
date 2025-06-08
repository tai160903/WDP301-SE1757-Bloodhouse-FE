import { Navigate } from "react-router-dom";
import { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const admin = localStorage.getItem("admin");
  const staff = localStorage.getItem("staff");
  const manager = localStorage.getItem("manager");
  const delivery = localStorage.getItem("delivery");
  const expert = localStorage.getItem("expert");

  const roles = [admin, staff, manager, delivery, expert].filter(
    Boolean
  ) as string[];

  const validRoles = ["ADMIN", "STAFF", "MANAGER", "DELIVERY", "EXPERT"];
  const hasValidRole = roles.some((role) => validRoles.includes(role));

  if (!hasValidRole) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

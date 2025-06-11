import { createBrowserRouter } from "react-router-dom";
import { Layout } from "@/components/Layout";
import AuthLayout from "@/components/AuthLayout";
import userRoutes from "@/routes/userRoute";
import authRoutes from "@/routes/authRoute";
import AdminLayout from "@/components/AdminLayout";
import adminRoutes from "./adminRoutes";
import ManagerLayout from "@/components/ManagerLayout";
import managerRoutes from "./managerRoutes";
import ProtectedRoute from "@/components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [...userRoutes],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [...authRoutes],
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute requiredRoles={['ADMIN']} fallbackPath="/auth/login">
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [...adminRoutes],
  },
  {
    path: "/manager",
    element: (
      <ProtectedRoute requiredRoles={['MANAGER']} fallbackPath="/auth/login">
        <ManagerLayout />
      </ProtectedRoute>
    ),
    children: [...managerRoutes],
  },
]);

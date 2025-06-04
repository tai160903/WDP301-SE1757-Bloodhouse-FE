import { createBrowserRouter } from "react-router-dom";
import { Layout } from "@/components/Layout";
import AuthLayout from "@/components/AuthLayout";
import userRoutes from "@/routes/userRoute";
import authRoutes from "@/routes/authRoute";
import AdminLayout from "@/components/AdminLayout";
import adminRoutes from "./adminRoutes";
import ManagerLayout from "@/components/ManagerLayout";
import managerRoutes from "./managerRoutes";

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
    element: <AdminLayout />,
    children: [...adminRoutes],
  },
  {
    path: "/manager",
    element: <ManagerLayout />,
    children: [...managerRoutes],
  },
]);

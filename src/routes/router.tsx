import { createBrowserRouter } from "react-router-dom";
import { Layout } from '@/components/Layout';
import AuthLayout from '@/components/AuthLayout';
import userRoutes from "@/routes/userRoute";
import authRoutes from "@/routes/authRoute";

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
]);

import { createBrowserRouter } from "react-router-dom";
import { Layout } from '@/components/Layout';
import userRoutes from "@/routes/userRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [...userRoutes],
  },
//   notFoundRoute,
//   {
//     path: "/auth",
//     element: <AuthLayout />,
//     children: [...authRoute],
//   },
]);
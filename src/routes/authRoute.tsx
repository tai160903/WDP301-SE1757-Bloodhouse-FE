import Login from '@/pages/auth/login/Login';
import Register from '@/pages/auth/register/Register'
import ForgotPassword from '@/pages/auth/forgot-password/LorgotPassword'
const authRoutes = [
  {
    path: 'login',
    element: <Login />,
  },
  {
    path: "register",
    element: <Register />,
  },
  {
    path: "forgot-password",
    element: <ForgotPassword />,
  }
  
];

export default authRoutes;
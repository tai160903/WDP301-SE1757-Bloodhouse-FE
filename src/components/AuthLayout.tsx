import { Outlet } from 'react-router-dom';
import { MainNavbar } from './main-navbar';
import { AppSidebar } from './app-sidebar';
import { Footer } from './footer';

const AuthLayout = () => {
  return (
        <main className="flex-1 w-full">
          <Outlet />
        </main>
  );
};

export default AuthLayout;

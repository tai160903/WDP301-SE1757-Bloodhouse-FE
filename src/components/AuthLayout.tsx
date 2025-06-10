import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
        <main className="flex-1 w-full">
          <Outlet />
        </main>
  );
};

export default AuthLayout;

import { Outlet } from 'react-router-dom';
import { MainNavbar } from './main-navbar';
import { Footer } from './footer';

export function Layout() {
  return (
    <div className="flex min-h-screen w-full overflow-hidden main-container">
      <div className="flex flex-col flex-1 w-full main-content">
        <MainNavbar />
        <main className="flex-1 w-full">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}
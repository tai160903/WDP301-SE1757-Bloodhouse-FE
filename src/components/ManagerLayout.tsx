import { Outlet } from "react-router-dom";
import { ManagerSidebar } from "./manager-sidebar";

function ManagerLayout() {
  return (
    <div className="flex w-screen h-screen overflow-hidden">
      <ManagerSidebar />
      <main className="flex-1 overflow-auto bg-gray-100 p-6">
        <Outlet />
      </main>
    </div>
  );
}

export default ManagerLayout;

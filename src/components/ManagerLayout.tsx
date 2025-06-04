import { Outlet } from "react-router-dom";
import { ManagerSidebar } from "./manager-sidebar";

function ManagerLayout() {
  return (
    <div className="flex h-screen bg-gray-100">
      <ManagerSidebar />
      <main className="flex-1 overflow-y-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}

export default ManagerLayout;

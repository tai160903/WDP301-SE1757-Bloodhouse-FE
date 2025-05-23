import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./admin-sidebar";

function AdminLayout() {
  return (
    <div className="flex w-screen h-screen overflow-hidden">
      <AdminSidebar />
      <main className="flex-1 overflow-auto bg-gray-100 p-6">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;

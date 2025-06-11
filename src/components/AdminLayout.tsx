import React, { createContext, useContext } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./admin-sidebar";
import useAuth from "@/hooks/useAuth";

// Context for sharing admin data across admin routes
interface AdminContextType {
  user: any;
  userRole?: string;
  isAdmin: boolean;
  loading: boolean;
}

const AdminContext = createContext<AdminContextType | null>(null);

export const useAdminContext = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdminContext must be used within AdminLayout');
  }
  return context;
};

function AdminLayout() {
  const { user, userRole, isAdmin, loading } = useAuth();

  const contextValue: AdminContextType = {
    user,
    userRole,
    isAdmin,
    loading,
  };

  return (
    <AdminContext.Provider value={contextValue}>
      <div className="flex w-screen h-screen overflow-hidden">
        <AdminSidebar />
        <main className="flex-1 overflow-auto bg-gray-100 p-6">
          <Outlet />
        </main>
      </div>
    </AdminContext.Provider>
  );
}

export default AdminLayout;

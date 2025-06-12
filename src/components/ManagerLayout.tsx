import React, { createContext, useContext } from "react";
import { Outlet } from "react-router-dom";
import { ManagerSidebar } from "./manager-sidebar";
import useAuth from "@/hooks/useAuth";

// Context for sharing facility data across manager routes
interface ManagerContextType {
  facilityId?: string;
  facilityName?: string;
  user: any;
}

const ManagerContext = createContext<ManagerContextType | null>(null);

export const useManagerContext = () => {
  const context = useContext(ManagerContext);
  if (!context) {
    throw new Error("useManagerContext must be used within ManagerLayout");
  }
  return context;
};

function ManagerLayout() {
  const { user, userFacilityId, userFacilityName } = useAuth();

  const contextValue: ManagerContextType = {
    facilityId: userFacilityId,
    facilityName: userFacilityName,
    user,
  };

  return (
    <ManagerContext.Provider value={contextValue}>
      <div className="flex w-screen h-screen overflow-hidden">
        <ManagerSidebar />
        <main className="flex-1 overflow-auto bg-gray-100 p-6">
          <Outlet />
        </main>
      </div>
    </ManagerContext.Provider>
  );
}

export default ManagerLayout;

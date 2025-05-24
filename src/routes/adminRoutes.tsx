import Blog from "@/pages/admin/Blog";
import BloodComponent from "@/pages/admin/BloodComponent";
import BloodGroup from "@/pages/admin/BloodGroup";
import Dashboard from "@/pages/admin/dashboard";
import Facility from "@/pages/admin/Facility";
import Staff from "@/pages/admin/Staff";
import User from "@/pages/admin/User";
import React from "react";

const AdminRoutes = [
  {
    path: "",
    element: (
      <React.Suspense fallback={<div>Loading...</div>}>
        <Dashboard />
      </React.Suspense>
    ),
  },
  {
    path: "users",
    element: (
      <React.Suspense fallback={<div>Loading...</div>}>
        <User />
      </React.Suspense>
    ),
  },
  {
    path: "staffs",
    element: (
      <React.Suspense fallback={<div>Loading...</div>}>
        <Staff />
      </React.Suspense>
    ),
  },
  {
    path: "facilities",
    element: (
      <React.Suspense fallback={<div>Loading...</div>}>
        <Facility />
      </React.Suspense>
    ),
  },
  {
    path: "blogs",
    element: (
      <React.Suspense fallback={<div>Loading...</div>}>
        <Blog />
      </React.Suspense>
    ),
  },
  {
    path: "blood-groups",
    element: (
      <React.Suspense fallback={<div>Loading...</div>}>
        <BloodGroup />
      </React.Suspense>
    ),
  },
  {
    path: "blood-components",
    element: (
      <React.Suspense fallback={<div>Loading...</div>}>
        <BloodComponent />
      </React.Suspense>
    ),
  },
];

export default AdminRoutes;

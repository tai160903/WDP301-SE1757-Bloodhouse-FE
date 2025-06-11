import Blog from "@/pages/admin/Blog";
import BloodComponent from "@/pages/admin/BloodComponent";
import BloodGroup from "@/pages/admin/BloodGroup";
import Dashboard from "@/pages/admin/Dashboard";
import Facility from "@/pages/admin/Facility";
import Staff from "@/pages/admin/Staff";
import User from "@/pages/admin/User";
import BlogDetail from "@/pages/resource/BlogDetail";
import React from "react";
import BlogForm from "@/components/BlogForm";
import GiftFacility from "@/pages/admin/GiftFacility";

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
    )
  },
  {
    path: "blogs/details/:id",
    element: (
      <React.Suspense fallback={<div>Loading...</div>}>
        <BlogDetail />
      </React.Suspense>
    )
  },
  {
    path: "blogs/create",
    element: (
      <React.Suspense fallback={<div>Loading...</div>}>
        <BlogForm />
      </React.Suspense>
    )
  },
  {
    path: "blogs/edit/:id",
    element: (
      <React.Suspense fallback={<div>Loading...</div>}>
        <BlogForm isEditing />
      </React.Suspense>
    )
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
  {
    path: "gift-facilities",
    element: (
      <React.Suspense fallback={<div>Loading...</div>}>
        <GiftFacility />
      </React.Suspense>
    ),
  },
];

export default AdminRoutes;

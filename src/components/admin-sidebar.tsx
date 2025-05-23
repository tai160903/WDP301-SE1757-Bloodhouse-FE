const sidebarItems = [
  { name: "Dashboard", path: "/admin/" },
  { name: "Users", path: "/admin/users" },
  { name: "Staffs", path: "/admin/staffs" },
  { name: "Facilities", path: "/admin/facilities" },
  { name: "Blog", path: "/admin/blogs" },
  { name: "Blood Groups", path: "/admin/blood-groups" },
  { name: "Blood Components", path: "/admin/blood-components" },
  { name: "Settings", path: "/admin/settings" },
];

function AdminSidebar() {
  return (
    <div className="h-full w-72 bg-slate-700">
      <h1 className="text-white p-4 text-lg font-semibold">Admin Panel</h1>
      <nav className="flex flex-col gap-4 p-4">
        {sidebarItems.map((item) => (
          <a
            key={item.name}
            href={item.path}
            className="text-white hover:bg-slate-600 p-2 rounded transition-colors duration-200"
          >
            {item.name}
          </a>
        ))}
      </nav>
    </div>
  );
}

export default AdminSidebar;

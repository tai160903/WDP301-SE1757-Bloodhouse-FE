import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faUsers,
  faUserTie,
  faHospital,
  faNewspaper,
  faDroplet,
  faFlask,
  faCog,
} from "@fortawesome/free-solid-svg-icons";

const sidebarItems = [
  { name: "Dashboard", path: "/admin/", icon: faChartLine },
  { name: "Users", path: "/admin/users", icon: faUsers },
  { name: "Staff", path: "/admin/staffs", icon: faUserTie },
  { name: "Facilities", path: "/admin/facilities", icon: faHospital },
  { name: "Blog", path: "/admin/blogs", icon: faNewspaper },
  { name: "Blood Groups", path: "/admin/blood-groups", icon: faDroplet },
  { name: "Blood Components", path: "/admin/blood-components", icon: faFlask },
  { name: "Settings", path: "/admin/settings", icon: faCog },
];

function AdminSidebar() {
  const location = useLocation();

  return (
    <div className="h-full w-72 bg-gradient-to-b from-slate-800 to-slate-700 shadow-lg">
      <div className="p-6">
        <Link to="/" className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
            <FontAwesomeIcon icon={faDroplet} className="text-white text-xl" />
          </div>
          <h1 className="text-white text-xl font-bold">BloodHouse Admin</h1>
        </Link>
      </div>

      <div className="px-4 py-2">
        <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-2 pl-3">
          Management
        </p>
      </div>

      <nav className="flex flex-col px-3 py-2">
        {sidebarItems.map((item) => {
          const isActive =
            location.pathname === item.path ||
            (item.path !== "/admin/" &&
              location.pathname.startsWith(item.path));

          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-slate-300 hover:bg-slate-600/50"
              }`}
            >
              <FontAwesomeIcon
                icon={item.icon}
                className={`text-lg ${
                  isActive ? "text-white" : "text-slate-400"
                }`}
              />
              <span className="font-medium">{item.name}</span>

              {isActive && (
                <div className="ml-auto h-2 w-2 rounded-full bg-white"></div>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export default AdminSidebar;

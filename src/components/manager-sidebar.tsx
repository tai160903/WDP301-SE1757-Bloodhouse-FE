import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Droplets,
  Gift,
  FileText,
  Calendar,
  Users,
  Inbox,
  Heart,
  MapPin,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const navigation = [
  { name: "Tổng quan", path: "/manager", icon: LayoutDashboard },
  { name: "Kho máu", path: "/manager/inventory", icon: Droplets },
  { name: "Yêu cầu hiến máu", path: "/manager/requests", icon: Calendar },
  { name: "Yêu cầu nhận máu", path: "/manager/received", icon: Inbox },
  { name: "Quản lý quà tặng", path: "/manager/gifts", icon: Gift },
  { name: "Quản lý nhân viên", path: "/manager/staff", icon: Users },
  { name: "Quản lý bài viết", path: "/manager/blogs", icon: FileText },
  { name: "Quản lý sự kiện", path: "/manager/events", icon: MapPin },
];

export function ManagerSidebar() {
  const location = useLocation();

  return (
    <div className="flex flex-col w-64 bg-white shadow-lg">
      <div className="flex items-center justify-center h-16 px-4 bg-red-600">
        <Heart className="w-8 h-8 text-white mr-2" />
        <h1 className="text-xl font-bold text-white">Quản Lý Ngân Hàng Máu</h1>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                isActive
                  ? "bg-red-100 text-red-700"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

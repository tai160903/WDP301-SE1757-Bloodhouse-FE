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
  LogOut,
  House,
  Clock,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import useAuth from "@/hooks/useAuth";
import * as React from "react";

const navigation = [
  // { name: "Tổng quan", path: "/manager", icon: LayoutDashboard },
  // { name: "Lịch hiến máu", path: "/manager/schedule", icon: Clock },
  { name: "Yêu cầu hiến máu", path: "/manager/requests", icon: Calendar },
  {
    name: "Thông tin hiến máu",
    path: "/manager/donations",
    icon: Calendar,
  },
  { name: "Yêu cầu nhận máu", path: "/manager/received", icon: Inbox },
  { name: "Đơn vị máu", path: "/manager/inventory", icon: Droplets },

  { name: "Quản lý quà tặng", path: "/manager/gifts", icon: Gift },
  { name: "Danh sách nhân viên", path: "/manager/staff", icon: Users },
  { name: "Quản lý bài viết", path: "/manager/blogs", icon: FileText },
  { name: "Quản lý sự kiện", path: "/manager/events", icon: MapPin },
];

export function ManagerSidebar() {
  const location = useLocation();
  const { signOut, loading } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = React.useState(false);

  const navigate = useNavigate();

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = async () => {
    try {
      await signOut();
      setShowLogoutModal(false);
    } catch (error) {
      console.error("Logout thất bại:", error);
      setShowLogoutModal(false);
    }
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  return (
    <>
      <div className="flex flex-col w-64 bg-white shadow-lg h-full">
        <div className="flex items-center justify-center h-16 px-4 bg-red-600">
          <Heart className="w-8 h-8 text-white mr-2" />
          <h1 className="text-xl font-bold text-white">Bloodhouse</h1>
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

        {/* Logout Button */}
        <div className="px-4 py-4 border-t border-gray-200">
          <button
            onClick={() => navigate("/")}
            className="flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors text-gray-600 hover:bg-red-50 hover:text-red-600 w-full"
          >
            <House className="w-5 h-5 mr-3" />
            Trang chủ
          </button>
          <button
            onClick={handleLogoutClick}
            className="flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors text-gray-600 hover:bg-red-50 hover:text-red-600 w-full"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Đăng xuất
          </button>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <Dialog open={showLogoutModal} onOpenChange={setShowLogoutModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-red-600">
              Xác nhận đăng xuất
            </DialogTitle>
            <DialogDescription className="text-center">
              Bạn có chắc chắn muốn đăng xuất khỏi tài khoản không?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-row justify-center gap-2 sm:gap-2">
            <Button
              variant="outline"
              onClick={handleLogoutCancel}
              className="flex-1 hover:bg-gray-50"
            >
              Hủy
            </Button>
            <Button
              onClick={handleLogoutConfirm}
              disabled={loading}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            >
              {loading ? "Đang đăng xuất..." : "Đăng xuất"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

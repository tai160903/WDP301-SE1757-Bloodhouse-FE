import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  User,
  History,
  HandHeart,
  LogOut,
  ChevronRight,
  Menu,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface ProfileSidebarProps {
  activeTab: string;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ activeTab }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const menuItems = [
    {
      id: "profile",
      label: "Thông tin cá nhân",
      icon: User,
      onClick: () => navigate("/profile"),
    },
    {
      id: "history",
      label: "Lịch sử hiến máu",
      icon: History,
      onClick: () => navigate("/donation-history"),
    },
    {
      id: "requests",
      label: "Yêu cầu hiến máu",
      icon: HandHeart,
      onClick: () => navigate("/donation-requests"),
    },
    {
      id: "logout",
      label: "Đăng xuất",
      icon: LogOut,
      onClick: handleLogout,
      className: "text-red-600 hover:text-red-700 hover:bg-red-50",
    },
  ];

  return (
    <Card className="shadow-xl border-0 py-0 h-fit gap-0">
      <CardHeader className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-t-lg">
        <CardTitle className="text-xl font-semibold flex items-center gap-2 py-4">
          <Menu className="h-5 w-5" />
          Menu
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={item.onClick}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors",
                activeTab === item.id && "bg-orange-50 text-orange-600",
                item.className
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="flex-1 text-left">{item.label}</span>
              <ChevronRight className="h-4 w-4 opacity-50" />
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileSidebar; 
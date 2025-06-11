import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  User,
  History,
  HandHeart,
  LogOut,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import useAuth from "@/hooks/useAuth";

interface ProfileSidebarProps {
  activeTab: string;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ activeTab }) => {
  const navigate = useNavigate();
  const { signOut, loading } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = async () => {
    try {
      await signOut();
      setShowLogoutModal(false);
      navigate("/auth/login");
    } catch (error) {
      console.error("Logout failed:", error);
      setShowLogoutModal(false);
    }
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
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
  ];

  return (
    <>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-primary">
            Menu
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={item.onClick}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors",
                activeTab === item.id 
                  ? "bg-accent text-primary font-medium" 
                  : "text-gray-700"
              )}
            >
              <div className={cn(
                "p-2 rounded-full",
                activeTab === item.id ? "bg-primary/10" : "bg-gray-100"
              )}>
                <item.icon className={cn(
                  "h-4 w-4",
                  activeTab === item.id ? "text-primary" : "text-gray-600"
                )} />
              </div>
              <span className="flex-1">{item.label}</span>
              {activeTab === item.id && (
                <ChevronRight className="h-4 w-4 text-primary" />
              )}
            </button>
          ))}
          
          {/* Logout Button */}
          <div className="pt-2 mt-4 border-t">
            <button
              onClick={handleLogoutClick}
              disabled={loading}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors text-red-600"
            >
              <div className="p-2 rounded-full bg-red-100">
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <LogOut className="h-4 w-4" />
                )}
              </div>
              <span className="flex-1">
                {loading ? "Đang đăng xuất..." : "Đăng xuất"}
              </span>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Logout Confirmation Modal */}
      <Dialog open={showLogoutModal} onOpenChange={setShowLogoutModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <LogOut className="h-5 w-5 text-red-600" />
              Xác nhận đăng xuất
            </DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn đăng xuất khỏi tài khoản không?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={handleLogoutCancel}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleLogoutConfirm}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang đăng xuất...
                </>
              ) : (
                "Đăng xuất"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProfileSidebar; 
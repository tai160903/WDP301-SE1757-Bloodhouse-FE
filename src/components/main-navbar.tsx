"use client";

import * as React from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Bell, Search, Droplet } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "./ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { cn } from "../lib/utils";
import useAuth from "@/hooks/useAuth";

const mainNavItems = [
  {
    title: "Hiến máu",
    href: "/donation-registration",
  },
  {
    title: "Yêu cầu máu",
    href: "/request",
  },
  // {
  //   title: "Tìm kiếm",
  //   href: "/search",
  // },
];

const resourcesItems = [
  {
    title: "Blog",
    href: "/blog",
    description: "Đọc các bài viết và câu chuyện về hiến máu",
  },
  {
    title: "Thông tin nhóm máu",
    href: "/bloodInfo",
    description: "Tìm hiểu về các nhóm máu và tính tương thích",
  },
  {
    title: "Quy trình hiến máu",
    href: "/process",
    description: "Các bước trong quá trình hiến máu",
  },
  {
    title: "Câu hỏi thường gặp",
    href: "/faq",
    description: "Giải đáp các thắc mắc về hiến máu",
  },
];

const locationItems = [
  {
    title: "Trung tâm hiến máu",
    href: "/locations",
    description: "Tìm trung tâm hiến máu gần bạn",
  },
  {
    title: "Sự kiện hiến máu",
    href: "/events",
    description: "Các sự kiện hiến máu sắp diễn ra",
  },
  {
    title: "Kiểm tra tương thích máu",
    href: "/matchBloodType",
    description: "Giải đáp độ tương thích máu",
  },
];

interface ListItemProps {
  className?: string;
  title: string;
  description: string;
  to: string;
}

export function MainNavbar() {
  const {
    user,
    isAuthenticated,
    signOut,
    loading,
    userRole,
    isAdmin,
    isManager,
  } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = React.useState(false);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = async () => {
    try {
      await signOut();
      setShowLogoutModal(false);
    } catch (error) {
      console.error("Logout thất bại:", error);
      // Vẫn đóng modal ngay cả khi logout API thất bại
      setShowLogoutModal(false);
    }
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-background">
        <div className="container flex h-16 items-center justify-between">
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/"
              className="group flex items-center space-x-2 transition-colors duration-200"
            >
              <div className="bg-red-50 p-1.5 rounded-full group-hover:bg-red-100 transition-colors duration-200">
                <Droplet className="h-6 w-6 text-red-600 group-hover:text-red-700" />
              </div>
              <span className="font-bold text-lg tracking-tight text-red-600 group-hover:text-red-700">
                BloodHouse
              </span>
            </Link>
            <NavigationMenu>
              <NavigationMenuList className="space-x-2">
                {mainNavItems.map((item) => (
                  <NavigationMenuItem key={item.title}>
                    <NavigationMenuLink
                      asChild
                      className={cn(
                        "text-sm font-semibold tracking-tight text-foreground/80 px-3 py-2 rounded-md",
                        "hover:text-red-600 hover:bg-red-50 focus:text-red-600 transition-colors duration-200"
                      )}
                    >
                      <Link
                        to={item.href}
                        data-testid={`nav-link-${item.title}`}
                      >
                        {item.title}
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className="text-sm font-semibold tracking-tight text-foreground/80 px-3 py-2 rounded-md hover:bg-red-50 hover:text-red-600 focus:bg-red-50 focus:text-red-600"
                    data-testid="resources-trigger"
                  >
                    Tài nguyên
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {resourcesItems.map((item) => (
                        <ListItem
                          key={item.title}
                          title={item.title}
                          to={item.href}
                          description={item.description}
                        />
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className="text-sm font-semibold tracking-tight text-foreground/80 px-3 py-2 rounded-md hover:bg-red-50 hover:text-red-600 focus:bg-red-50 focus:text-red-600"
                    data-testid="locations-trigger"
                  >
                    Địa điểm
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {locationItems.map((item) => (
                        <ListItem
                          key={item.title}
                          title={item.title}
                          to={item.href}
                          description={item.description}
                        />
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          <div className="flex items-center gap-3">
            {/* <Button
              variant="outline"
              size="icon"
              className="text-foreground hover:bg-red-50 transition-colors duration-200"
              data-testid="search-button"
            >
              <Search className="h-4 w-4" />
            </Button> */}
            {isAuthenticated ? (
              <>
                {/* <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative hidden md:flex text-foreground hover:bg-red-50 transition-colors duration-200"
                      data-testid="notification-button"
                    >
                      <Bell className="h-4 w-4" />
                      <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-red-500 text-white">
                        3
                      </Badge>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80">
                    <DropdownMenuLabel className="flex items-center justify-between">
                      <span className="text-sm font-semibold tracking-tight">
                        Thông báo
                      </span>
                      <Button
                        variant="link"
                        size="sm"
                        className="h-auto p-0 text-xs text-red-600 hover:text-red-700"
                      >
                        Đánh dấu tất cả đã đọc
                      </Button>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <div className="max-h-80 overflow-y-auto">
                      {[1, 2, 3].map((i) => (
                        <DropdownMenuItem
                          key={i}
                          className="flex flex-col items-start p-3 cursor-pointer hover:bg-red-50 hover:text-red-600 focus:bg-red-50 focus:text-red-600 transition-colors duration-200"
                          data-testid={`notification-item-${i}`}
                        >
                          <div className="flex w-full justify-between">
                            <span className="font-medium text-sm">
                              Lịch hẹn hiến máu
                            </span>
                            <span className="text-xs text-muted-foreground">
                              2 giờ trước
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            Nhắc nhở: Bạn có lịch hẹn hiến máu vào ngày mai lúc 9:00
                            tại Trung tâm Hiến máu Quốc gia.
                          </p>
                        </DropdownMenuItem>
                      ))}
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      asChild
                      className="justify-center text-sm font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 focus:bg-red-50 focus:text-red-700"
                    >
                      <Link to="/notifications">Xem tất cả thông báo</Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu> */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative h-8 w-8 rounded-full hidden md:flex hover:bg-red-50 transition-colors duration-200"
                      data-testid="user-button"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={user?.avatar}
                          alt={user?.fullName || "User"}
                        />
                        <AvatarFallback className="bg-red-50 text-red-600 font-semibold">
                          {user?.fullName
                            ? user.fullName.charAt(0).toUpperCase()
                            : "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-semibold tracking-tight">
                          {user?.fullName || "Người dùng"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {user?.email}
                        </p>
                        {user?.role && (
                          <p className="text-xs text-red-600 font-medium">
                            {user.role}
                          </p>
                        )}
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    {/* Admin Dashboard Link */}
                    {isAdmin && (
                      <>
                        <DropdownMenuItem
                          asChild
                          className="text-sm font-semibold hover:bg-blue-50 hover:text-blue-600 focus:bg-blue-50 focus:text-blue-600"
                        >
                          <Link to="/admin">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              Dashboard Admin
                            </div>
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}

                    {/* Manager Dashboard Link */}
                    {isManager && (
                      <>
                        <DropdownMenuItem
                          asChild
                          className="text-sm font-semibold hover:bg-green-50 hover:text-green-600 focus:bg-green-50 focus:text-green-600"
                        >
                          <Link to="/manager">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              Dashboard Manager
                            </div>
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}

                    {/* Separator if admin or manager */}
                    {(isAdmin || isManager) && <DropdownMenuSeparator />}

                    <DropdownMenuItem
                      asChild
                      className="text-sm font-semibold hover:bg-red-50 hover:text-red-600 focus:bg-red-50 focus:text-red-600 cursor-pointer"
                    >
                      <Link to="/profile">Hồ sơ</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      asChild
                      className="text-sm font-semibold hover:bg-red-50 hover:text-red-600 focus:bg-red-50 focus:text-red-600 cursor-pointer"
                    >
                      <Link to="/request-history">Lịch sử nhận máu</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      asChild
                      className="text-sm font-semibold hover:bg-red-50 hover:text-red-600 focus:bg-red-50 focus:text-red-600 cursor-pointer"
                    >
                      <Link to="/donation-history">Lịch sử hiến máu</Link>
                    </DropdownMenuItem>
                    {/* <DropdownMenuItem
                      asChild
                      className="text-sm font-semibold hover:bg-red-50 hover:text-red-600 focus:bg-red-50 focus:text-red-600 cursor-pointer"
                    >
                      <Link to="/settings">Cài đặt</Link>
                    </DropdownMenuItem> */}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-sm font-semibold text-red-500 hover:text-red-600 hover:bg-red-50 focus:bg-red-50 focus:text-red-600 cursor-pointer"
                      onClick={handleLogoutClick}
                    >
                      Đăng xuất
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="hidden md:flex gap-3">
                <Button
                  variant="ghost"
                  asChild
                  className="text-sm font-semibold tracking-tight text-foreground/80 hover:bg-red-50 hover:text-red-600 border border-red-600"
                >
                  <Link to="/auth/login">Đăng nhập</Link>
                </Button>
                <Button
                  asChild
                  className="text-sm font-semibold tracking-tight bg-red-600 hover:bg-red-700 text-white"
                >
                  <Link to="/auth/register">Đăng ký</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

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

const ListItem = React.forwardRef<HTMLAnchorElement, ListItemProps>(
  ({ className, title, description, to, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink
          asChild
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
        >
          <Link to={to} ref={ref} {...props}>
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
              {description}
            </p>
          </Link>
        </NavigationMenuLink>
      </li>
    );
  }
);
ListItem.displayName = "ListItem";

export default MainNavbar;

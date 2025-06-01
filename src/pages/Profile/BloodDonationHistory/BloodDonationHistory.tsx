import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  User,
  History,
  HandHeart,
  LogOut,
  ChevronRight,
  Menu,
  Calendar,
  MapPin,
  Droplet,
  CheckCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProfileSidebar from "@/components/profile/ProfileSidebar";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

const BloodDonationHistory: React.FC = () => {
  const [activeTab, setActiveTab] = useState("history");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages] = useState(3); // This would come from your API
  const [totalItems] = useState(25); // This would come from your API
  const [limit] = useState(10);
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
      onClick: () => setActiveTab("history"),
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

  const mockHistory = [
    {
      date: "20/01/2024",
      location: "Bệnh viện Huyết học TP.HCM",
      status: "Hoàn thành",
      volume: "350ml",
    },
    {
      date: "15/08/2023",
      location: "Trường ĐH Bách Khoa",
      status: "Hoàn thành",
      volume: "450ml",
    },
    {
      date: "01/03/2023",
      location: "Nhà văn hóa Thanh Niên",
      status: "Đã hủy",
      volume: "-",
    },
  ];

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    // Here you would fetch the data for the new page
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-100 rounded-full">
              <History className="h-8 w-8 text-orange-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Lịch sử hiến máu
              </h1>
              <p className="text-gray-600 mt-1">
                Xem lại các lần hiến máu của bạn
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <ProfileSidebar activeTab="history" />

          {/* History Table Card */}
          <Card className="shadow-xl border-0 py-0 lg:col-span-3 gap-0">
            <CardHeader className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-t-lg">
              <CardTitle className="text-xl font-semibold flex items-center gap-2 py-4">
                <History className="h-5 w-5" />
                Danh sách lần hiến máu
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-4 px-4 font-medium text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Ngày đăng ký
                        </div>
                      </th>
                      <th className="text-left py-4 px-4 font-medium text-gray-600">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Địa điểm
                        </div>
                      </th>
                      <th className="text-left py-4 px-4 font-medium text-gray-600">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" />
                          Trạng thái
                        </div>
                      </th>
                      <th className="text-left py-4 px-4 font-medium text-gray-600">
                        <div className="flex items-center gap-2">
                          <Droplet className="h-4 w-4" />
                          Lượng máu
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockHistory.map((item, index) => (
                      <tr
                        key={index}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-4 px-4">{item.date}</td>
                        <td className="py-4 px-4">{item.location}</td>
                        <td className="py-4 px-4">
                          <span
                            className={cn(
                              "px-3 py-1 rounded-full text-sm font-medium",
                              item.status === "Hoàn thành"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            )}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="py-4 px-4">{item.volume}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between px-6 py-4 border-t mt-4">
                <div className="text-sm text-gray-600">
                  Hiển thị {(currentPage - 1) * limit + 1} đến{" "}
                  {Math.min(currentPage * limit, totalItems)} trong số{" "}
                  {totalItems} lần hiến máu
                </div>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => handlePageChange(currentPage - 1)}
                        className={`cursor-pointer hover:bg-gray-100 transition-colors ${
                          currentPage === 1
                            ? "pointer-events-none opacity-50"
                            : ""
                        }`}
                      />
                    </PaginationItem>

                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(
                        (page) =>
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                      )
                      .map((page, index, array) => (
                        <React.Fragment key={page}>
                          {index > 0 && array[index - 1] !== page - 1 && (
                            <PaginationItem>
                              <PaginationEllipsis className="cursor-default" />
                            </PaginationItem>
                          )}
                          <PaginationItem>
                            <PaginationLink
                              onClick={() => handlePageChange(page)}
                              isActive={currentPage === page}
                              className={`cursor-pointer hover:bg-gray-100 transition-colors ${
                                currentPage === page
                                  ? "bg-orange-600 text-white hover:bg-orange-700"
                                  : ""
                              }`}
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        </React.Fragment>
                      ))}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() => handlePageChange(currentPage + 1)}
                        className={`cursor-pointer hover:bg-gray-100 transition-colors ${
                          currentPage === totalPages
                            ? "pointer-events-none opacity-50"
                            : ""
                        }`}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BloodDonationHistory;
"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  History,
  Calendar,
  MapPin,
  Droplet,
  CheckCircle,
  Clock,
  Search,
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

// Utility functions for formatting
const formatRequestDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const getRequestStatusInfo = (status: string) => {
  switch (status) {
    case "FULFILLED":
      return {
        text: "Đã hoàn thành",
        className: "border-green-200 bg-green-50 text-green-700",
      };
    case "PENDING":
      return {
        text: "Đang chờ",
        className: "border-yellow-200 bg-yellow-50 text-yellow-700",
      };
    case "CANCELLED":
      return {
        text: "Đã hủy",
        className: "border-red-200 bg-red-50 text-red-700",
      };
    case "EXPIRED":
      return {
        text: "Đã hết hạn",
        className: "border-gray-200 bg-gray-50 text-gray-700",
      };
    default:
      return {
        text: "Không xác định",
        className: "border-gray-200 bg-gray-50 text-gray-700",
      };
  }
};

const BloodRequestHistory: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages] = useState(3);
  const [totalItems] = useState(18);
  const [limit] = useState(10);
  const navigate = useNavigate();

  const mockRequestHistory = [
    {
      id: 1,
      date: "2024-01-15",
      location: "Bệnh viện Chợ Rẫy",
      facilityAddress: "201B Nguyễn Chí Thanh, Quận 5",
      status: "FULFILLED",
      volume: "450ml",
      bloodType: "O+",
      urgency: "URGENT",
      reason: "Phẫu thuật tim",
    },
    {
      id: 2,
      date: "2023-11-20",
      location: "Bệnh viện Đại học Y Dược",
      facilityAddress: "215 Hồng Bàng, Quận 5",
      status: "FULFILLED",
      volume: "350ml",
      bloodType: "O+",
      urgency: "NORMAL",
      reason: "Điều trị ung thư",
    },
    {
      id: 3,
      date: "2023-09-10",
      location: "Bệnh viện Nhi Đồng 1",
      facilityAddress: "341 Sư Vạn Hạnh, Quận 10",
      status: "CANCELLED",
      volume: "200ml",
      bloodType: "O+",
      urgency: "URGENT",
      reason: "Phẫu thuật nhi khoa",
    },
    {
      id: 4,
      date: "2023-07-05",
      location: "Bệnh viện Huyết học TP.HCM",
      facilityAddress: "201 Nguyễn Chí Thanh, Quận 5",
      status: "FULFILLED",
      volume: "400ml",
      bloodType: "O+",
      urgency: "NORMAL",
      reason: "Điều trị bệnh máu",
    },
    {
      id: 5,
      date: "2023-05-12",
      location: "Bệnh viện Bình Dân",
      facilityAddress: "371 Điện Biên Phủ, Quận 3",
      status: "EXPIRED",
      volume: "300ml",
      bloodType: "O+",
      urgency: "NORMAL",
      reason: "Phẫu thuật tổng quát",
    },
  ];

  const fulfilledRequests = mockRequestHistory.filter(
    (item) => item.status === "FULFILLED"
  );
  const totalVolumeRequested = fulfilledRequests.reduce((sum, item) => {
    const volume = Number.parseInt(item.volume.replace("ml", "")) || 0;
    return sum + volume;
  }, 0);

  const urgentRequests = mockRequestHistory.filter(
    (item) => item.urgency === "URGENT"
  ).length;

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    // Here you would fetch the data for the new page
  };

  const getUrgencyBadge = (urgency: string) => {
    if (urgency === "URGENT") {
      return (
        <Badge
          variant="outline"
          className="border-red-200 bg-red-50 text-red-700 ml-2"
        >
          Khẩn cấp
        </Badge>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-accent p-3 rounded-full">
              <Search className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-primary">
                Lịch sử yêu cầu máu
              </h1>
              <p className="text-muted-foreground">
                Theo dõi các yêu cầu máu của bạn
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <ProfileSidebar activeTab="request-history" />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="shadow-lg">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="bg-accent p-4 rounded-full">
                    <Search className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Tổng yêu cầu
                    </p>
                    <p className="text-2xl font-bold">
                      {mockRequestHistory.length}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="bg-accent p-4 rounded-full">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Đã hoàn thành
                    </p>
                    <p className="text-2xl font-bold">
                      {fulfilledRequests.length}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="bg-accent p-4 rounded-full">
                    <Droplet className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Tổng lượng nhận
                    </p>
                    <p className="text-2xl font-bold">
                      {totalVolumeRequested}ml
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Request History Table Card */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <History className="h-5 w-5 text-primary" />
                  Danh sách yêu cầu máu
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-accent">
                      <tr>
                        <th className="text-left py-4 px-6 font-medium text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Ngày yêu cầu
                          </div>
                        </th>
                        <th className="text-left py-4 px-6 font-medium text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            Bệnh viện
                          </div>
                        </th>
                        <th className="text-left py-4 px-6 font-medium text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4" />
                            Trạng thái
                          </div>
                        </th>
                        <th className="text-left py-4 px-6 font-medium text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Droplet className="h-4 w-4" />
                            Lượng máu
                          </div>
                        </th>
                        <th className="text-left py-4 px-6 font-medium text-muted-foreground">
                          Lý do
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {mockRequestHistory.map((item) => {
                        const statusInfo = getRequestStatusInfo(item.status);
                        return (
                          <tr
                            key={item.id}
                            className="hover:bg-accent/50 transition-colors"
                          >
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">
                                  {formatRequestDate(item.date)}
                                </span>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <div>
                                <p className="font-medium">{item.location}</p>
                                <p className="text-sm text-muted-foreground">
                                  {item.facilityAddress}
                                </p>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant="outline"
                                  className={`${statusInfo.className} font-medium`}
                                >
                                  {statusInfo.text}
                                </Badge>
                                {getUrgencyBadge(item.urgency)}
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-2">
                                <Droplet
                                  className={`h-4 w-4 ${
                                    item.status === "FULFILLED"
                                      ? "text-primary"
                                      : "text-muted-foreground"
                                  }`}
                                />
                                <span
                                  className={`font-medium ${
                                    item.status === "FULFILLED"
                                      ? "text-foreground"
                                      : "text-muted-foreground"
                                  }`}
                                >
                                  {item.volume}
                                </span>
                                {item.bloodType && (
                                  <Badge variant="outline" className="ml-2">
                                    {item.bloodType}
                                  </Badge>
                                )}
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <span className="text-sm text-muted-foreground">
                                {item.reason}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between px-6 py-4 border-t bg-accent/50">
                  <div className="text-sm text-muted-foreground">
                    Hiển thị {(currentPage - 1) * limit + 1} đến{" "}
                    {Math.min(currentPage * limit, totalItems)} trong số{" "}
                    {totalItems} yêu cầu máu
                  </div>
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => handlePageChange(currentPage - 1)}
                          className={`cursor-pointer transition-colors ${
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
                                <PaginationEllipsis />
                              </PaginationItem>
                            )}
                            <PaginationItem>
                              <PaginationLink
                                onClick={() => handlePageChange(page)}
                                isActive={currentPage === page}
                                className={`cursor-pointer transition-colors ${
                                  currentPage === page
                                    ? "bg-primary text-primary-foreground"
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
                          className={`cursor-pointer transition-colors ${
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
    </div>
  );
};

export default BloodRequestHistory;

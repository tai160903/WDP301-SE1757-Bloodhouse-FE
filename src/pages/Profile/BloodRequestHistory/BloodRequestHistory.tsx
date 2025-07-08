"use client";

import React, { useState, useEffect } from "react";
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
import { getBloodRequestHistory } from "@/services/bloodRequest";

// Utility function
const formatRequestDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const BloodRequestHistory: React.FC = () => {
  const [bloodRequest, setBloodRequest] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);

  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchBloodRequestHistory();
  }, []);

  const fetchBloodRequestHistory = async () => {
    setLoading(true);
    try {
      const response = await getBloodRequestHistory();
      if (response.status === 200) {
        setBloodRequest(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching request history:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const getUrgencyBadge = (isUrgent: boolean) => {
    return (
      <Badge
        variant="outline"
        className={`border-red-200 bg-red-50 text-red-700 ml-2`}
      >
        {isUrgent ? "Khẩn cấp" : "Không khẩn cấp"}
      </Badge>
    );
  };

  const totalPages = Math.ceil(bloodRequest.length / limit);
  const paginatedData = bloodRequest.slice(
    (currentPage - 1) * limit,
    currentPage * limit
  );

  const handleDetailClick = (id: any) => {
    navigate(`/request-history/${id}`);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 py-8">
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
          <div className="lg:col-span-1">
            <ProfileSidebar activeTab="request-history" />
          </div>

          <div className="lg:col-span-3 space-y-6">
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
                      {paginatedData.map((item) => (
                        <tr
                          key={item._id}
                          className="hover:bg-accent/50 transition-colors cursor-pointer"
                          onClick={() => handleDetailClick(item._id)}
                        >
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">
                                {formatRequestDate(item.preferredDate)}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div>
                              <p className="font-medium">
                                {item.facilityId.name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {item.facilityId.address}
                              </p>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              {getUrgencyBadge(item.isUrgent)}
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
                                {item.quantity} ml
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
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between px-6 py-4 border-t bg-accent/50">
                  {/* <div className="text-sm text-muted-foreground">
                    Hiển thị {(currentPage - 1) * limit + 1} đến{" "}
                    {Math.min(currentPage * limit, bloodRequest.length)} trong
                    số {bloodRequest.length} yêu cầu máu
                  </div> */}
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

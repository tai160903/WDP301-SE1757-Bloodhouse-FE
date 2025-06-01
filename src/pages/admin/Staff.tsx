"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Search,
  Edit,
  Trash2,
  Plus,
  Users,
  MapPin,
  Mail,
  Phone,
  Stethoscope,
  ClipboardPlus,
  UserRoundCog,
} from "lucide-react";
import { getAllStaffs } from "@/services/facilityStaff";

interface User {
  _id: string;
  email: string;
  fullName?: string;
  phone?: string;
  avatar: string;
}

interface Facility {
  _id: string;
  name: string;
  address: string;
  id: string;
}

interface Staff {
  _id: string;
  userId: User | null;
  facilityId?: Facility;
  position: string;
  isDeleted: boolean;
}

interface StaffResponse {
  data: {
    data: Staff[];
    metadata: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

function StaffManagement() {
  const [staffs, setStaffs] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [limit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchStaffs = async () => {
      setLoading(true);
      try {
        const res: StaffResponse = await getAllStaffs({
          page: currentPage,
          limit,
          position: "",
        });
        setStaffs(res.data.data);
        setTotalItems(res.data.metadata.total);
        setTotalPages(res.data.metadata.totalPages);
      } catch (err: any) {
        setError(err.message || "Không thể tải danh sách nhân viên.");
      } finally {
        setLoading(false);
      }
    };
    fetchStaffs();
  }, [currentPage, limit]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const getPositionColor = (position: string) => {
    switch (position) {
      case "DOCTOR":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "NURSE":
        return "bg-green-100 text-green-800 border-green-200";
      case "MANAGER":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const uniqueFacilities = new Set(
    staffs.map((staff) => staff.facilityId?.name)
  ).size;
  const activeStaffs = staffs.filter((staff) => !staff.isDeleted).length;
  const medicalStaffs = staffs.filter(
    (staff) => staff.position === "DOCTOR" || staff.position === "NURSE"
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-full">
              <Stethoscope className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Quản lý nhân viên
              </h1>
              <p className="text-gray-600 mt-1">
                Quản lý nhân sự trung tâm hiến máu
              </p>
            </div>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg">
            <Plus className="mr-2 h-4 w-4" />
            Thêm nhân viên mới
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Tổng số nhân viên
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {staffs.length}
                  </p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Tổng số người quản lý
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {activeStaffs}
                  </p>
                </div>
                <UserRoundCog className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Tổng số bác sĩ
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {medicalStaffs}
                  </p>
                </div>
                <Stethoscope className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Tổng số y tá
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {medicalStaffs}
                  </p>
                </div>
                <ClipboardPlus className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card className="shadow-xl border-0 py-0">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
            <CardTitle className="text-xl font-semibold flex items-center gap-2 py-4">
              <Users className="h-5 w-5" />
              Danh sách nhân viên
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Tìm kiếm nhân viên theo tên, vị trí, cơ sở..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 text-base border-2 focus:border-blue-300"
              />
            </div>

            {/* Table */}
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold text-gray-700">
                      Thông tin nhân viên
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      Vị trí
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      Cơ sở y tế
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      Liên hệ
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      Trạng thái
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      Hành động
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {staffs.map((staff) => (
                    <TableRow
                      key={staff._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img
                            src={staff.userId?.avatar || "/default-avatar.png"}
                            alt={
                              staff.userId?.fullName ||
                              staff.userId?.email ||
                              "Staff member"
                            }
                            className="h-10 w-10 rounded-full object-cover"
                          />
                          <div>
                            <div className="font-medium text-gray-900">
                              {staff.userId?.fullName ||
                                staff.userId?.email ||
                                "N/A"}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {staff._id.substring(0, 8)}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`font-medium ${getPositionColor(
                            staff.position
                          )}`}
                        >
                          {staff.position}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-red-500" />
                          <span className="text-sm text-gray-900">
                            {staff.facilityId?.name || "Chưa phân công"}
                          </span>
                        </div>
                        {staff.facilityId?.address && (
                          <div className="text-xs text-gray-500 mt-1">
                            {staff.facilityId.address}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail className="h-3 w-3" />
                            <span>{staff.userId?.email || "N/A"}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="h-3 w-3" />
                            <span>{staff.userId?.phone || "N/A"}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            staff.isDeleted
                              ? "bg-red-100 text-red-800"
                              : "bg-green-100 text-green-800"
                          }
                        >
                          {staff.isDeleted ? "Không hoạt động" : "Hoạt động"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="hover:bg-blue-50 hover:border-blue-300"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="hover:bg-red-50 hover:border-red-300 text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t">
                <div className="text-sm text-gray-600">
                  Hiển thị {(currentPage - 1) * limit + 1} đến{" "}
                  {Math.min(currentPage * limit, totalItems)} trong số{" "}
                  {totalItems} nhân viên
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
                                currentPage === page ? "hover:bg-blue-600" : ""
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
            )}

            {staffs.length === 0 && !loading && (
              <div className="text-center py-12">
                <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Không tìm thấy nhân viên
                </h3>
                <p className="text-gray-500">
                  Không có nhân viên nào phù hợp với tiêu chí tìm kiếm của bạn.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default StaffManagement;

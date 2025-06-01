import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Search, Plus, Heart, Droplets, Edit, Trash2 } from "lucide-react";
import { getUsers } from "@/services/users";
import { Badge } from "@/components/ui/badge";

function BloodDonorManagement() {
  // Mock data for blood donors
  const [users, setUsers] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [limit] = useState(10);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await getUsers({ page: currentPage, limit });
        setUsers(res.data.data);
        setTotalPages(res.data.metadata.totalPages);
        setTotalItems(res.data.metadata.total);
      } catch (err: any) {
        setError(err.message || "Không thể tải danh sách người dùng.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [currentPage, limit]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const [searchTerm, setSearchTerm] = useState("");

  // const filteredDonors = donors.filter(
  //   (donor) =>
  //     donor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     donor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     donor.bloodType.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  const getBloodTypeColor = (bloodType: string) => {
    const colors = {
      "O+": "bg-red-100 text-red-800 border-red-200",
      "O-": "bg-red-200 text-red-900 border-red-300",
      "A+": "bg-blue-100 text-blue-800 border-blue-200",
      "A-": "bg-blue-200 text-blue-900 border-blue-300",
      "B+": "bg-green-100 text-green-800 border-green-200",
      "B-": "bg-green-200 text-green-900 border-green-300",
      "AB+": "bg-purple-100 text-purple-800 border-purple-200",
      "AB-": "bg-purple-200 text-purple-900 border-purple-300",
    };
    return (
      colors[bloodType as keyof typeof colors] ||
      "bg-gray-100 text-gray-800 border-gray-200"
    );
  };

  const getStatusColor = (status: string) => {
    return status === "active"
      ? "bg-green-100 text-green-800 border-green-200"
      : "bg-yellow-100 text-yellow-800 border-yellow-200";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-100 rounded-full">
              <Heart className="h-8 w-8 text-red-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Quản lý thành viên
              </h1>
              <p className="text-gray-600 mt-1">
                Quản lý và theo dõi thành viên hiến máu hiệu quả
              </p>
            </div>
          </div>
          <Button className="bg-red-600 hover:bg-red-700 text-white shadow-lg">
            <Plus className="mr-2 h-4 w-4" />
            Add New Donor
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-l-4 border-l-red-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Users
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {users.length}
                  </p>
                </div>
                <Droplets className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Eligible Donors
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {users.filter((d: any) => d.isAvailable).length}
                  </p>
                </div>
                <Heart className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Donations
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {/* {donors.reduce(
                      (sum, donor) => sum + donor.totalDonations,
                      0
                    )} */}
                  </p>
                </div>
                <Droplets className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Universal Donors (O-)
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {users.filter((d: any) => d?.bloodId?.name === "O-").length}
                  </p>
                </div>
                <Heart className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card className="shadow-xl border-0 py-0">
          <CardHeader className="bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-t-lg">
            <CardTitle className="text-xl font-semibold flex items-center gap-2 py-4">
              <Droplets className="h-5 w-5" />
              Danh sách thành viên
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search donors by name, email, or blood type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 text-base border-2 focus:border-red-300"
              />
            </div>

            {/* Table */}
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold text-gray-700">
                      Thông tin người hiến
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      Liên hệ
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      Nhóm máu
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      Ngày sinh
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      Trạng thái
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      Giới tính
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      Hành động
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user: any) => (
                    <TableRow
                      key={user._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img
                            src={user.avatar}
                            alt={user.fullName || user.email}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                          <div>
                            <div className="font-medium text-gray-900">
                              {user.fullName || user.email}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {user._id.toString().substring(0, 8)}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="text-sm text-gray-900">
                            {user.email}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.phone || "No phone"}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`font-semibold ${getBloodTypeColor(
                            user?.bloodId?.name || "Chưa cập nhật"
                          )}`}
                        >
                          <div className="text-sm">
                            {user?.bloodId?.name || "Chưa cập nhật"}
                          </div>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-900">
                          {user?.yob
                            ? new Date(user.yob).toLocaleDateString()
                            : "Not specified"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`font-medium ${getStatusColor(
                            user.status
                          )}`}
                        >
                          {user.status ? "Hoạt động" : "Không hoạt động"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-900">
                          {user.sex || "Not specified"}
                        </div>
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

            {/* Add pagination controls after the table */}
            <div className="flex items-center justify-between px-6 py-4 border-t">
              <div className="text-sm text-gray-600">
                Showing {(currentPage - 1) * limit + 1} to{" "}
                {Math.min(currentPage * limit, totalItems)} of {totalItems}{" "}
                entries
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
                                ? "bg-blue-600 text-white"
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
  );
}

export default BloodDonorManagement;

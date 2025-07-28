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
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Search,
  Edit,
  Trash2,
  Plus,
  Users,
  MapPin,
  Mail,
  Stethoscope,
  ClipboardPlus,
  UserRoundCog,
  User,
  Briefcase,
  Building2,
  Loader2,
} from "lucide-react";
import {
  getAllStaffs,
  createStaff,
  updateStaff,
  getFacilities,
} from "@/services/facilityStaff";

interface User {
  _id: string;
  email: string;
  fullName: string;
  avatar: string;
}

interface Facility {
  _id: string;
  name: string;
  address: string;
}

interface Staff {
  _id: string;
  userId: User;
  facilityId?: Facility;
  position: string;
  isDeleted: boolean;
  assignedAt?: string;
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

interface FacilityResponse {
  data: {
    total: number;
    result: Facility[];
  };
}

function StaffManagement() {
  const [staffs, setStaffs] = useState<Staff[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [limit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newStaff, setNewStaff] = useState<Partial<Staff>>({});
  const [editStaff, setEditStaff] = useState<Partial<Staff>>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchData();
  }, [currentPage, limit, searchTerm]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [staffRes, facilityRes]: [StaffResponse, FacilityResponse] =
        await Promise.all([
          getAllStaffs({
            page: currentPage,
            limit,
            position: searchTerm ? undefined : "",
            search: searchTerm,
          }),
          getFacilities(),
        ]);
      setStaffs(staffRes.data.data);
      setTotalItems(staffRes.data.metadata.total);
      setTotalPages(staffRes.data.metadata.totalPages);
      const facilityData = Array.isArray(facilityRes.data.result)
        ? facilityRes.data.result
        : [];
      setFacilities(facilityData);
      console.log("Facility API response:", facilityRes.data); // Debug log
      console.log("Facilities set:", facilityData); // Debug log
    } catch (err: any) {
      setError(err.message || "Không thể tải dữ liệu.");
      // Removed alert
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (staff: Partial<Staff>) => {
    const newErrors: { [key: string]: string } = {};
    if (!staff.userId?._id) newErrors.userId = "ID người dùng là bắt buộc.";
    if (!staff.facilityId?._id)
      newErrors.facilityId = "Cơ sở y tế là bắt buộc.";
    if (!staff.position) newErrors.position = "Vị trí là bắt buộc.";
    if (!["DOCTOR", "NURSE", "MANAGER"].includes(staff.position || ""))
      newErrors.position = "Vị trí phải là DOCTOR, NURSE hoặc MANAGER.";
    return newErrors;
  };

  const handleAddStaff = async () => {
    const validationErrors = validateForm(newStaff);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      const payload = {
        userId: newStaff.userId!._id,
        facilityId: newStaff.facilityId!._id,
        position: newStaff.position as "DOCTOR" | "NURSE" | "MANAGER",
        status: "active",
        assignedAt: new Date().toISOString(),
      };
      console.log("Add staff payload:", payload);
      const createdStaff = await createStaff(payload);
      setStaffs([...staffs, createdStaff]);
      setIsAddModalOpen(false);
      setNewStaff({});
      setErrors({});
      fetchData();
    } catch (err: any) {
      setError(err.message || "Không thể thêm nhân viên.");
    }
  };

  const handleUpdateStaff = async () => {
    const validationErrors = validateForm(editStaff);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      const payload = {
        _id: editStaff._id!,
        userId: editStaff.userId!._id,
        facilityId: editStaff.facilityId!._id,
        position: editStaff.position as "DOCTOR" | "NURSE" | "MANAGER",
        assignedAt: editStaff.assignedAt || new Date().toISOString(),
      };
      console.log("Update staff payload:", payload); // Debug log
      const updatedStaff = await updateStaff(payload);
      setStaffs(
        staffs.map((staff) =>
          staff._id === editStaff._id ? updatedStaff : staff
        )
      );
      setIsEditModalOpen(false);
      setEditStaff({});
      setErrors({});
      fetchData();
    } catch (err: any) {
      setError(err.message || "Không thể cập nhật nhân viên.");
    }
  };

  const handleDeleteStaff = async (staffId: string) => {
    try {
      await updateStaff({ _id: staffId, isDeleted: true });
      setStaffs(
        staffs.map((staff) =>
          staff._id === staffId ? { ...staff, isDeleted: true } : staff
        )
      );
    } catch (err: any) {
      setError(err.message || "Không thể xóa nhân viên.");
    }
  };

  const openEditModal = (staff: Staff) => {
    setEditStaff({
      _id: staff._id,
      userId: {
        _id: staff.userId._id,
        fullName: staff.userId.fullName,
        email: staff.userId.email,
        avatar: staff.userId.avatar,
      },
      facilityId: staff.facilityId
        ? {
            _id: staff.facilityId._id,
            name: staff.facilityId.name,
            address: staff.facilityId.address,
          }
        : undefined,
      position: staff.position,
      isDeleted: staff.isDeleted,
      assignedAt: staff.assignedAt,
    });
    setIsEditModalOpen(true);
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
    staffs.map((staff) => staff.facilityId?.name).filter(Boolean)
  ).size;
  const activeStaffs = staffs.filter((staff) => !staff.isDeleted).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
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
          {/* <Button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
          >
            <Plus className="mr-2 h-4 w-4" />
            Thêm nhân viên mới
          </Button> */}
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
                    {totalItems}
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
                    Nhân viên hoạt động
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
                  <p className="text-sm font-medium text-gray-600">Bác sĩ</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {
                      staffs.filter((staff) => staff.position === "DOCTOR")
                        .length
                    }
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
                  <p className="text-sm font-medium text-gray-600">Y tá</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {
                      staffs.filter((staff) => staff.position === "NURSE")
                        .length
                    }
                  </p>
                </div>
                <ClipboardPlus className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add Staff Modal */}
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogContent className="sm:max-w-[700px] bg-white rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto p-0">
            <DialogHeader className="px-6 pt-6 border-b border-gray-200">
              <DialogTitle className="text-2xl font-semibold text-gray-800">
                Thêm nhân viên mới
              </DialogTitle>
            </DialogHeader>

            <div className="px-6 py-4 space-y-5">
              {/* ID người dùng */}
              <div className="space-y-1">
                <Label
                  htmlFor="userId"
                  className="text-sm font-medium text-gray-700 flex items-center gap-2"
                >
                  <User className="h-4 w-4 text-blue-500" />
                  ID người dùng
                </Label>
                <Input
                  id="userId"
                  placeholder="Nhập ID người dùng"
                  value={newStaff.userId?._id || ""}
                  onChange={(e) =>
                    setNewStaff({
                      ...newStaff,
                      userId: { ...newStaff.userId, _id: e.target.value },
                    })
                  }
                  className={`w-full text-sm ${
                    errors.userId ? "border-red-500 focus:ring-red-500" : ""
                  }`}
                />
                {errors.userId && (
                  <p className="text-red-500 text-xs mt-1">{errors.userId}</p>
                )}
              </div>

              {/* Vị trí */}
              <div className="space-y-1">
                <Label
                  htmlFor="position"
                  className="text-sm font-medium text-gray-700 flex items-center gap-2"
                >
                  <Briefcase className="h-4 w-4 text-blue-500" />
                  Vị trí
                </Label>
                <Select
                  value={newStaff.position || ""}
                  onValueChange={(value) =>
                    setNewStaff({ ...newStaff, position: value })
                  }
                >
                  <SelectTrigger
                    id="position"
                    className={`w-full text-sm ${
                      errors.position ? "border-red-500" : ""
                    }`}
                  >
                    <SelectValue placeholder="Chọn vị trí" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DOCTOR">Bác sĩ</SelectItem>
                    <SelectItem value="NURSE">Y tá</SelectItem>
                    <SelectItem value="MANAGER">Quản lý</SelectItem>
                  </SelectContent>
                </Select>
                {errors.position && (
                  <p className="text-red-500 text-xs mt-1">{errors.position}</p>
                )}
              </div>

              {/* Cơ sở y tế */}
              <div className="space-y-1">
                <Label
                  htmlFor="facility"
                  className="text-sm font-medium text-gray-700 flex items-center gap-2"
                >
                  <Building2 className="h-4 w-4 text-blue-500" />
                  Cơ sở y tế
                </Label>
                <Select
                  value={newStaff.facilityId?._id || ""}
                  onValueChange={(value) => {
                    const selected = facilities.find((f) => f._id === value);
                    setNewStaff({
                      ...newStaff,
                      facilityId: selected
                        ? {
                            _id: selected._id,
                            name: selected.name,
                            address: selected.address,
                          }
                        : undefined,
                    });
                  }}
                  disabled={loading || facilities.length === 0}
                >
                  <SelectTrigger
                    id="facility"
                    className={`w-full text-sm ${
                      errors.facilityId ? "border-red-500" : ""
                    }`}
                  >
                    <SelectValue
                      placeholder={
                        loading
                          ? "Đang tải cơ sở..."
                          : facilities.length === 0
                          ? "Không có cơ sở y tế"
                          : "Chọn cơ sở y tế"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {loading ? (
                      <div className="flex items-center justify-center p-2">
                        <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                        <span className="ml-2 text-sm text-gray-500">
                          Đang tải...
                        </span>
                      </div>
                    ) : (
                      facilities.map((facility) => (
                        <SelectItem
                          key={facility._id}
                          value={facility._id}
                          className="text-sm"
                        >
                          {facility.name} ({facility.address})
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {errors.facilityId && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.facilityId}
                  </p>
                )}
              </div>
            </div>

            {/* Footer */}
            <DialogFooter className="px-6 py-4 border-t border-gray-200 flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setNewStaff({});
                  setErrors({});
                }}
                className="border-gray-300 hover:bg-gray-100 text-sm px-4 py-2"
              >
                Hủy
              </Button>
              <Button
                onClick={handleAddStaff}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2"
                disabled={loading || facilities.length === 0}
              >
                Lưu
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="sm:max-w-[700px] bg-white rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto p-0">
            <DialogHeader className="px-6 py-4 border-b border-gray-200">
              <DialogTitle className="text-2xl font-semibold text-gray-800">
                Cập nhật nhân viên
              </DialogTitle>
            </DialogHeader>

            <div className="px-6 py-4 space-y-4">
              {/* User ID */}
              <div className="space-y-2">
                <Label
                  htmlFor="editUserId"
                  className="text-sm font-medium text-gray-700 flex items-center gap-2"
                >
                  <User className="h-4 w-4 text-blue-500" />
                  ID người dùng
                </Label>
                <Input
                  id="editUserId"
                  placeholder="Nhập ID người dùng"
                  value={editStaff.userId?._id || ""}
                  onChange={(e) =>
                    setEditStaff({
                      ...editStaff,
                      userId: { ...editStaff.userId, _id: e.target.value },
                    })
                  }
                  className={`w-full mt-1 text-sm rounded-md ${
                    errors.userId
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                />
                {errors.userId && (
                  <p className="text-red-500 text-xs mt-1">{errors.userId}</p>
                )}
              </div>

              {/* Position */}
              <div className="space-y-2">
                <Label
                  htmlFor="editPosition"
                  className="text-sm font-medium text-gray-700 flex items-center gap-2"
                >
                  <Briefcase className="h-4 w-4 text-blue-500" />
                  Vị trí
                </Label>
                <Select
                  value={editStaff.position || ""}
                  onValueChange={(value) =>
                    setEditStaff({ ...editStaff, position: value })
                  }
                >
                  <SelectTrigger
                    id="editPosition"
                    className={`w-full mt-1 text-sm rounded-md ${
                      errors.position
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
                  >
                    <SelectValue placeholder="Chọn vị trí" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DOCTOR">Bác sĩ</SelectItem>
                    <SelectItem value="NURSE">Y tá</SelectItem>
                    <SelectItem value="MANAGER">Quản lý</SelectItem>
                  </SelectContent>
                </Select>
                {errors.position && (
                  <p className="text-red-500 text-xs mt-1">{errors.position}</p>
                )}
              </div>

              {/* Facility */}
              <div className="space-y-2">
                <Label
                  htmlFor="editFacility"
                  className="text-sm font-medium text-gray-700 flex items-center gap-2"
                >
                  <Building2 className="h-4 w-4 text-blue-500" />
                  Cơ sở y tế
                </Label>
                <Select
                  value={editStaff.facilityId?._id || ""}
                  onValueChange={(value) => {
                    const selectedFacility = facilities.find(
                      (f) => f._id === value
                    );
                    setEditStaff({
                      ...editStaff,
                      facilityId: selectedFacility
                        ? {
                            _id: selectedFacility._id,
                            name: selectedFacility.name,
                            address: selectedFacility.address,
                          }
                        : undefined,
                    });
                  }}
                  disabled={loading || facilities.length === 0}
                >
                  <SelectTrigger
                    id="editFacility"
                    className={`w-full mt-1 text-sm rounded-md ${
                      errors.facilityId
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
                  >
                    <SelectValue
                      placeholder={
                        loading
                          ? "Đang tải cơ sở..."
                          : facilities.length === 0
                          ? "Không có cơ sở y tế"
                          : "Chọn cơ sở y tế"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {loading ? (
                      <div className="flex items-center justify-center p-2">
                        <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                        <span className="ml-2 text-sm text-gray-500">
                          Đang tải...
                        </span>
                      </div>
                    ) : facilities.length > 0 ? (
                      facilities.map((facility) => (
                        <SelectItem
                          key={facility._id}
                          value={facility._id}
                          className="text-sm"
                        >
                          {facility.name} ({facility.address})
                        </SelectItem>
                      ))
                    ) : (
                      <div className="p-2 text-sm text-gray-500">
                        Không có cơ sở y tế
                      </div>
                    )}
                  </SelectContent>
                </Select>
                {errors.facilityId && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.facilityId}
                  </p>
                )}
              </div>
            </div>

            <DialogFooter className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditStaff({});
                  setErrors({});
                }}
                className="text-sm px-4 py-2 border-gray-300 hover:bg-gray-100 transition-colors"
              >
                Hủy
              </Button>
              <Button
                onClick={handleUpdateStaff}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 transition-colors disabled:opacity-50"
                disabled={loading || facilities.length === 0}
              >
                Lưu
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Main Content */}
        <Card className="shadow-xl border-0 py-0">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
            <CardTitle className="text-xl font-semibold flex items-center gap-2 py-4">
              <Users className="h-5 w-5" />
              Danh sách nhân viên
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {error && (
              <div className="text-red-500 text-center mb-4">{error}</div>
            )}
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

            {loading && (
              <div className="text-center py-12">
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-gray-600" />
                <p className="text-gray-600 mt-2">Đang tải...</p>
              </div>
            )}

            {!loading && (
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
                              src={
                                staff.userId?.avatar || "/default-avatar.png"
                              }
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
                                ID: {staff._id}
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
                              onClick={() => openEditModal(staff)}
                              className="hover:bg-blue-50 hover:border-blue-300"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="hover:bg-red-50 hover:border-red-300 text-red-600"
                              onClick={() => handleDeleteStaff(staff._id)}
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
            )}

            {!loading && totalPages > 1 && (
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
            )}

            {!loading && staffs.length === 0 && (
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

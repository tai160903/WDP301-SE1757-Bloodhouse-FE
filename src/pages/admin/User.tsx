"use client";

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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Search,
  Plus,
  Heart,
  Droplets,
  Edit,
  Trash2,
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Calendar,
  Eye,
  Award,
  Building,
  Activity,
  Clock,
} from "lucide-react";
import { adminCreateUser, detailUser, getUsers } from "@/services/users";
import { Badge } from "@/components/ui/badge";

// Mock blood types data - replace with actual API call
const bloodTypes = [
  { id: "60f1a5b3e5c7d2a1b3c4d5e1", name: "A+" },
  { id: "60f1a5b3e5c7d2a1b3c4d5e2", name: "A-" },
  { id: "60f1a5b3e5c7d2a1b3c4d5e3", name: "B+" },
  { id: "60f1a5b3e5c7d2a1b3c4d5e4", name: "B-" },
  { id: "60f1a5b3e5c7d2a1b3c4d5e5", name: "AB+" },
  { id: "60f1a5b3e5c7d2a1b3c4d5e6", name: "AB-" },
  { id: "60f1a5b3e5c7d2a1b3c4d5e7", name: "O+" },
  { id: "60f1a5b3e5c7d2a1b3c4d5e8", name: "O-" },
];

interface CreateUserForm {
  fullName: string;
  email: string;
  password: string;
  role: string;
  sex: string;
  yob: string;
  phone: string;
  address: string;
  idCard: string;
  bloodId: string;
  isAvailable: boolean;
}

function BloodDonorManagement() {
  const [users, setUsers] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [limit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>([]);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Form state
  const [formData, setFormData] = useState<CreateUserForm>({
    fullName: "",
    email: "",
    password: "",
    role: "",
    sex: "",
    yob: "",
    phone: "",
    address: "",
    idCard: "",
    bloodId: "",
    isAvailable: true,
  });

  const [formErrors, setFormErrors] = useState<Partial<CreateUserForm>>({});

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
  useEffect(() => {
    fetchUsers();
  }, [currentPage, limit]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleInputChange = (
    field: keyof CreateUserForm,
    value: string | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const handleViewDetail = async (userId: string) => {
    setLoadingDetail(true);
    try {
      const response = await detailUser(userId);
      console.log(response.data.data);
      if (response.data.status === 200) {
        setSelectedUser(response.data.data);
      }
      setIsDetailModalOpen(true);
    } catch (error: any) {
      console.error("Error fetching user detail:", error);
      setError(error.message || "Không thể tải thông tin chi tiết người dùng");
    } finally {
      setLoadingDetail(false);
    }
  };

  const validateForm = (): boolean => {
    const errors: Partial<CreateUserForm> = {};

    if (!formData.fullName.trim()) errors.fullName = "Họ tên là bắt buộc";
    if (!formData.email.trim()) errors.email = "Email là bắt buộc";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      errors.email = "Email không hợp lệ";
    if (!formData.password.trim()) errors.password = "Mật khẩu là bắt buộc";
    else if (formData.password.length < 6)
      errors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    if (!formData.role) errors.role = "Vai trò là bắt buộc";
    if (!formData.sex) errors.sex = "Giới tính là bắt buộc";
    if (!formData.yob) errors.yob = "Năm sinh là bắt buộc";
    if (!formData.phone.trim()) errors.phone = "Số điện thoại là bắt buộc";
    if (!formData.address.trim()) errors.address = "Địa chỉ là bắt buộc";
    if (!formData.idCard.trim()) errors.idCard = "CMND/CCCD là bắt buộc";
    if (!formData.bloodId) errors.bloodId = "Nhóm máu là bắt buộc";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Replace with actual API call
      console.log("Creating user:", formData);

      const res = await adminCreateUser(formData);
      console.log(res);

      // Reset form and close modal
      setFormData({
        fullName: "",
        email: "",
        password: "",
        role: "DONOR",
        sex: "",
        yob: "",
        phone: "",
        address: "",
        idCard: "",
        bloodId: "",
        isAvailable: true,
      });
      setIsCreateModalOpen(false);

      // Refresh users list
      fetchUsers();
    } catch (error) {
      console.error("Error creating user:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

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

          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-red-600 hover:bg-red-700 text-white shadow-lg">
                <Plus className="mr-2 h-4 w-4" />
                Thêm thành viên mới
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <User className="h-5 w-5 text-red-600" />
                  Tạo thành viên mới
                </DialogTitle>
                <DialogDescription>
                  Điền thông tin để tạo tài khoản thành viên mới trong hệ thống
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="fullName"
                      className="text-sm font-medium flex items-center gap-2"
                    >
                      <User className="h-4 w-4" />
                      Họ và tên *
                    </Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) =>
                        handleInputChange("fullName", e.target.value)
                      }
                      placeholder="Nhập họ và tên"
                      className={formErrors.fullName ? "border-red-500" : ""}
                    />
                    {formErrors.fullName && (
                      <p className="text-sm text-red-500">
                        {formErrors.fullName}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-sm font-medium flex items-center gap-2"
                    >
                      <Mail className="h-4 w-4" />
                      Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      placeholder="Nhập địa chỉ email"
                      className={formErrors.email ? "border-red-500" : ""}
                    />
                    {formErrors.email && (
                      <p className="text-sm text-red-500">{formErrors.email}</p>
                    )}
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">
                      Mật khẩu *
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                      placeholder="Nhập mật khẩu"
                      className={formErrors.password ? "border-red-500" : ""}
                    />
                    {formErrors.password && (
                      <p className="text-sm text-red-500">
                        {formErrors.password}
                      </p>
                    )}
                  </div>

                  {/* Role */}
                  <div className="space-y-2">
                    <Label htmlFor="role" className="text-sm font-medium">
                      Vai trò *
                    </Label>
                    <Select
                      value={formData.role}
                      onValueChange={(value) =>
                        handleInputChange("role", value)
                      }
                    >
                      <SelectTrigger
                        className={formErrors.role ? "border-red-500" : ""}
                      >
                        <SelectValue placeholder="Chọn vai trò" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MEMBER">Người dùng</SelectItem>
                        <SelectItem value="MANAGER">Quản lý</SelectItem>
                        <SelectItem value="DOCTOR">Bác sĩ</SelectItem>
                        <SelectItem value="NURSE">Y tá</SelectItem>
                        <SelectItem value="TRANSPORTER">
                          Nhân viên giao máu
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {formErrors.role && (
                      <p className="text-sm text-red-500">{formErrors.role}</p>
                    )}
                  </div>

                  {/* Sex */}
                  <div className="space-y-2">
                    <Label htmlFor="sex" className="text-sm font-medium">
                      Giới tính *
                    </Label>
                    <Select
                      value={formData.sex}
                      onValueChange={(value) => handleInputChange("sex", value)}
                    >
                      <SelectTrigger
                        className={formErrors.sex ? "border-red-500" : ""}
                      >
                        <SelectValue placeholder="Chọn giới tính" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Nam</SelectItem>
                        <SelectItem value="female">Nữ</SelectItem>
                        <SelectItem value="other">Khác</SelectItem>
                      </SelectContent>
                    </Select>
                    {formErrors.sex && (
                      <p className="text-sm text-red-500">{formErrors.sex}</p>
                    )}
                  </div>

                  {/* Year of Birth */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="yob"
                      className="text-sm font-medium flex items-center gap-2"
                    >
                      <Calendar className="h-4 w-4" />
                      Năm sinh *
                    </Label>
                    <Input
                      id="yob"
                      type="date"
                      value={formData.yob}
                      onChange={(e) => handleInputChange("yob", e.target.value)}
                      className={formErrors.yob ? "border-red-500" : ""}
                    />
                    {formErrors.yob && (
                      <p className="text-sm text-red-500">{formErrors.yob}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="phone"
                      className="text-sm font-medium flex items-center gap-2"
                    >
                      <Phone className="h-4 w-4" />
                      Số điện thoại *
                    </Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      placeholder="Nhập số điện thoại"
                      className={formErrors.phone ? "border-red-500" : ""}
                    />
                    {formErrors.phone && (
                      <p className="text-sm text-red-500">{formErrors.phone}</p>
                    )}
                  </div>

                  {/* ID Card */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="idCard"
                      className="text-sm font-medium flex items-center gap-2"
                    >
                      <CreditCard className="h-4 w-4" />
                      CMND/CCCD *
                    </Label>
                    <Input
                      id="idCard"
                      value={formData.idCard}
                      onChange={(e) =>
                        handleInputChange("idCard", e.target.value)
                      }
                      placeholder="Nhập số CMND/CCCD"
                      className={formErrors.idCard ? "border-red-500" : ""}
                    />
                    {formErrors.idCard && (
                      <p className="text-sm text-red-500">
                        {formErrors.idCard}
                      </p>
                    )}
                  </div>

                  {/* Blood Type */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="bloodId"
                      className="text-sm font-medium flex items-center gap-2"
                    >
                      <Droplets className="h-4 w-4" />
                      Nhóm máu *
                    </Label>
                    <Select
                      value={formData.bloodId}
                      onValueChange={(value) =>
                        handleInputChange("bloodId", value)
                      }
                    >
                      <SelectTrigger
                        className={formErrors.bloodId ? "border-red-500" : ""}
                      >
                        <SelectValue placeholder="Chọn nhóm máu" />
                      </SelectTrigger>
                      <SelectContent>
                        {bloodTypes.map((bloodType) => (
                          <SelectItem key={bloodType.id} value={bloodType.id}>
                            {bloodType.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formErrors.bloodId && (
                      <p className="text-sm text-red-500">
                        {formErrors.bloodId}
                      </p>
                    )}
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <Label
                    htmlFor="address"
                    className="text-sm font-medium flex items-center gap-2"
                  >
                    <MapPin className="h-4 w-4" />
                    Địa chỉ *
                  </Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    placeholder="Nhập địa chỉ đầy đủ"
                    className={formErrors.address ? "border-red-500" : ""}
                  />
                  {formErrors.address && (
                    <p className="text-sm text-red-500">{formErrors.address}</p>
                  )}
                </div>

                {/* Is Available */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isAvailable"
                    checked={formData.isAvailable}
                    onCheckedChange={(checked) =>
                      handleInputChange("isAvailable", checked as boolean)
                    }
                  />
                  <Label htmlFor="isAvailable" className="text-sm font-medium">
                    Sẵn sàng hiến máu
                  </Label>
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreateModalOpen(false)}
                    disabled={isSubmitting}
                  >
                    Hủy
                  </Button>
                  <Button
                    type="submit"
                    className="bg-red-600 hover:bg-red-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Đang tạo..." : "Tạo thành viên"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
          <DialogContent className="w-7xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Eye className="h-5 w-5 text-red-600" />
                Chi tiết thành viên
              </DialogTitle>
              <DialogDescription>
                Thông tin chi tiết của thành viên trong hệ thống
              </DialogDescription>
            </DialogHeader>

            {loadingDetail ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-2"></div>
                  <p className="text-gray-600">Đang tải thông tin...</p>
                </div>
              </div>
            ) : selectedUser ? (
              <div className="space-y-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <User className="h-5 w-5 text-blue-600" />
                      Thông tin cá nhân
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start gap-6">
                      <img
                        src={
                          selectedUser.avatar ||
                          "/placeholder.svg?height=100&width=100"
                        }
                        alt={selectedUser.fullName}
                        className="h-24 w-24 rounded-full object-cover border-4 border-gray-200"
                      />
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-600">
                            Họ và tên
                          </Label>
                          <p className="text-base font-semibold text-gray-900">
                            {selectedUser.fullName || "N/a"}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-600">
                            Email
                          </Label>
                          <p className="text-base text-gray-900">
                            {selectedUser.email || "N/a"}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-600">
                            Vai trò
                          </Label>
                          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                            {selectedUser.role || "N/a"}
                          </Badge>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-600">
                            Trạng thái
                          </Label>
                          <Badge>{selectedUser.status || "N/a"}</Badge>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-600">
                            Giới tính
                          </Label>
                          <p className="text-base text-gray-900">
                            {selectedUser.sex === "male"
                              ? "Nam"
                              : selectedUser.sex === "female"
                              ? "Nữ"
                              : "Khác"}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-600">
                            Ngày sinh
                          </Label>
                          <p className="text-base text-gray-900">
                            {new Date(selectedUser.yob).toLocaleDateString(
                              "vi-VN"
                            ) || "N/a"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Phone className="h-5 w-5 text-green-600" />
                        Thông tin liên hệ
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          Số điện thoại
                        </Label>
                        <p className="text-base text-gray-900">
                          {selectedUser.phone || "N/a"}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Địa chỉ
                        </Label>
                        <p className="text-base text-gray-900">
                          {selectedUser.address || "N/a"}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                          <CreditCard className="h-4 w-4" />
                          CMND/CCCD
                        </Label>
                        <p className="text-base text-gray-900">
                          {selectedUser.idCard || "N/a"}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Droplets className="h-5 w-5 text-red-600" />
                        Thông tin máu
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-600">
                          Nhóm máu
                        </Label>
                        <Badge>{selectedUser?.bloodId?.name || "N/a"}</Badge>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">
                          Sẵn sàng hiến máu
                        </Label>
                        <Badge
                          className={
                            selectedUser.isAvailable
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }
                        >
                          {selectedUser?.isAvailable ? "Có" : "Không"}
                        </Badge>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                          <Award className="h-4 w-4" />
                          Cấp độ hồ sơ
                        </Label>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">
                            {selectedUser.profileLevel || "N/a"}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {selectedUser?.facilityStaffInfo ? (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Building className="h-5 w-5 text-purple-600" />
                        Thông tin nhân viên cơ sở
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-600">
                            Chức vụ
                          </Label>
                          <p className="text-base font-semibold text-gray-900">
                            {selectedUser.facilityStaffInfo.position || "N/a"}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-600">
                            Ngày bổ nhiệm
                          </Label>
                          <p className="text-base text-gray-900">
                            {new Date(
                              selectedUser.facilityStaffInfo.assignedAt
                            ).toLocaleDateString("vi-VN") || "N/a"}
                          </p>
                        </div>
                        <div className="md:col-span-2">
                          <Label className="text-sm font-medium text-gray-600">
                            Cơ sở làm việc
                          </Label>
                          <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-semibold text-gray-900">
                              {selectedUser.facilityStaffInfo.facility.name ||
                                "N/a"}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {selectedUser.facilityStaffInfo.facility
                                .address || "N/a"}
                            </p>
                            <div className="flex gap-4 mt-2">
                              <span className="text-sm text-gray-600">
                                📞{" "}
                                {selectedUser.facilityStaffInfo.facility
                                  .contactPhone || "N/a"}
                              </span>
                              <span className="text-sm text-gray-600">
                                ✉️{" "}
                                {selectedUser.facilityStaffInfo.facility
                                  .contactEmail || "N/a"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : null}

                {selectedUser?.donationStats ? (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Activity className="h-5 w-5 text-red-600" />
                        Thống kê hiến máu
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="text-center p-4 bg-red-50 rounded-lg">
                          <p className="text-sm font-medium text-gray-600">
                            Lần hiến máu hoàn thành
                          </p>
                          <div className="text-3xl font-bold text-red-600 mb-2">
                            {selectedUser.donationStats.completedDonations ||
                              "N/a"}
                          </div>
                        </div>
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <div className="text-lg font-semibold text-blue-600 mb-2 gap-2">
                            <p className="text-sm font-medium text-gray-600">
                              Lần hiến máu gần nhất
                            </p>
                            <div className="text-3xl font-bold text-blue-600 mb-2">
                              {selectedUser.donationStats.latestDonationDate
                                ? new Date(
                                    selectedUser.donationStats.latestDonationDate
                                  ).toLocaleDateString("vi-VN")
                                : "N/a"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : null}

                <div className="flex justify-end pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => setIsDetailModalOpen(false)}
                  >
                    Đóng
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">
                  Không thể tải thông tin người dùng
                </p>
              </div>
            )}
          </DialogContent>
        </Dialog>

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
              {/* <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search donors by name, email, or blood type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 text-base border-2 focus:border-red-300"
              /> */}
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
                            src={user.avatar || "/placeholder.svg"}
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
                            className="hover:bg-blue-50 hover:border-blue-300 bg-transparent"
                            onClick={() => handleViewDetail(user._id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {/* <Button
                            variant="outline"
                            size="sm"
                            className="hover:bg-red-50 hover:border-red-300 text-red-600 bg-transparent"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button> */}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
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

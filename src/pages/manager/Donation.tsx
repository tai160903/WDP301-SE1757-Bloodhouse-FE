"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Calendar,
  Clock,
  Droplets,
  Eye,
  Filter,
  Gift,
  Loader2,
  Phone,
  Search,
  UserCheck,
  X,
} from "lucide-react";
import { useManagerContext } from "@/components/ManagerLayout";
import { useNavigate } from "react-router-dom";
import { get } from "axios";
import { getAllBloodDonation, getHealthCheck } from "@/services/bloodDonation";
import { s } from "node_modules/framer-motion/dist/types.d-CtuPurYT";

// Định nghĩa các trạng thái hiến máu
export const BLOOD_DONATION_STATUS = {
  PENDING_APPROVAL: "pending_approval",
  REJECTED_REGISTRATION: "rejected_registration",
  REGISTERED: "registered",
  CHECKED_IN: "checked_in",
  IN_CONSULT: "in_consult",
  REJECTED: "rejected",
  WAITING_DONATION: "waiting_donation",
  DONATING: "donating",
  DONATED: "donated",
  RESTING: "resting",
  POST_REST_CHECK: "post_rest_check",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

// Bản dịch tiếng Việt cho trạng thái
const BLOOD_DONATION_STATUS_VI: Record<string, string> = {
  completed: "Hoàn tất",
  cancelled: "Đã hủy",
};

// Định nghĩa interface cho Donation

// Màu sắc cho các trạng thái
const getStatusColor = (status: string) => {
  switch (status) {
    case BLOOD_DONATION_STATUS.CANCELLED:
      return "bg-red-100 text-red-800";
    case BLOOD_DONATION_STATUS.COMPLETED:
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

function DonationManagement() {
  const { facilityId } = useManagerContext();
  const navigate = useNavigate();
  const [donations, setDonations] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [totalDonations, setTotalDonations] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [healthCheckData, setHealthCheckData] = useState<any>(null);
  const [loadingHealthCheck, setLoadingHealthCheck] = useState(false);
  const limit = 10;

  console.log(statusFilter);
  useEffect(() => {
    const fetchDonations = async () => {
      try {
        setLoading(true);
        const status = statusFilter === "all" ? "" : statusFilter;
        const response = await getAllBloodDonation({
          status: status,
          limit: limit,
          page: currentPage,
        });
        setTimeout(() => {
          setDonations(response.data);
          setTotalDonations(response.metadata.total);
          setLoading(false);
        }, 1000);
        setTotalPages(response.metadata.totalPages);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu hiến máu:", error);
        setLoading(false);
      }
    };

    fetchDonations();
  }, [statusFilter, facilityId, currentPage]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getInitials = (name: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleViewDetail = (donation: any) => {
    setSelectedDonation(donation);
    setIsDetailOpen(true);

    // Call getHealthCheck if bloodDonationRegistrationId exists
    if (donation.bloodDonationRegistrationId) {
      fetchHealthCheck(donation.bloodDonationRegistrationId._id);
    } else {
      setHealthCheckData(null);
    }
  };

  const fetchHealthCheck = async (registrationId: string) => {
    try {
      setLoadingHealthCheck(true);
      const response = await getHealthCheck(registrationId);
      console.log("Health Check Data:", response.data);
      // Extract the healthCheck data from the response
      setHealthCheckData(response.data?.healthCheck || null);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu khám sức khỏe:", error);
      setHealthCheckData(null);
    } finally {
      setLoadingHealthCheck(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Quản Lý Hiến Máu
          </h1>
          <p className="text-muted-foreground">
            Theo dõi và quản lý các cuộc hẹn hiến máu
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng lượt hiến máu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDonations}</div>
            {/* <p className="text-xs text-muted-foreground">
              {
                donations?.filter(
                  (d) => d.status === BLOOD_DONATION_STATUS.COMPLETED
                ).length
              }{" "}
              đã hoàn thành
            </p> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Lượng máu thu được
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {donations
                ?.filter((d) => d.status === BLOOD_DONATION_STATUS.COMPLETED)
                ?.reduce((acc, curr) => acc + curr.quantity, 0)}{" "}
              ml
            </div>
            <p className="text-xs text-muted-foreground">
              Từ{" "}
              {
                donations?.filter(
                  (d) => d.status === BLOOD_DONATION_STATUS.COMPLETED
                ).length
              }{" "}
              cuộc hẹn
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Hôm nay</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                donations?.filter(
                  (d) =>
                    d.appointmentDate === new Date().toISOString().split("T")[0]
                ).length
              }
            </div>
            <p className="text-xs text-muted-foreground">cuộc hẹn hiến máu</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsContent value="all" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Quản lý hiến máu</CardTitle>
              <CardDescription>
                Quản lý tất cả các cuộc hẹn hiến máu tại cơ sở của bạn
              </CardDescription>
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="search"
                    placeholder="Tìm kiếm theo tên, email, số điện thoại..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                      <div className="flex items-center">
                        <Filter className="w-4 h-4 mr-2" />
                        <SelectValue placeholder="Trạng thái" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả trạng thái</SelectItem>
                      {Object.entries(BLOOD_DONATION_STATUS_VI).map(
                        ([key, value]) => (
                          <SelectItem key={key} value={key}>
                            {value}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                  <Input
                    type="date"
                    className="w-[160px]"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                </div>
              ) : donations.length === 0 ? (
                <div className="text-center py-8">
                  <Droplets className="mx-auto h-12 w-12 text-gray-300" />
                  <h3 className="mt-2 text-lg font-medium">
                    Không tìm thấy cuộc hẹn
                  </h3>
                  <p className="mt-1 text-gray-500">
                    Không có cuộc hẹn hiến máu nào phù hợp với tìm kiếm của bạn.
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Người hiến máu</TableHead>
                      <TableHead>Nhóm máu</TableHead>
                      <TableHead>Số lượng</TableHead>
                      <TableHead>Ngày hẹn</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {donations.map((donation) => (
                      <TableRow key={donation._id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={donation?.userId?.avatar}
                                alt={donation?.userId?.fullName}
                              />
                              <AvatarFallback>
                                {getInitials(donation?.userId?.fullName)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">
                                {donation?.userId?.fullName}
                              </div>
                              <div className="text-sm text-gray-500">
                                {donation?.userId?.email}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="bg-red-50 text-red-700"
                          >
                            {donation?.bloodGroupId?.name || "Chưa xác định"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Droplets className="mr-1 h-4 w-4 text-red-400" />
                            <span>{donation.quantity} ml</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Calendar className="mr-1 h-4 w-4 text-gray-400" />
                            <span>{formatDate(donation.donationDate)}</span>
                          </div>
                        </TableCell>

                        <TableCell>
                          <Badge className={getStatusColor(donation.status)}>
                            {BLOOD_DONATION_STATUS_VI[donation.status]}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-blue-600 border-blue-200 hover:bg-blue-50"
                            onClick={() => handleViewDetail(donation)}
                          >
                            <Eye className="mr-1 h-4 w-4" />
                            Chi tiết
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
              <div className="flex justify-between items-center mt-6">
                <Button
                  variant="outline"
                  disabled={currentPage === 1}
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                >
                  Trang trước
                </Button>
                <span className="text-gray-600">
                  Trang {currentPage} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                >
                  Trang sau
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Các tab khác cũng sử dụng nội dung tương tự */}
        <TabsContent value="today" className="mt-4">
          {/* Nội dung tương tự tab all */}
        </TabsContent>
        <TabsContent value="pending" className="mt-4">
          {/* Nội dung tương tự tab all */}
        </TabsContent>
        <TabsContent value="ongoing" className="mt-4">
          {/* Nội dung tương tự tab all */}
        </TabsContent>
        <TabsContent value="completed" className="mt-4">
          {/* Nội dung tương tự tab all */}
        </TabsContent>
      </Tabs>

      {/* Dialog chi tiết hiến máu */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="text-center pb-6">
            <DialogTitle className="text-2xl font-bold text-gray-900">
              Chi tiết hiến máu
            </DialogTitle>
            <DialogDescription className="text-gray-600 mt-2">
              Thông tin chi tiết về cuộc hẹn hiến máu
            </DialogDescription>
          </DialogHeader>

          {selectedDonation && (
            <div className="space-y-8">
              {/* Donor Profile Section */}
              <div className="flex flex-col items-center space-y-4 bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-6">
                <Avatar className="h-24 w-24 ring-4 ring-white shadow-lg">
                  <AvatarImage
                    src={selectedDonation.userId.avatar}
                    alt={selectedDonation.userId.fullName}
                  />
                  <AvatarFallback className="text-2xl bg-red-100 text-red-700">
                    {getInitials(selectedDonation.userId.fullName)}
                  </AvatarFallback>
                </Avatar>

                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedDonation.userId.fullName}
                  </h2>
                  <Badge className="mt-2 bg-red-100 text-red-800 px-3 py-1 text-sm font-medium">
                    Nhóm máu{" "}
                    {selectedDonation.bloodGroupId.name || "Chưa xác định"}
                  </Badge>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Phone className="w-5 h-5 text-gray-600 mr-2" />
                  Thông tin liên hệ
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600 font-medium">
                      Số điện thoại:
                    </span>
                    <span className="text-gray-900">
                      {selectedDonation.userId.phone}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-gray-600 font-medium">Email:</span>
                    <span className="text-gray-900">
                      {selectedDonation.userId.email}
                    </span>
                  </div>
                </div>
              </div>

              {/* Donation Information */}
              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Droplets className="w-5 h-5 text-blue-600 mr-2" />
                  Thông tin hiến máu
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 font-medium">
                        Ngày hẹn:
                      </span>
                      <span className="text-gray-900">
                        {formatDate(selectedDonation.donationDate)}
                      </span>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 font-medium">
                        Trạng thái:
                      </span>
                      <Badge
                        className={getStatusColor(selectedDonation.status)}
                      >
                        {BLOOD_DONATION_STATUS_VI[selectedDonation.status]}
                      </Badge>
                    </div>
                  </div>

                  {selectedDonation.status ===
                    BLOOD_DONATION_STATUS.COMPLETED && (
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 font-medium">
                          Lượng máu hiến:
                        </span>
                        <span className="text-red-600 font-semibold">
                          {selectedDonation.quantity} ml
                        </span>
                      </div>
                    </div>
                  )}

                  {selectedDonation.giftPackageId && (
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 font-medium">
                          Gói quà:
                        </span>
                        <span className="text-gray-900">
                          {selectedDonation.giftPackageId.name}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {selectedDonation.notes && (
                  <div className="mt-4 bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-start">
                      <span className="text-gray-600 font-medium mr-3 mt-1">
                        Ghi chú:
                      </span>
                      <span className="text-gray-900 flex-1">
                        {selectedDonation.notes}
                      </span>
                    </div>
                  </div>
                )}

                {selectedDonation.bloodDonationRegistrationId && (
                  <div className="mt-4 bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 font-medium">
                        Đơn đăng ký hiến máu:
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 font-mono text-sm px-3 py-1 font-sans"
                        onClick={() =>
                          navigate(
                            `/manager/requests/${selectedDonation.bloodDonationRegistrationId._id}`
                          )
                        }
                      >
                        <Eye className="mr-2 h-3 w-3" />
                        Xem chi tiết
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Health Check Data */}
              {selectedDonation.bloodDonationRegistrationId && (
                <div className="bg-green-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <UserCheck className="w-5 h-5 text-green-600 mr-2" />
                    Thông tin khám sức khỏe
                  </h3>
                  {loadingHealthCheck ? (
                    <div className="flex justify-center items-center py-8 bg-white rounded-lg">
                      <Loader2 className="h-8 w-8 animate-spin text-green-500" />
                      <span className="ml-3 text-gray-600 font-medium">
                        Đang tải dữ liệu...
                      </span>
                    </div>
                  ) : healthCheckData ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {healthCheckData.bloodPressure && (
                        <div className="bg-white rounded-lg p-4 shadow-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600 font-medium">
                              Huyết áp:
                            </span>
                            <span className="text-gray-900 font-semibold">
                              {healthCheckData.bloodPressure}
                            </span>
                          </div>
                        </div>
                      )}

                      {healthCheckData.pulse && (
                        <div className="bg-white rounded-lg p-4 shadow-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600 font-medium">
                              Nhịp tim:
                            </span>
                            <span className="text-gray-900 font-semibold">
                              {healthCheckData.pulse} bpm
                            </span>
                          </div>
                        </div>
                      )}

                      {healthCheckData.temperature && (
                        <div className="bg-white rounded-lg p-4 shadow-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600 font-medium">
                              Nhiệt độ:
                            </span>
                            <span className="text-gray-900 font-semibold">
                              {healthCheckData.temperature}°C
                            </span>
                          </div>
                        </div>
                      )}

                      {healthCheckData.weight && (
                        <div className="bg-white rounded-lg p-4 shadow-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600 font-medium">
                              Cân nặng:
                            </span>
                            <span className="text-gray-900 font-semibold">
                              {healthCheckData.weight} kg
                            </span>
                          </div>
                        </div>
                      )}

                      {healthCheckData.hemoglobin && (
                        <div className="bg-white rounded-lg p-4 shadow-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600 font-medium">
                              Hemoglobin:
                            </span>
                            <span className="text-gray-900 font-semibold">
                              {healthCheckData.hemoglobin} g/dL
                            </span>
                          </div>
                        </div>
                      )}

                      {healthCheckData.generalCondition && (
                        <div className="bg-white rounded-lg p-4 shadow-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600 font-medium">
                              Tình trạng:
                            </span>
                            <span className="text-gray-900 font-semibold">
                              {healthCheckData.generalCondition}
                            </span>
                          </div>
                        </div>
                      )}

                      {healthCheckData.isEligible !== undefined && (
                        <div className="bg-white rounded-lg p-4 shadow-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600 font-medium">
                              Đủ điều kiện:
                            </span>
                            <Badge
                              className={
                                healthCheckData.isEligible
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }
                            >
                              {healthCheckData.isEligible ? "Có" : "Không"}
                            </Badge>
                          </div>
                        </div>
                      )}

                      {healthCheckData.doctorId && (
                        <div className="bg-white rounded-lg p-4 shadow-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600 font-medium">
                              Bác sĩ:
                            </span>
                            <span className="text-gray-900 font-semibold">
                              {healthCheckData.doctorId.userId?.fullName}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-white rounded-lg p-6 text-center">
                      <div className="text-gray-400 mb-2">
                        <UserCheck className="h-8 w-8 mx-auto" />
                      </div>
                      <p className="text-gray-500 font-medium">
                        Không có dữ liệu khám sức khỏe
                      </p>
                    </div>
                  )}

                  {healthCheckData?.notes && (
                    <div className="mt-4 bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-start">
                        <span className="text-gray-600 font-medium mr-3 mt-1">
                          Ghi chú khám:
                        </span>
                        <span className="text-gray-900 flex-1">
                          {healthCheckData.notes}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default DonationManagement;

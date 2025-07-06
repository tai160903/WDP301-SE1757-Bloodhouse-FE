"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Droplet,
  User,
  Phone,
  Clock,
  CheckCircle,
  AlertCircle,
  Building2,
  Heart,
  Navigation,
  QrCode,
  UserCheck,
  Mail,
  QrCodeIcon as ScanQrCode,
  Stethoscope,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { getBloodDonationDetail } from "@/services/bloodDonationRegis";

const BloodDonationDetail: React.FC = () => {
  const [donationDetail, setDonationDetail] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    fetchDonationDetail();
  }, [id]);

  const fetchDonationDetail = async () => {
    setLoading(true);
    try {
      const response = await getBloodDonationDetail(id);

      if (response.status === 200) {
        setDonationDetail(response.data);
      } else {
        console.error("Error fetching donation detail:", response.message);
      }
    } catch (error) {
      console.error("Error fetching donation detail:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatAge = (yob: string) => {
    const birthYear = new Date(yob).getFullYear();
    const currentYear = new Date().getFullYear();
    return currentYear - birthYear;
  };

  const translateStatus = (status: string) => {
    const statusMap: {
      [key: string]: { text: string; className: string; icon: any };
    } = {
      pending_approval: {
        text: "Chờ duyệt",
        className: "border-yellow-200 bg-yellow-50 text-yellow-700",
        icon: Clock,
      },
      rejected_registration: {
        text: "Từ chối đăng ký",
        className: "border-red-200 bg-red-50 text-red-700",
        icon: AlertCircle,
      },
      registered: {
        text: "Đã đăng ký",
        className: "border-blue-200 bg-blue-50 text-blue-700",
        icon: CheckCircle,
      },
      checked_in: {
        text: "Đã điểm danh",
        className: "border-green-200 bg-green-50 text-green-700",
        icon: UserCheck,
      },
      in_consult: {
        text: "Đang tư vấn",
        className: "border-purple-200 bg-purple-50 text-purple-700",
        icon: Stethoscope,
      },
      rejected: {
        text: "Bị từ chối",
        className: "border-red-200 bg-red-50 text-red-700",
        icon: AlertCircle,
      },
      waiting_donation: {
        text: "Chờ hiến máu",
        className: "border-orange-200 bg-orange-50 text-orange-700",
        icon: Clock,
      },
      donating: {
        text: "Đang hiến máu",
        className: "border-blue-200 bg-blue-50 text-blue-700",
        icon: Droplet,
      },
      donated: {
        text: "Đã hiến máu",
        className: "border-green-200 bg-green-50 text-green-700",
        icon: Heart,
      },
      resting: {
        text: "Nghỉ ngơi",
        className: "border-gray-200 bg-gray-50 text-gray-700",
        icon: Clock,
      },
      post_rest_check: {
        text: "Kiểm tra sau nghỉ ngơi",
        className: "border-purple-200 bg-purple-50 text-purple-700",
        icon: Stethoscope,
      },
      completed: {
        text: "Hoàn tất",
        className: "border-green-200 bg-green-50 text-green-700",
        icon: CheckCircle,
      },
      cancelled: {
        text: "Đã hủy",
        className: "border-gray-200 bg-gray-50 text-gray-700",
        icon: AlertCircle,
      },
    };

    return (
      statusMap[status] || {
        text: "Không xác định",
        className: "border-gray-200 bg-gray-50 text-gray-700",
        icon: Clock,
      }
    );
  };

  const translateGender = (sex: string) => {
    return sex === "male" ? "Nam" : "Nữ";
  };

  const translatePosition = (position: string) => {
    const positionMap: { [key: string]: string } = {
      NURSE: "Y tá",
      DOCTOR: "Bác sĩ",
      TECHNICIAN: "Kỹ thuật viên",
      ADMIN: "Quản trị viên",
    };
    return positionMap[position] || position;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  if (!donationDetail) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            Không tìm thấy thông tin đăng ký
          </p>
        </div>
      </div>
    );
  }

  const statusInfo = translateStatus(donationDetail.status);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight text-primary">
              Chi tiết đăng ký hiến máu
            </h1>
            <p className="text-muted-foreground">
              Mã đăng ký: {donationDetail.code}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={statusInfo.className}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {statusInfo.text}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Donor Information */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Thông tin người hiến máu
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={donationDetail.userId.avatar || "/placeholder.svg"}
                    alt="Avatar"
                    className="w-16 h-16 rounded-full object-cover border-2 border-accent"
                  />
                  <div>
                    <h3 className="text-xl font-semibold">
                      {donationDetail.userId.fullName}
                    </h3>
                    <p className="text-muted-foreground">
                      {donationDetail.userId.email}
                    </p>
                  </div>
                </div>
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Số điện thoại
                    </label>
                    <p className="text-base font-medium flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {donationDetail.userId.phone}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Tuổi
                    </label>
                    <p className="text-base font-medium">
                      {formatAge(donationDetail.userId.yob)} tuổi
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Giới tính
                    </label>
                    <p className="text-base font-medium">
                      {translateGender(donationDetail.userId.sex)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Donation Details */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-primary" />
                  Chi tiết hiến máu
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Nhóm máu
                    </label>
                    <Badge variant="outline" className="mt-1 text-lg px-3 py-1">
                      {donationDetail.bloodGroupId.name}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Lượng máu dự kiến
                    </label>
                    <p className="text-lg font-semibold flex items-center gap-2">
                      <Droplet className="h-4 w-4 text-primary" />
                      {donationDetail.expectedQuantity} ml
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Nguồn đăng ký
                    </label>
                    <p className="text-base font-medium">
                      {donationDetail.source}
                    </p>
                  </div>
                </div>
                <Separator />
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Ghi chú
                  </label>
                  <p className="text-base mt-1 p-3 bg-accent rounded-lg">
                    {donationDetail.notes}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* QR Code Section */}
            {donationDetail.qrCodeUrl && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <QrCode className="h-5 w-5 text-primary" />
                    Mã QR
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <img
                    src={donationDetail.qrCodeUrl || "/placeholder.svg"}
                    alt="QR Code"
                    className="w-48 h-48 mx-auto border rounded-lg"
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    Sử dụng mã QR này để check-in tại điểm hiến máu
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar Information */}
          <div className="space-y-6">
            {/* Hospital Information */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  Cơ sở y tế
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Tên bệnh viện
                  </label>
                  <p className="font-semibold">
                    {donationDetail.facilityId.name}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Địa chỉ
                  </label>
                  <p className="text-sm flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    {donationDetail.facilityId.address}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Điện thoại
                  </label>
                  <p className="text-sm flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    {donationDetail.facilityId.contactPhone}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Email
                  </label>
                  <p className="text-sm flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    {donationDetail.facilityId.contactEmail}
                  </p>
                </div>
                {/* <Button
                  variant="outline"
                  className="w-full mt-3 bg-transparent"
                >
                  <Navigation className="h-4 w-4 mr-2" />
                  Chỉ đường
                </Button> */}
              </CardContent>
            </Card>

            {/* Staff Information */}
            {donationDetail.staffId && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserCheck className="h-5 w-5 text-primary" />
                    Nhân viên phụ trách
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Họ và tên
                    </label>
                    <p className="font-semibold">
                      {donationDetail.staffId.userId.fullName}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Chức vụ
                    </label>
                    <Badge variant="outline" className="mt-1">
                      {translatePosition(donationDetail.staffId.position)}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Email
                    </label>
                    <p className="text-sm">
                      {donationDetail.staffId.userId.email}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Số điện thoại
                    </label>
                    <p className="text-sm flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      {donationDetail.staffId.userId.phone}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Timeline */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Thời gian
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Ngày đăng ký
                  </label>
                  <p className="text-sm flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {formatDateTime(donationDetail.createdAt)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Ngày mong muốn hiến
                  </label>
                  <p className="text-sm flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {formatDateTime(donationDetail.preferredDate)}
                  </p>
                </div>
                {donationDetail.checkInAt && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Thời gian check-in
                    </label>
                    <p className="text-sm flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {formatDateTime(donationDetail.checkInAt)}
                    </p>
                  </div>
                )}
                {donationDetail.completedAt && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Thời gian hoàn thành
                    </label>
                    <p className="text-sm flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {formatDateTime(donationDetail.completedAt)}
                    </p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Cập nhật lần cuối
                  </label>
                  <p className="text-sm flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {formatDateTime(donationDetail.updatedAt)}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Registration Code */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ScanQrCode className="h-5 w-5 text-primary" />
                  Mã đăng ký
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-2xl font-mono font-bold text-primary mb-2">
                  {donationDetail.code}
                </div>
                <p className="text-sm text-muted-foreground">
                  Sử dụng mã này để tra cứu thông tin đăng ký
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BloodDonationDetail;

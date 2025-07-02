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
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Download,
  Eye,
  Building2,
  Stethoscope,
  Navigation,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { getBloodRequestHistoryDetail } from "@/services/bloodRequest";

const BloodRequestDetail: React.FC = () => {
  const [requestDetail, setRequestDetail] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    fetchRequestDetail();
  }, [id]);

  const fetchRequestDetail = async () => {
    setLoading(true);
    try {
      const response = await getBloodRequestHistoryDetail(id);
      if (response.status === 200) {
        setRequestDetail(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching request detail:", error);
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

  const getStatusInfo = (status: string, isFulfilled: boolean) => {
    if (isFulfilled) {
      return {
        text: "Đã hoàn thành",
        className: "border-green-200 bg-green-50 text-green-700",
        icon: CheckCircle,
      };
    }

    switch (status.toLowerCase()) {
      case "pending_approval":
        return {
          text: "Đang chờ",
          className: "border-yellow-200 bg-yellow-50 text-yellow-700",
          icon: Clock,
        };
      case "rejected_registration":
        return {
          text: "Đã hủy",
          className: "border-red-200 bg-red-50 text-red-700",
          icon: AlertCircle,
        };
      case "approved":
        return {
          text: "Xác nhận",
          className: "border-red-200 bg-red-50 text-red-700",
          icon: AlertCircle,
        };
      case "assigned":
        return {
          text: "Đã phân công",
          className: "border-blue-200 bg-blue-50 text-blue-700",
          icon: Clock,
        };
      case "ready_for_handover":
        return {
          text: "Chuẩn bị để giao",
          className: "border-blue-200 bg-blue-50 text-blue-700",
          icon: Clock,
        };
      case "completed":
        return {
          text: "Hoàn thành",
          className: "border-blue-200 bg-blue-50 text-blue-700",
          icon: Clock,
        };
      case "cancelled":
        return {
          text: "Đã hủy",
          className: "border-red-200 bg-red-50 text-red-700",
          icon: AlertCircle,
        };

      default:
        return {
          text: "Không xác định",
          className: "border-gray-200 bg-gray-50 text-gray-700",
          icon: Clock,
        };
    }
  };

  const convertToRawURL = (url: string) => {
    return url.replace("/image/", "/raw/");
  };

  const handleDocumentView = (url: string) => {
    window.open(convertToRawURL(url), "_blank");
  };

  const handleDocumentDownload = (url: string, index: number) => {
    const rawUrl = url.replace("/image/", "/raw/");
    const link = document.createElement("a");
    link.href = rawUrl;
    link.download = `medical-document-${index + 1}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

  if (!requestDetail) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            Không tìm thấy thông tin yêu cầu
          </p>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(
    requestDetail.status,
    requestDetail.isFulfilled
  );
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
              Chi tiết yêu cầu máu
            </h1>
            <p className="text-muted-foreground">
              Mã yêu cầu: {requestDetail._id}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={statusInfo.className}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {statusInfo.text}
            </Badge>
            {requestDetail.isUrgent && (
              <Badge
                variant="outline"
                className="border-red-200 bg-red-50 text-red-700"
              >
                <AlertCircle className="h-3 w-3 mr-1" />
                Khẩn cấp
              </Badge>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Patient Information */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Thông tin bệnh nhân
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Họ và tên
                    </label>
                    <p className="text-lg font-semibold">
                      {requestDetail.patientName}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Số điện thoại
                    </label>
                    <p className="text-lg font-semibold flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {requestDetail.patientPhone}
                    </p>
                  </div>
                </div>
                <Separator />
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Địa chỉ bệnh nhân
                  </label>
                  <p className="text-base flex items-start gap-2 mt-1">
                    <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    {requestDetail.address}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Medical Information */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Stethoscope className="h-5 w-5 text-primary" />
                  Thông tin y tế
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Nhóm máu
                    </label>
                    <Badge variant="outline" className="mt-1 text-lg px-3 py-1">
                      {requestDetail.groupId.name}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Thành phần máu
                    </label>
                    <p className="text-base font-medium">
                      {requestDetail.componentId.name}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Lượng máu cần
                    </label>
                    <p className="text-lg font-semibold flex items-center gap-2">
                      <Droplet className="h-4 w-4 text-primary" />
                      {requestDetail.quantity} ml
                    </p>
                  </div>
                </div>
                <Separator />
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Lý do yêu cầu
                  </label>
                  <p className="text-base mt-1 p-3 bg-accent rounded-lg">
                    {requestDetail.reason}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Medical Documents */}
            {requestDetail.medicalDocumentUrl.length > 0 && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Tài liệu y tế ({requestDetail.medicalDocumentUrl.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {requestDetail.medicalDocumentUrl.map(
                      (url: any, index: any) => (
                        <div
                          key={index}
                          className="border rounded-lg p-4 bg-accent/50"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <FileText className="h-5 w-5 text-muted-foreground" />
                              <span className="font-medium">
                                Tài liệu {index + 1}
                              </span>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDocumentView(url)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                Xem
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleDocumentDownload(url, index)
                                }
                              >
                                <Download className="h-4 w-4 mr-1" />
                                Tải
                              </Button>
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
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
                    {requestDetail.facilityId.name}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Địa chỉ
                  </label>
                  <p className="text-sm flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    {requestDetail.facilityId.address}
                  </p>
                </div>
              </CardContent>
            </Card>

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
                    Ngày tạo yêu cầu
                  </label>
                  <p className="text-sm flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {formatDateTime(requestDetail.createdAt)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Ngày mong muốn
                  </label>
                  <p className="text-sm flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {formatDateTime(requestDetail.preferredDate)}
                  </p>
                </div>
                {requestDetail.scheduledDeliveryDate && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Ngày giao dự kiến
                    </label>
                    <p className="text-sm flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {formatDateTime(requestDetail.scheduledDeliveryDate)}
                    </p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Cập nhật lần cuối
                  </label>
                  <p className="text-sm flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {formatDateTime(requestDetail.updatedAt)}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Requester Information */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Người yêu cầu
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Họ và tên
                  </label>
                  <p className="font-semibold">
                    {requestDetail.userId.fullName}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Email
                  </label>
                  <p className="text-sm">{requestDetail.userId.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Số điện thoại
                  </label>
                  <p className="text-sm flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    {requestDetail.userId.phone}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BloodRequestDetail;

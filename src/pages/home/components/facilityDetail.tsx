"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  Clock,
  Star,
  Calendar,
  Navigation,
  Share2,
  Heart,
  CheckCircle,
  AlertCircle,
  Building2,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { getFacilityById } from "@/services/facility";

// Types based on your API response
interface Schedule {
  _id: string;
  facilityId: string;
  dayOfWeek: number;
  openTime: string;
  closeTime: string;
  isOpen: boolean;
  __v: number;
  created_at: string;
  id: string;
}

interface MainImage {
  _id: string;
  facilityId: string;
  url: string;
  isMain: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Location {
  type: string;
  coordinates: [number, number];
}

interface FacilityDetail {
  _id: string;
  name: string;
  code: string;
  address: string;
  avgRating: number;
  totalFeedback: number;
  contactPhone: string;
  contactEmail: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  schedules: Schedule[];
  mainImage: MainImage;
  location: Location;
  id: string;
}

const FacilityDetail: React.FC = () => {
  const [facilityDetail, setFacilityDetail] = useState<FacilityDetail | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchFacilityDetail();
  }, [id]);

  const fetchFacilityDetail = async () => {
    setLoading(true);
    try {
      const response = await getFacilityById(id);
      if (response.status === 200) {
        console.log(response.message);
        setFacilityDetail(response.data);
      }
    } catch (error) {
      console.error("Error fetching facility detail:", error);
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

  const formatRating = (rating: number) => {
    return rating ? rating.toFixed(1) : "0.0";
  };

  const getDayName = (dayOfWeek: number) => {
    const days = [
      "Chủ nhật",
      "Thứ hai",
      "Thứ ba",
      "Thứ tư",
      "Thứ năm",
      "Thứ sáu",
      "Thứ bảy",
    ];
    return days[dayOfWeek];
  };

  const getCurrentDaySchedule = () => {
    if (!facilityDetail?.schedules) return null;
    const today = new Date().getDay();
    return facilityDetail.schedules.find(
      (schedule) => schedule.dayOfWeek === today
    );
  };

  const isCurrentlyOpen = () => {
    const todaySchedule = getCurrentDaySchedule();
    if (!todaySchedule || !todaySchedule.isOpen) return false;

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const [openHour, openMin] = todaySchedule.openTime.split(":").map(Number);
    const [closeHour, closeMin] = todaySchedule.closeTime
      .split(":")
      .map(Number);
    const openTime = openHour * 60 + openMin;
    const closeTime = closeHour * 60 + closeMin;

    return currentTime >= openTime && currentTime <= closeTime;
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: facilityDetail?.name,
          text: `Xem thông tin ${facilityDetail?.name}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Đã sao chép link vào clipboard!");
    }
  };

  const handleGetDirections = () => {
    if (facilityDetail?.location.coordinates) {
      const [lng, lat] = facilityDetail.location.coordinates;
      const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
      window.open(url, "_blank");
    }
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

  if (!facilityDetail) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            Không tìm thấy thông tin cơ sở y tế
          </p>
        </div>
      </div>
    );
  }

  const currentlyOpen = isCurrentlyOpen();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold tracking-tight text-primary">
                {facilityDetail.name}
              </h1>
              {facilityDetail.isActive ? (
                <Badge className="bg-green-500 hover:bg-green-600">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Đang hoạt động
                </Badge>
              ) : (
                <Badge variant="destructive">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Tạm ngưng
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground">
              Mã cơ sở: {facilityDetail.code}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* <Button
              variant="outline"
              size="icon"
              onClick={() => setIsFavorite(!isFavorite)}
            >
              <Heart
                className={`h-4 w-4 ${
                  isFavorite ? "fill-red-500 text-red-500" : ""
                }`}
              />
            </Button> */}
            <Button variant="outline" size="icon" onClick={handleShare}>
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Image */}
            <Card className="shadow-lg overflow-hidden">
              <div className="relative h-96">
                <img
                  src={
                    facilityDetail.mainImage?.url ||
                    "/placeholder.svg?height=400&width=800"
                  }
                  alt={facilityDetail.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </Card>

            {/* Rating and Feedback */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-primary" />
                  Đánh giá và phản hồi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-5 w-5 ${
                            star <= Math.floor(facilityDetail.avgRating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-2xl font-bold">
                      {formatRating(facilityDetail.avgRating)}
                    </span>
                  </div>
                  <div className="text-muted-foreground">
                    <span className="font-medium">
                      {facilityDetail.totalFeedback}
                    </span>{" "}
                    đánh giá
                  </div>
                </div>
                {facilityDetail.totalFeedback === 0 && (
                  <p className="text-muted-foreground">
                    Chưa có đánh giá nào cho cơ sở này.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Schedule */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Lịch hoạt động
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {facilityDetail.schedules
                    .sort((a, b) => a.dayOfWeek - b.dayOfWeek)
                    .map((schedule) => {
                      const isToday =
                        schedule.dayOfWeek === new Date().getDay();
                      return (
                        <div
                          key={schedule._id}
                          className={`flex items-center justify-between p-3 rounded-lg ${
                            isToday
                              ? "bg-accent border border-primary/20"
                              : "bg-accent/50"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`font-medium ${
                                isToday ? "text-primary" : ""
                              }`}
                            >
                              {getDayName(schedule.dayOfWeek)}
                            </span>
                            {isToday && (
                              <Badge variant="outline" className="text-xs">
                                Hôm nay
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {schedule.isOpen ? (
                              <>
                                <span className="text-sm">
                                  {schedule.openTime} - {schedule.closeTime}
                                </span>
                                {isToday && (
                                  <Badge
                                    className={
                                      currentlyOpen
                                        ? "bg-green-500"
                                        : "bg-red-500"
                                    }
                                  >
                                    {currentlyOpen ? "Đang mở" : "Đã đóng"}
                                  </Badge>
                                )}
                              </>
                            ) : (
                              <span className="text-sm text-muted-foreground">
                                Đóng cửa
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  Thông tin liên hệ
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Địa chỉ
                  </label>
                  <p className="text-base flex items-start gap-2 mt-1">
                    <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                    {facilityDetail.address}
                  </p>
                </div>
                <Separator />
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Số điện thoại
                  </label>
                  <p className="text-base flex items-center gap-2 mt-1">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a
                    //   href={`tel:${facilityDetail.contactPhone}`}
                    //   className="hover:text-primary"
                    >
                      {facilityDetail.contactPhone}
                    </a>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Email
                  </label>
                  <p className="text-base flex items-center gap-2 mt-1">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a
                    //   href={`mailto:${facilityDetail.contactEmail}`}
                    //   className="hover:text-primary"
                    >
                      {facilityDetail.contactEmail}
                    </a>
                  </p>
                </div>
                <Separator />
                {/* <Button onClick={handleGetDirections} className="w-full">
                  <Navigation className="h-4 w-4 mr-2" />
                  Chỉ đường
                </Button> */}
              </CardContent>
            </Card>

            {/* Location Map */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Vị trí
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-accent rounded-lg flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <MapPin className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm">Bản đồ sẽ hiển thị tại đây</p>
                    <p className="text-xs mt-1">
                      Tọa độ: {facilityDetail.location.coordinates[1]},{" "}
                      {facilityDetail.location.coordinates[0]}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Info */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Thông tin bổ sung
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Ngày tạo
                  </label>
                  <p className="text-sm">
                    {formatDateTime(facilityDetail.createdAt)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Cập nhật lần cuối
                  </label>
                  <p className="text-sm">
                    {formatDateTime(facilityDetail.updatedAt)}
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

export default FacilityDetail;

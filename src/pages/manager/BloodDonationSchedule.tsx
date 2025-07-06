"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  CalendarDays,
  Heart,
  Plus,
  CheckCircle,
  Clock,
  User,
} from "lucide-react";
import { format, isSameDay } from "date-fns";
import { vi } from "date-fns/locale";
import { getAllBloodDonation } from "@/services/bloodDonation";
import { instance } from "@/services/instance";

export default function BloodDonationCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState<any>(null);

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    const response = await instance.get<any>(
      `/blood-donation-registration/facility/all?status=registered&limit=1000`
    );
    console.log("Fetched donations:", response.data.data.data);
    setDonations(response.data.data.data);
  };

  // Dữ liệu mẫu các lịch hiến máu
  const [donations, setDonations] = useState<any[]>([]);

  // Form data cho đăng ký mới
  const [formData, setFormData] = useState({
    donorName: "",
    phone: "",
    bloodType: "",
    preferredDate: "",
    time: "",
    notes: "",
  });

  // Lấy các ngày có lịch hẹn
  const getDonationsForDate = (date: Date) => {
    // Sửa lỗi so sánh ngày: chuyển preferredDate (string) thành Date trước khi so sánh
    return donations.filter((donation) =>
      isSameDay(
        typeof donation.preferredDate === "string"
          ? new Date(donation.preferredDate)
          : donation.preferredDate,
        date
      )
    );
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const newDonation: any = {
      id: Date.now().toString(),
      donorName: formData.donorName,
      phone: formData.phone,
      bloodType: formData.bloodType,
      date: new Date(formData?.preferredDate),
      time: formData.time,
      status: "scheduled",
      notes: formData.notes,
    };

    setDonations([...donations, newDonation]);
    setFormData({
      donorName: "",
      phone: "",
      bloodType: "",
      preferredDate: "",
      time: "",
      notes: "",
    });
    setShowRegisterForm(false);
  };

  // Xử lý check-in
  const handleCheckIn = () => {
    if (selectedDonation) {
      setDonations(
        donations.map((d) =>
          d.id === selectedDonation.id
            ? { ...d, status: "completed" as const }
            : d
        )
      );
      setShowCheckInModal(false);
    }
  };

  // Custom day renderer cho calendar
  const isDonationDay = (date: Date) => {
    return getDonationsForDate(date).length > 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="h-8 w-8 text-red-500" />
            <h1 className="text-3xl font-bold text-gray-900">Lịch Hiến Máu</h1>
          </div>
          <p className="text-gray-600">Quản lý lịch hẹn hiến máu và check-in</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Calendar Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5" />
                  Lịch Hiến Máu
                </CardTitle>
                <CardDescription>
                  Bấm vào ngày có lịch hẹn để check-in
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  locale={vi}
                  className="rounded-md border"
                  modifiers={{
                    donation: isDonationDay,
                  }}
                  modifiersStyles={{
                    donation: {
                      backgroundColor: "#fecaca",
                      color: "#dc2626",
                      fontWeight: "bold",
                    },
                  }}
                  onDayClick={handleDateClick}
                />
                <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-200 rounded"></div>
                    <span>Ngày có lịch hẹn</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Thao tác nhanh</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Dialog
                  open={showRegisterForm}
                  onOpenChange={setShowRegisterForm}
                >
                  <DialogTrigger asChild>
                    <Button className="w-full" size="lg">
                      <Plus className="h-4 w-4 mr-2" />
                      Đăng ký hiến máu
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Đăng ký hiến máu</DialogTitle>
                      <DialogDescription>
                        Điền thông tin để đăng ký lịch hiến máu
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleRegister} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="donorName">Họ và tên</Label>
                        <Input
                          id="donorName"
                          value={formData.donorName}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              donorName: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Số điện thoại</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bloodType">Nhóm máu</Label>
                        <Select
                          value={formData.bloodType}
                          onValueChange={(value) =>
                            setFormData({ ...formData, bloodType: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn nhóm máu" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="A+">A+</SelectItem>
                            <SelectItem value="A-">A-</SelectItem>
                            <SelectItem value="B+">B+</SelectItem>
                            <SelectItem value="B-">B-</SelectItem>
                            <SelectItem value="AB+">AB+</SelectItem>
                            <SelectItem value="AB-">AB-</SelectItem>
                            <SelectItem value="O+">O+</SelectItem>
                            <SelectItem value="O-">O-</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="date">Ngày</Label>
                        <Input
                          id="date"
                          type="date"
                          value={formData.preferredDate}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              preferredDate: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="time">Giờ</Label>
                        <Input
                          id="time"
                          type="time"
                          value={formData.time}
                          onChange={(e) =>
                            setFormData({ ...formData, time: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="notes">Ghi chú</Label>
                        <Textarea
                          id="notes"
                          value={formData.notes}
                          onChange={(e) =>
                            setFormData({ ...formData, notes: e.target.value })
                          }
                          placeholder="Ghi chú thêm (tùy chọn)"
                        />
                      </div>
                      <Button type="submit" className="w-full">
                        Đăng ký
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>

            {/* Today's Appointments */}
            <Card>
              <CardHeader>
                <CardTitle>Lịch hẹn hôm nay</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedDate &&
                getDonationsForDate(selectedDate).length > 0 ? (
                  <div className="space-y-3">
                    {getDonationsForDate(selectedDate).map((donation) => (
                      <div
                        key={donation.id || donation._id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-red-100 transition"
                        onClick={() => {
                          setSelectedDonation(donation);
                          setShowCheckInModal(true);
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <User className="h-4 w-4 text-gray-500" />
                          <div>
                            <p className="font-medium text-sm">
                              {donation.userId?.fullName || donation.donorName}
                            </p>
                            <p className="text-xs text-gray-500">
                              {format(
                                typeof donation.preferredDate === "string"
                                  ? new Date(donation.preferredDate)
                                  : donation.preferredDate,
                                "dd/MM/yyyy HH:mm"
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {donation.bloodGroupId?.name || donation.bloodType}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">Không có lịch hẹn</p>
                )}
              </CardContent>
            </Card>

            {/* Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Thống kê</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Tổng lịch hẹn:</span>
                  <span className="font-medium">{donations.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Đã hoàn thành:</span>
                  <span className="font-medium text-green-600">
                    {donations.filter((d) => d.status === "completed").length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Đang chờ:</span>
                  <span className="font-medium text-orange-600">
                    {donations.filter((d) => d.status === "scheduled").length}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Check-in Modal */}
        <Dialog open={showCheckInModal} onOpenChange={setShowCheckInModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Check-in hiến máu</DialogTitle>
              <DialogDescription>
                Xác nhận check-in cho lịch hẹn hiến máu
              </DialogDescription>
            </DialogHeader>
            {selectedDonation && (
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Người hiến:</span>
                    <span className="font-medium">
                      {selectedDonation.userId?.fullName ||
                        selectedDonation.donorName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      Số điện thoại:
                    </span>
                    <span className="font-medium">
                      {selectedDonation.userId?.phone || selectedDonation.phone}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Nhóm máu:</span>
                    <Badge>{selectedDonation.bloodGroupId?.name}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Ngày giờ:</span>
                    <span className="font-medium">
                      {format(
                        typeof selectedDonation.preferredDate === "string"
                          ? new Date(selectedDonation.preferredDate)
                          : selectedDonation.preferredDate,
                        "dd/MM/yyyy",
                        { locale: vi }
                      )}{" "}
                      - {selectedDonation.time}
                    </span>
                  </div>
                  {selectedDonation.notes && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Ghi chú:</span>
                      <span className="font-medium">
                        {selectedDonation.notes}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Trạng thái:</span>
                    <Badge
                      variant={
                        selectedDonation.status === "registered"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {selectedDonation.status === "completed"
                        ? "Đã hoàn thành"
                        : "Đang chờ"}
                    </Badge>
                  </div>
                </div>
                <Button onClick={handleCheckIn} className="w-full">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Xác nhận Check-in
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

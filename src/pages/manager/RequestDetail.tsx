"use client";

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { bloodDonationRegisDetail } from "@/services/bloodDonationRegis";
import { format } from "date-fns";
import clsx from "clsx";

// Trạng thái đăng ký hiến máu
export const BLOOD_DONATION_REGISTRATION_STATUS = {
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
} as const;

// Bản dịch tiếng Việt cho trạng thái
const BLOOD_DONATION_REGISTRATION_STATUS_VI: Record<string, string> = {
  pending_approval: "Chờ duyệt",
  rejected_registration: "Từ chối đăng ký",
  registered: "Đã đăng ký",
  checked_in: "Đã điểm danh",
  in_consult: "Đang tư vấn",
  rejected: "Bị từ chối",
  waiting_donation: "Chờ hiến máu",
  donating: "Đang hiến máu",
  donated: "Đã hiến máu",
  resting: "Đang nghỉ ngơi",
  post_rest_check: "Kiểm tra sau nghỉ",
  completed: "Hoàn tất",
  cancelled: "Đã hủy",
};

// Hàm dịch trạng thái sang tiếng Việt
const translateStatus = (status: string): string => {
  return BLOOD_DONATION_REGISTRATION_STATUS_VI[status?.toLowerCase()] || "Không xác định";
};

// Màu sắc cho trạng thái (bạn có thể chỉnh lại nếu muốn)
const getStatusStyle = (status: string) => {
  const map: Record<string, string> = {
    pending_approval: "bg-yellow-100 text-yellow-800",
    rejected_registration: "bg-red-100 text-red-800",
    registered: "bg-blue-100 text-blue-800",
    checked_in: "bg-blue-200 text-blue-900",
    in_consult: "bg-indigo-100 text-indigo-800",
    rejected: "bg-red-200 text-red-900",
    waiting_donation: "bg-purple-100 text-purple-800",
    donating: "bg-pink-100 text-pink-800",
    donated: "bg-green-100 text-green-800",
    resting: "bg-teal-100 text-teal-800",
    post_rest_check: "bg-cyan-100 text-cyan-800",
    completed: "bg-indigo-100 text-indigo-800",
    cancelled: "bg-gray-100 text-gray-800",
  };
  return map[status?.toLowerCase()] || "bg-gray-100 text-gray-800";
};

export default function RequestDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const data = await bloodDonationRegisDetail(id);
        setRequest(data);
      } catch (err) {
        console.error("Lỗi khi lấy chi tiết:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  const handleGoBack = () => {
    navigate(-1); // quay lại trang trước
  };

  if (loading)
    return <div className="p-6 text-center text-muted-foreground">Đang tải dữ liệu...</div>;
  if (!request)
    return <div className="p-6 text-center text-red-600">Không tìm thấy yêu cầu</div>;

  const infoList = [
    { label: "Mã yêu cầu", value: request.code },
    {
      label: "Người yêu cầu",
      value: `${request.userId?.fullName || "N/A"} (${request.userId?.email || "N/A"})`,
    },
    { label: "Số điện thoại", value: request.userId?.phone || "N/A" },
    { label: "Nhóm máu", value: request.bloodGroupId?.name || "N/A" },
    { label: "Số lượng yêu cầu", value: `${request.expectedQuantity} ml` },
    { label: "Ngày yêu cầu", value: format(new Date(request.createdAt), "dd/MM/yyyy HH:mm") },
    { label: "Ngày mong muốn", value: format(new Date(request.preferredDate), "dd/MM/yyyy HH:mm") },
    ...(request.completedAt
      ? [{ label: "Ngày hoàn thành", value: format(new Date(request.completedAt), "dd/MM/yyyy HH:mm") }]
      : []),
    { label: "Bệnh viện", value: request.facilityId?.name || "N/A" },
    { label: "Nhân viên xử lý", value: request.staffId?.userId?.fullName || "Chưa phân công" },
    { label: "Ghi chú", value: request.notes || "Không có" },
    {
      label: "Trạng thái",
      value: (
        <Badge className={clsx("capitalize", getStatusStyle(request.status))}>
          {translateStatus(request.status)}
        </Badge>
      ),
    },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={handleGoBack} className="flex items-center gap-2 hover:bg-gray-50">
          <ArrowLeft className="w-4 h-4" />
          Quay lại
        </Button>
        <div className="h-6 w-px bg-gray-300" />
      </div>

      <Card className="shadow-lg border">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-primary">
            🩸 Chi tiết yêu cầu hiến máu
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm md:text-base">
          {infoList.map((item, index) => (
            <InfoRow
              key={index}
              label={item.label}
              value={item.value}
              isLast={index === infoList.length - 1}
            />
          ))}

          {request.qrCodeUrl && (
            <div>
              <strong className="block mb-2">Mã QR:</strong>
              <img
                src={request.qrCodeUrl || "/placeholder.svg"}
                alt="QR Code"
                className="w-44 h-44 border rounded shadow-md"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

const InfoRow = ({
  label,
  value,
  isLast,
}: {
  label: string;
  value: string | React.ReactNode;
  isLast?: boolean;
}) => (
  <div className={clsx("flex items-start gap-2", !isLast && "border-b pb-3 mb-3")}>
    <strong className="min-w-[150px]">{label}:</strong>
    <span className="text-muted-foreground">{value}</span>
  </div>
);

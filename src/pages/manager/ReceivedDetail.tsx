"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Copy, ArrowLeft } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { getBloodRequestId } from "../../services/bloodRequest/index";
import { useManagerContext } from "@/components/ManagerLayout";

// Định nghĩa enum trạng thái
enum BLOOD_REQUEST_STATUS {
  PENDING_APPROVAL = "Chờ xem xét",
  REJECTED_REGISTRATION = "Bị từ chối",
  APPROVED = "Đã phê duyệt",
  ASSIGNED = "Đã phân công",
  READY_FOR_DELIVERY = "Sẵn sàng bàn giao",
  COMPLETED = "Đã hoàn thành",
  CANCELLED = "Đã hủy",
}

// Định nghĩa interface cho chi tiết yêu cầu
interface BloodRequestDetail {
  _id: string;
  groupId: { _id: string; name: string };
  userId: { _id: string; email: string; fullName: string; phone: string };
  facilityId: { _id: string; name: string; address: string };
  patientName: string;
  patientPhone: string;
  quantity: number;
  isUrgent: boolean;
  status: BLOOD_REQUEST_STATUS;
  location: { type: string; coordinates: [number, number] };
  address: string;
  reason: string;
  medicalDocumentUrl: string[];
  note: string;
  preferredDate: string;
  scheduledDeliveryDate: string;
  createdAt: string;
  updatedAt: string;
  isFulfilled: boolean;
  componentId: { _id: string; name: string };
  approvedBy: string | null;
}

export default function BloodRequestDetail() {
  const [request, setRequest] = useState<BloodRequestDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [notification, setNotification] = useState<string | null>(null);
  const { facilityId } = useManagerContext();

  // Lấy requestId từ href
  const getRequestIdFromHref = () => {
    const pathname = window.location.pathname; // VD: /received/684086750e8a33e8a86295a9
    const segments = pathname.split("/").filter(Boolean); // Tách thành ["received", "684086750e8a33e8a86295a9"]
    return segments[segments.length - 1] || ""; // Lấy đoạn cuối
  };

  const requestId = getRequestIdFromHref();

  // Hàm hiển thị thông báo
  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  // Hàm sao chép văn bản
  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    showNotification("Đã sao chép!");
  };

  // Ánh xạ trạng thái API
  const mapApiStatusToEnum = (apiStatus: string): BLOOD_REQUEST_STATUS => {
    if (typeof apiStatus !== "string") {
      console.warn(`Invalid apiStatus: ${apiStatus}. Defaulting to PENDING_APPROVAL.`);
      return BLOOD_REQUEST_STATUS.PENDING_APPROVAL;
    }
    switch (apiStatus.toLowerCase()) {
      case "pending_approval": return BLOOD_REQUEST_STATUS.PENDING_APPROVAL;
      case "rejected_registration": return BLOOD_REQUEST_STATUS.REJECTED_REGISTRATION;
      case "approved": return BLOOD_REQUEST_STATUS.APPROVED;
      case "assigned": return BLOOD_REQUEST_STATUS.ASSIGNED;
      case "ready_for_delivery": return BLOOD_REQUEST_STATUS.READY_FOR_DELIVERY;
      case "completed": return BLOOD_REQUEST_STATUS.COMPLETED;
      case "cancelled": return BLOOD_REQUEST_STATUS.CANCELLED;
      default:
        console.warn(`Unknown apiStatus: ${apiStatus}. Defaulting to PENDING_APPROVAL.`);
        return BLOOD_REQUEST_STATUS.PENDING_APPROVAL;
    }
  };

  // Định dạng ngày giờ
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    } catch {
      return "N/A";
    }
  };

  // Lấy chi tiết yêu cầu từ API
  useEffect(() => {
    const fetchRequestDetail = async () => {
      console.log("Request ID:", requestId); // Debug requestId
      console.log("Facility ID:", facilityId); // Debug facilityId
      if (!requestId) {
        setError("Thiếu ID yêu cầu");
        setLoading(false);
        return;
      }
      if (!facilityId) {
        setError("Thiếu ID cơ sở y tế");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setProgress(30);
        const response = await getBloodRequestId( facilityId, requestId);
        setProgress(60);
        console.log("Fetch Request Detail Response:", response);
        const data = response.data || response;
        if (!data || !data._id) {
          throw new Error("Không tìm thấy dữ liệu yêu cầu");
        }
        setRequest({
          _id: data._id || "N/A",
          groupId: data.groupId || { _id: "N/A", name: "N/A" },
          userId: data.userId || { _id: "N/A", email: "N/A", fullName: "N/A", phone: "N/A" },
          facilityId: data.facilityId || { _id: "N/A", name: "N/A", address: "N/A" },
          patientName: data.patientName || "N/A",
          patientPhone: data.patientPhone || "N/A",
          quantity: data.quantity || 0,
          isUrgent: data.isUrgent || false,
          status: mapApiStatusToEnum(data.status || "pending_approval"),
          location: data.location || { type: "Point", coordinates: [0, 0] },
          address: data.address || "N/A",
          reason: data.reason || "Không có",
          medicalDocumentUrl: data.medicalDocumentUrl || [],
          note: data.note || "Không có",
          preferredDate: formatDate(data.preferredDate),
          scheduledDeliveryDate: formatDate(data.scheduledDeliveryDate),
          createdAt: formatDate(data.createdAt),
          updatedAt: formatDate(data.updatedAt),
          isFulfilled: data.isFulfilled || false,
          componentId: data.componentId || { _id: "N/A", name: "N/A" },
          approvedBy: data.approvedBy || null,
        });
        setProgress(100);
      } catch (err: any) {
        setError(err.message || "Không thể tải chi tiết yêu cầu");
        console.error("API Error:", err);
      } finally {
        setLoading(false);
        setProgress(100);
      }
    };

    fetchRequestDetail();
  }, [requestId, facilityId]);

  // Màu sắc cho mức độ khẩn
  const getUrgencyColor = (urgency: boolean) => {
    return urgency ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800";
  };

  // Màu sắc cho trạng thái
  const getStatusColor = (status: BLOOD_REQUEST_STATUS) => {
    switch (status) {
      case BLOOD_REQUEST_STATUS.PENDING_APPROVAL: return "bg-yellow-100 text-yellow-800";
      case BLOOD_REQUEST_STATUS.APPROVED: return "bg-green-100 text-green-800";
      case BLOOD_REQUEST_STATUS.ASSIGNED: return "bg-blue-100 text-blue-800";
      case BLOOD_REQUEST_STATUS.READY_FOR_DELIVERY: return "bg-teal-100 text-teal-800";
      case BLOOD_REQUEST_STATUS.COMPLETED: return "bg-indigo-100 text-indigo-800";
      case BLOOD_REQUEST_STATUS.REJECTED_REGISTRATION: return "bg-red-100 text-red-800";
      case BLOOD_REQUEST_STATUS.CANCELLED: return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Quay lại danh sách
  const handleBack = () => {
    window.location.href = "/manager/received";
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Progress value={progress} className="w-64 mb-4" />
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Đang tải chi tiết...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-6 bg-red-50 rounded-lg border">
        <p className="text-lg font-semibold">Lỗi: {error}</p>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="text-center text-gray-600 p-6">
        <p className="text-lg font-semibold">Không tìm thấy yêu cầu</p>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
        {/* Notification */}
        {notification && (
          <div className="fixed top-4 right-4 bg-blue-600 text-white p-4 rounded-lg shadow-lg animate-in fade-in duration-300">
            {notification}
          </div>
        )}

        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Chi Tiết Yêu Cầu Máu</h1>
            <p className="text-gray-600 mt-2">Thông tin chi tiết về yêu cầu máu</p>
          </div>
          <Button variant="outline" onClick={handleBack} className="flex items-center space-x-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại</span>
          </Button>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Thông Tin Yêu Cầu</CardTitle>
            <CardDescription>Mã yêu cầu: {request._id}</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Mã Yêu Cầu</TableCell>
                  <TableCell className="flex items-center space-x-2">
                    <span>{request._id}</span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" onClick={() => copyText(request._id)}>
                          <Copy className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Sao chép</TooltipContent>
                    </Tooltip>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Nhóm Máu</TableCell>
                  <TableCell>{request.groupId.name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Người Yêu Cầu</TableCell>
                  <TableCell>
                    {request.userId.fullName} ({request.userId.email}, {request.userId.phone})
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Bệnh Viện</TableCell>
                  <TableCell>
                    {request.facilityId.name} - {request.facilityId.address}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Tên Bệnh Nhân</TableCell>
                  <TableCell>{request.userId.fullName}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Số Điện Thoại Bệnh Nhân</TableCell>
                  <TableCell>{request.userId.phone}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Email</TableCell>
                  <TableCell>{request.userId.email}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Số Lượng (ml)</TableCell>
                  <TableCell>{request.quantity}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Mức Độ Khẩn Cấp</TableCell>
                  <TableCell>
                    <Badge className={getUrgencyColor(request.isUrgent)}>
                      {request.isUrgent ? "Khẩn cấp" : "Thường"}
                    </Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Trạng Thái</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(request.status)}>{request.status}</Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Vị Trí</TableCell>
                  <TableCell>
                    {request.location.type}: [{request.location.coordinates.join(", ")}]
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Địa Chỉ</TableCell>
                  <TableCell>{request.address}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Lý Do</TableCell>
                  <TableCell>{request.reason}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Tài Liệu Y Tế</TableCell>
                  <TableCell>
                    {request.medicalDocumentUrl.length > 0 ? (
                      <ul className="space-y-2">
                        {request.medicalDocumentUrl.map((url, index) => (
                          <li key={index}>
                            <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                              Tài liệu {index + 1}
                            </a>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      "Không có"
                    )}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Ghi Chú</TableCell>
                  <TableCell>{request.note || "Không có"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Ngày Ưu Tiên</TableCell>
                  <TableCell>{request.preferredDate}</TableCell>
                </TableRow>
                {/* <TableRow>
                  <TableCell className="font-medium">Ngày Giao Hàng Dự Kiến</TableCell>
                  <TableCell>{request.scheduledDeliveryDate}</TableCell>
                </TableRow> */}
                <TableRow>
                  <TableCell className="font-medium">Ngày Tạo</TableCell>
                  <TableCell>{request.createdAt}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Ngày Cập Nhật</TableCell>
                  <TableCell>{request.updatedAt}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Trạng Thái Hoàn Thành</TableCell>
                  <TableCell>{request.isFulfilled ? "Đã hoàn thành" : "Chưa hoàn thành"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Thành Phần Máu</TableCell>
                  <TableCell>{request.componentId.name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Người Phê Duyệt</TableCell>
                  <TableCell>{request.approvedBy || "Chưa có"}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}
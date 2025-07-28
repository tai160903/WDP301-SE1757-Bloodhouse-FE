import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useManagerContext } from "@/components/ManagerLayout";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Eye, CheckCircle, XCircle, Copy, Search } from "lucide-react";
import {
  getBloodRequests,
  updateStatus,
} from "../../services/bloodRequest/index";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

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

// Định nghĩa interface
interface TableRequest {
  id: number;
  requestId: string;
  fromHospital: string;
  bloodType: string;
  unitsRequested: number;
  urgencyLevel: "Khẩn cấp" | "Thường";
  receivedDate: string;
  status: BLOOD_REQUEST_STATUS;
  contactPerson: string;
  contactPhone: string;
  reason: string;
  notes: string;
  groupId?: { name: string } | null;
  address?: string;
  component?: string;
  preferredDate?: string;
  medicalDocs?: string[];
}

// Định nghĩa interface cho API
interface UpdatePayload {
  status: string;
  staffId?: string;
  needsSupport?: boolean;
}
interface UpdateStatus {
  _id: string;
  status: string;
  approvedBy?: string;
  needsSupport?: boolean;
  updatedAt: string;
}

export default function BloodRequests() {
  const [requests, setRequests] = useState<TableRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<TableRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<TableRequest | null>(
    null
  );
  const [isResponseDialogOpen, setIsResponseDialogOpen] = useState(false);
  const [responseType, setResponseType] = useState<"accept" | "reject">(
    "accept"
  );
  const [responseNotes, setResponseNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [progress, setProgress] = useState(0);
  const [notification, setNotification] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { facilityId, facilityName } = useManagerContext();
  const pageSize = 10;
  const navigate = useNavigate();
  // Lấy staffId từ localStorage (giả định)
  const getStaffId = (): string | undefined => {
    return localStorage.getItem("usserId") || undefined; // Thay bằng cách lấy staffId thực tế
  };

  // Hiển thị thông báo
  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  // Ánh xạ trạng thái API
  const mapApiStatusToEnum = (apiStatus: any): BLOOD_REQUEST_STATUS => {
    if (!apiStatus || typeof apiStatus !== "string") {
      console.warn(
        `Invalid apiStatus: ${apiStatus}. Defaulting to PENDING_APPROVAL.`
      );
      return BLOOD_REQUEST_STATUS.PENDING_APPROVAL;
    }
    switch (apiStatus.toLowerCase()) {
      case "pending_approval":
        return BLOOD_REQUEST_STATUS.PENDING_APPROVAL;
      case "rejected_registration":
        return BLOOD_REQUEST_STATUS.REJECTED_REGISTRATION;
      case "approved":
        return BLOOD_REQUEST_STATUS.APPROVED;
      case "assigned":
        return BLOOD_REQUEST_STATUS.ASSIGNED;
      case "ready_for_delivery":
        return BLOOD_REQUEST_STATUS.READY_FOR_DELIVERY;
      case "completed":
        return BLOOD_REQUEST_STATUS.COMPLETED;
      case "cancelled":
        return BLOOD_REQUEST_STATUS.CANCELLED;
      default:
        console.warn(
          `Unknown apiStatus: ${apiStatus}. Defaulting to PENDING_APPROVAL.`
        );
        return BLOOD_REQUEST_STATUS.PENDING_APPROVAL;
    }
  };

  // Ánh xạ dữ liệu API cho danh sách
  const mapApiDataToTableRequest = (
    req: any,
    index: number,
    page: number
  ): TableRequest => ({
    id: (page - 1) * pageSize + index + 1,
    requestId: req._id || "N/A",
    fromHospital: req.facilityId?.name || "N/A",
    bloodType: req.groupId?.name || "N/A",
    groupId: req.groupId || null,
    unitsRequested: req.quantity || 0,
    urgencyLevel: req.isUrgent ? "Khẩn cấp" : "Thường",
    receivedDate: req.createdAt
      ? new Date(req.createdAt).toLocaleDateString("vi-VN")
      : "N/A",
    status: mapApiStatusToEnum(req.status),
    contactPerson: req.patientName || "N/A",
    contactPhone: req.patientPhone || "N/A",
    reason: req.reason || "Không có",
    notes: req.note || "",
    address: req.address || "N/A",
    component: req.componentId?.name || "N/A",
    preferredDate: req.preferredDate
      ? new Date(req.preferredDate).toLocaleDateString("vi-VN")
      : "N/A",
    medicalDocs:
      req.medicalDocumentUrl && Array.isArray(req.medicalDocumentUrl)
        ? req.medicalDocumentUrl
        : [],
  });

  // Lấy danh sách yêu cầu
  const fetchRequests = useCallback(
    async (page: number) => {
      if (!facilityId) {
        setError("Thiếu ID cơ sở y tế");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setProgress(30);
        const response = await getBloodRequests(
          facilityId,
          page,
          pageSize,
          "createdAt",
          "-1"
        );
        setProgress(60);
        console.log("Fetch Requests Response:", response);
        const requestsArray = Array.isArray(response)
          ? response
          : Array.isArray(response.data)
          ? response.data
          : [];
        const totalCount = response?.totalCount || requestsArray.length;
        setTotalPages(Math.ceil(totalCount / pageSize));
        const mappedRequests = requestsArray.map((req: any, index: number) =>
          mapApiDataToTableRequest(req, index, page)
        );
        setRequests(mappedRequests);
        setFilteredRequests(mappedRequests);
        setProgress(100);
      } catch (err: any) {
        setError(err.message || "Không thể tải danh sách yêu cầu");
      } finally {
        setLoading(false);
        setProgress(100);
      }
    },
    [facilityId, facilityName]
  );

  // Xử lý tìm kiếm
  const handleSearch = useCallback(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) {
      setFilteredRequests(requests);
      return;
    }
    const filtered = requests.filter(
      (request) =>
        request.requestId.toLowerCase().includes(query) ||
        request.fromHospital.toLowerCase().includes(query) ||
        request.bloodType.toLowerCase().includes(query) ||
        request.status.toLowerCase().includes(query)
    );
    setFilteredRequests(filtered);
  }, [searchQuery, requests]);

  useEffect(() => {
    fetchRequests(currentPage);
  }, [currentPage, fetchRequests]);

  useEffect(() => {
    handleSearch();
  }, [searchQuery, handleSearch]);

  // Màu sắc cho mức độ khẩn
  const getUrgencyColor = (urgency: string) => {
    return urgency === "Khẩn cấp"
      ? "bg-red-100 text-red-800"
      : "bg-blue-100 text-blue-800";
  };

  // Màu sắc cho trạng thái
  const getStatusColor = (status: BLOOD_REQUEST_STATUS) => {
    switch (status) {
      case BLOOD_REQUEST_STATUS.PENDING_APPROVAL:
        return "bg-yellow-100 text-yellow-800";
      case BLOOD_REQUEST_STATUS.APPROVED:
        return "bg-green-100 text-green-800";
      case BLOOD_REQUEST_STATUS.ASSIGNED:
        return "bg-blue-100 text-blue-800";
      case BLOOD_REQUEST_STATUS.READY_FOR_DELIVERY:
        return "bg-teal-100 text-teal-800";
      case BLOOD_REQUEST_STATUS.COMPLETED:
        return "bg-indigo-100 text-indigo-800";
      case BLOOD_REQUEST_STATUS.REJECTED_REGISTRATION:
        return "bg-red-100 text-red-800";
      case BLOOD_REQUEST_STATUS.CANCELLED:
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Xử lý xem chi tiết
  const handleViewRequest = useCallback((request: TableRequest) => {
    // window.location.href = `/manager/received/${request.requestId}`;
    navigate(`/manager/received/${request.requestId}`);
  }, []);

  // Xử lý phản hồi
  const handleResponse = useCallback(
    (request: TableRequest, type: "accept" | "reject") => {
      setSelectedRequest(request);
      setResponseType(type);
      setResponseNotes("");
      setIsResponseDialogOpen(true);
    },
    []
  );

  // Xử lý gửi phản hồi
  const handleSubmitResponse = useCallback(async () => {
    if (!selectedRequest || !facilityId) {
      showNotification("Thiếu thông tin yêu cầu hoặc cơ sở y tế");
      return;
    }
    if (responseType === "reject" && !responseNotes.trim()) {
      showNotification("Vui lòng nhập lý do từ chối");
      return;
    }
    try {
      const staffId = getStaffId();
      const payload: UpdatePayload = {
        status:
          responseType === "accept" ? "approved" : "rejected_registration",
        staffId: staffId,
        needsSupport: responseType === "accept" ? true : undefined,
      };
      console.log("Sending payload:", payload);
      const updatedRequest = await updateStatus(
        selectedRequest.requestId,
        facilityId,
        payload
      );
      console.log("API Response:", updatedRequest);
      setRequests((prev) =>
        prev.map((req) =>
          req.requestId === selectedRequest.requestId
            ? {
                ...req,
                status: mapApiStatusToEnum(updatedRequest.status),
                notes: responseType === "reject" ? responseNotes : req.notes,
              }
            : req
        )
      );
      setFilteredRequests((prev) =>
        prev.map((req) =>
          req.requestId === selectedRequest.requestId
            ? {
                ...req,
                status: mapApiStatusToEnum(updatedRequest.status),
                notes: responseType === "reject" ? responseNotes : req.notes,
              }
            : req
        )
      );
      showNotification(
        responseType === "accept"
          ? "Phê duyệt thành công!"
          : "Từ chối thành công!"
      );
      setIsResponseDialogOpen(false);
      fetchRequests(currentPage);
    } catch (err: any) {
      console.error("API Error:", err);
      showNotification(
        "Không thể gửi phản hồi: " +
          (err.response?.data?.message || err.message || "Lỗi server")
      );
    }
  }, [
    responseType,
    responseNotes,
    selectedRequest,
    facilityId,
    currentPage,
    fetchRequests,
  ]);

  const copyRequestId = (id: string) => {
    navigator.clipboard.writeText(id);
    showNotification("Đã sao chép mã yêu cầu!");
  };

  // Dữ liệu tóm tắt
  const summaryData = {
    totalRequests: filteredRequests.length,
    pendingReview: filteredRequests.filter(
      (r) => r.status === BLOOD_REQUEST_STATUS.PENDING_APPROVAL
    ).length,
    emergencyRequests: filteredRequests.filter(
      (r) => r.urgencyLevel === "Khẩn cấp"
    ).length,
    fulfilledRequests: filteredRequests.filter(
      (r) => r.status === BLOOD_REQUEST_STATUS.COMPLETED
    ).length,
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Progress value={progress} className="w-64 mb-4" />
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Đang tải danh sách...</p>
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

  return (
    <TooltipProvider>
      <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
        {/* Notification */}
        {notification && (
          <div className="fixed top-4 right-4 bg-blue-600 text-white p-4 rounded-lg shadow-lg animate-in fade-in duration-300">
            {notification}
          </div>
        )}

        <div>
          <h1 className="text-3xl font-bold text-gray-900">Yêu Cầu Máu</h1>
          <p className="text-gray-600 mt-2">
            Các yêu cầu hiến máu từ các cơ sở y tế
          </p>
        </div>

        {/* Tóm tắt thống kê */}
        <div className="grid gap-4 md:grid-cols-4">
          {[
            {
              title: "Tổng Yêu Cầu",
              value: summaryData.totalRequests,
              color: "blue",
            },
            {
              title: "Chờ Xem Xét",
              value: summaryData.pendingReview,
              color: "yellow",
            },
            {
              title: "Khẩn Cấp",
              value: summaryData.emergencyRequests,
              color: "red",
            },
            {
              title: "Đã Hoàn Thành",
              value: summaryData.fulfilledRequests,
              color: "green",
            },
          ].map((item) => (
            <Card
              key={item.title}
              className={`border-l-4 border-${item.color}-500 hover:shadow-lg transition-shadow`}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold text-${item.color}-600`}>
                  {item.value}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bảng danh sách */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Danh Sách Yêu Cầu
            </CardTitle>
            <CardDescription>
              Các yêu cầu hiến máu đang chờ xử lý
            </CardDescription>
            {/* Thanh tìm kiếm */}
            <div className="flex items-center space-x-2 mt-4">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Tìm kiếm theo nhóm máu"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Người cần máu</TableHead>
                  <TableHead>Bệnh Viện</TableHead>
                  <TableHead>Nhóm Máu</TableHead>
                  <TableHead>Số Lượng</TableHead>
                  <TableHead>Khẩn Cấp</TableHead>
                  <TableHead>Trạng Thái</TableHead>
                  <TableHead>Ngày Nhận</TableHead>
                  <TableHead className="text-right">Hành Động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.length > 0 ? (
                  filteredRequests.map((request) => (
                    <TableRow
                      key={request.requestId}
                      className="hover:bg-gray-50"
                    >
                      <TableCell className="font-medium truncate max-w-xs">
                        <div className="flex items-center space-x-2">
                          <span>{request.contactPerson}</span>
                        </div>
                      </TableCell>
                      <TableCell>{request.fromHospital}</TableCell>
                      <TableCell>
                        {request.groupId?.name || request.bloodType}
                      </TableCell>
                      <TableCell>{request.unitsRequested}</TableCell>
                      <TableCell>
                        <Badge
                          className={getUrgencyColor(request.urgencyLevel)}
                        >
                          {request.urgencyLevel}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(request.status)}>
                          {request.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{request.receivedDate}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewRequest(request)}
                                className="hover:bg-blue-50"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Xem chi tiết</TooltipContent>
                          </Tooltip>
                          {request.status ===
                            BLOOD_REQUEST_STATUS.PENDING_APPROVAL && (
                            <>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-green-600 hover:bg-green-50"
                                    onClick={() =>
                                      handleResponse(request, "accept")
                                    }
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Phê duyệt</TooltipContent>
                              </Tooltip>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-red-600 hover:bg-red-50"
                                    onClick={() =>
                                      handleResponse(request, "reject")
                                    }
                                  >
                                    <XCircle className="w-4 h-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Từ chối</TooltipContent>
                              </Tooltip>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12">
                      <div className="flex flex-col items-center space-y-3">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                          <Eye className="w-8 h-8 text-blue-500" />
                        </div>
                        <div className="text-center">
                          <h3 className="text-lg font-medium text-gray-900 mb-1">
                            Không có yêu cầu máu nào
                          </h3>
                          <p className="text-sm text-gray-500">
                            {searchQuery
                              ? `Không tìm thấy yêu cầu nào phù hợp với "${searchQuery}"`
                              : "Hiện tại chưa có yêu cầu máu nào từ các cơ sở y tế"}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <div className="flex justify-between items-center mt-6">
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
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

        {/* Dialog phản hồi */}
        <Dialog
          open={isResponseDialogOpen}
          onOpenChange={setIsResponseDialogOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {responseType === "accept"
                  ? "Phê duyệt yêu cầu"
                  : "Từ chối yêu cầu"}
              </DialogTitle>
              <DialogDescription>
                {responseType === "accept"
                  ? "Xác nhận phê duyệt yêu cầu máu này."
                  : "Vui lòng nhập lý do từ chối yêu cầu máu này."}
              </DialogDescription>
            </DialogHeader>
            {responseType === "reject" && (
              <div className="mt-4">
                <Label
                  htmlFor="responseNotes"
                  className="text-sm font-medium text-gray-600"
                >
                  Lý do từ chối
                </Label>
                <Textarea
                  id="responseNotes"
                  value={responseNotes}
                  onChange={(e) => setResponseNotes(e.target.value)}
                  className="mt-2 w-full"
                  rows={4}
                  placeholder="Nhập lý do từ chối..."
                />
              </div>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsResponseDialogOpen(false)}
              >
                Hủy
              </Button>
              <Button
                onClick={handleSubmitResponse}
                className={
                  responseType === "accept"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }
              >
                {responseType === "accept" ? "Phê duyệt" : "Từ chối"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}

"use client";

import { useEffect, useState } from "react";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CheckCircle2,
  AlertCircle,
  CheckCircle,
  XCircle,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getBloodDonationRegis,
  updateBloodDonationRegis,
} from "@/services/bloodDonationRegis";
import { useNavigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";

const BLOOD_DONATION_REGISTRATION_STATUS = {
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

const getStatusLabel = (status: string) => {
  switch (status) {
    case BLOOD_DONATION_REGISTRATION_STATUS.PENDING_APPROVAL:
      return "Chờ duyệt";
    case BLOOD_DONATION_REGISTRATION_STATUS.REJECTED_REGISTRATION:
      return "Đã từ chối đăng ký";
    case BLOOD_DONATION_REGISTRATION_STATUS.REGISTERED:
      return "Đã đăng ký";
    case BLOOD_DONATION_REGISTRATION_STATUS.CHECKED_IN:
      return "Đã điểm danh";
    case BLOOD_DONATION_REGISTRATION_STATUS.IN_CONSULT:
      return "Đang khám";
    case BLOOD_DONATION_REGISTRATION_STATUS.REJECTED:
      return "Không đủ điều kiện";
    case BLOOD_DONATION_REGISTRATION_STATUS.WAITING_DONATION:
      return "Chờ hiến";
    case BLOOD_DONATION_REGISTRATION_STATUS.DONATING:
      return "Đang hiến";
    case BLOOD_DONATION_REGISTRATION_STATUS.DONATED:
      return "Đã hiến";
    case BLOOD_DONATION_REGISTRATION_STATUS.RESTING:
      return "Đang nghỉ";
    case BLOOD_DONATION_REGISTRATION_STATUS.POST_REST_CHECK:
      return "Kiểm tra sau nghỉ";
    case BLOOD_DONATION_REGISTRATION_STATUS.COMPLETED:
      return "Hoàn tất";
    case BLOOD_DONATION_REGISTRATION_STATUS.CANCELLED:
      return "Đã hủy";
    default:
      return "Không xác định";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case BLOOD_DONATION_REGISTRATION_STATUS.PENDING_APPROVAL:
      return "bg-yellow-100 text-yellow-800";
    case BLOOD_DONATION_REGISTRATION_STATUS.REGISTERED:
    case BLOOD_DONATION_REGISTRATION_STATUS.CHECKED_IN:
    case BLOOD_DONATION_REGISTRATION_STATUS.DONATING:
    case BLOOD_DONATION_REGISTRATION_STATUS.DONATED:
    case BLOOD_DONATION_REGISTRATION_STATUS.RESTING:
    case BLOOD_DONATION_REGISTRATION_STATUS.POST_REST_CHECK:
      return "bg-blue-100 text-blue-800";
    case BLOOD_DONATION_REGISTRATION_STATUS.COMPLETED:
      return "bg-green-100 text-green-800";
    case BLOOD_DONATION_REGISTRATION_STATUS.REJECTED_REGISTRATION:
    case BLOOD_DONATION_REGISTRATION_STATUS.REJECTED:
      return "bg-red-100 text-red-800";
    case BLOOD_DONATION_REGISTRATION_STATUS.CANCELLED:
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function Requests() {
  const [formStatus, setFormStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [donationRequests, setDonationRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingIds, setUpdatingIds] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [currentRequestId, setCurrentRequestId] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const staffId = user?._id;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const fetchDonationRequests = async () => {
    setLoading(true);
    try {
      const data = await getBloodDonationRegis({
        page: currentPage,
        limit: limit,
      });
      
      const {data: items, metadata} = data;

      const urgencyPriority: Record<string, number> = {
        Emergency: 1,
        Urgent: 2,
        Routine: 3,
      };

      // const mapped = data.data.sort((a, b) => {
      //   const isAWaiting =
      //     a.status === BLOOD_DONATION_REGISTRATION_STATUS.PENDING_APPROVAL
      //       ? 0
      //       : 1;
      //   const isBWaiting =
      //     b.status === BLOOD_DONATION_REGISTRATION_STATUS.PENDING_APPROVAL
      //       ? 0
      //       : 1;
      //   if (isAWaiting !== isBWaiting) return isAWaiting - isBWaiting;

      //   const priorityA = urgencyPriority[a.urgency] ?? 99;
      //   const priorityB = urgencyPriority[b.urgency] ?? 99;
      //   return priorityA - priorityB;
      // });

      const mapped = items.sort((a, b) => {
      const isAWaiting =
        a.status === BLOOD_DONATION_REGISTRATION_STATUS.PENDING_APPROVAL ? 0 : 1;
      const isBWaiting =
        b.status === BLOOD_DONATION_REGISTRATION_STATUS.PENDING_APPROVAL ? 0 : 1;
      if (isAWaiting !== isBWaiting) return isAWaiting - isBWaiting;

      const priorityA = urgencyPriority[a.urgency] ?? 99;
      const priorityB = urgencyPriority[b.urgency] ?? 99;
      return priorityA - priorityB;
    });

      setDonationRequests(mapped);
      setTotalPages(metadata.totalPages);
    } catch {
      setFormStatus({
        type: "error",
        message: "Không thể tải danh sách yêu cầu",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonationRequests();
  }, [currentPage]);

  const handleUpdateStatus = async (
    requestId: string,
    newStatus: string,
    reason?: string
  ) => {
    try {
      setUpdatingIds((prev) => [...prev, requestId]);

      let payload: any = {
        status: newStatus,
        staffId,
        notes: "",
      };

      if (
        newStatus ===
          BLOOD_DONATION_REGISTRATION_STATUS.REJECTED_REGISTRATION &&
        reason
      ) {
        payload.reasonRejected = reason;
      }

      if (
        newStatus === BLOOD_DONATION_REGISTRATION_STATUS.REGISTERED &&
        !staffId
      ) {
        setFormStatus({
          type: "error",
          message: "Thiếu thông tin nhân viên (staffId)",
        });
        return;
      }

      await updateBloodDonationRegis(requestId, payload);
      setFormStatus({
        type: "success",
        message: `Cập nhật trạng thái thành công`,
      });
      await fetchDonationRequests();
    } catch {
      setFormStatus({ type: "error", message: "Cập nhật trạng thái thất bại" });
    } finally {
      setUpdatingIds((prev) => prev.filter((id) => id !== requestId));
      setIsModalOpen(false);
      setRejectionReason("");
      setCurrentRequestId(null);
    }
  };

  const handleOpenRejectModal = (requestId: string) => {
    setCurrentRequestId(requestId);
    setIsModalOpen(true);
  };

  const handleSubmitRejection = () => {
    if (!rejectionReason.trim()) {
      setFormStatus({ type: "error", message: "Phải nhập lý do từ chối" });
      return;
    }
    if (currentRequestId) {
      handleUpdateStatus(
        currentRequestId,
        BLOOD_DONATION_REGISTRATION_STATUS.REJECTED_REGISTRATION,
        rejectionReason
      );
    }
  };

  const handleDetailRequest = (request: any) => {
    navigate(`/manager/requests/${request._id}`);
  };

  if (loading) return <div className="text-center">Đang tải dữ liệu...</div>;

  return (
    <div className="space-y-6 p-6">
      {formStatus && (
        <Alert
          variant={formStatus.type === "success" ? "default" : "destructive"}
          className={cn(
            "border-2",
            formStatus.type === "success"
              ? "border-green-500 bg-green-50"
              : "border-red-500 bg-red-50"
          )}
        >
          {formStatus.type === "success" ? (
            <CheckCircle2 className="h-5 w-5 text-green-600" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-600" />
          )}
          <AlertTitle
            className={
              formStatus.type === "success" ? "text-green-600" : "text-red-600"
            }
          >
            {formStatus.type === "success" ? "Thành công" : "Lỗi"}
          </AlertTitle>
          <AlertDescription
            className={
              formStatus.type === "success" ? "text-green-600" : "text-red-600"
            }
          >
            {formStatus.message}
          </AlertDescription>
        </Alert>
      )}

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Yêu cầu hiến máu</h1>
        <p className="text-muted-foreground">
          Quản lý các yêu cầu hiến máu tại các bệnh viện
        </p>
      </div>

      {/* Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Tổng yêu cầu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{donationRequests.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Chờ xem xét</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {
                donationRequests.filter(
                  (r) =>
                    r.status ===
                    BLOOD_DONATION_REGISTRATION_STATUS.PENDING_APPROVAL
                ).length
              }
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Khẩn cấp</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {donationRequests.filter((r) => r.urgency === "Emergency").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Đã hoàn thành</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {
                donationRequests.filter(
                  (r) =>
                    r.status === BLOOD_DONATION_REGISTRATION_STATUS.COMPLETED
                ).length
              }
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rejection Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Lý do từ chối</DialogTitle>
            <DialogDescription>
              Vui lòng nhập lý do từ chối yêu cầu hiến máu.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="rejectionReason">Lý do</Label>
              <Input
                id="rejectionReason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Nhập lý do từ chối"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsModalOpen(false);
                setRejectionReason("");
                setCurrentRequestId(null);
              }}
            >
              Hủy
            </Button>
            <Button
              onClick={handleSubmitRejection}
              disabled={
                !rejectionReason.trim() ||
                updatingIds.includes(currentRequestId || "")
              }
            >
              Xác nhận
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Yêu cầu hiến máu</CardTitle>
          <CardDescription>Danh sách các yêu cầu đang xử lý</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Người yêu cầu</TableHead>
                <TableHead>Nhóm máu</TableHead>
                <TableHead>Đơn vị</TableHead>
                <TableHead>Bệnh viện</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {donationRequests.map((request) => (
                <TableRow
                  key={request._id}
                  onClick={() => handleDetailRequest(request)}
                  className="cursor-pointer"
                >
                  <TableCell>{request.userId?.fullName || "N/A"}</TableCell>
                  <TableCell>{request.bloodGroupId?.name || "N/A"}</TableCell>
                  <TableCell>
                    {request.expectedQuantity?.toLocaleString() || 0}
                  </TableCell>
                  <TableCell>{request.facilityId?.name || "N/A"}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(request.status)}>
                      {getStatusLabel(request.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDetailRequest(request);
                        }}
                        title="Chi tiết"
                      >
                        <FileText className="w-4 h-4" />
                      </Button>
                      {request.status ===
                        BLOOD_DONATION_REGISTRATION_STATUS.PENDING_APPROVAL && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-green-600"
                            disabled={updatingIds.includes(request._id)}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateStatus(
                                request._id,
                                BLOOD_DONATION_REGISTRATION_STATUS.REGISTERED
                              );
                            }}
                            title="Duyệt"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600"
                            disabled={updatingIds.includes(request._id)}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenRejectModal(request._id);
                            }}
                            title="Từ chối"
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
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
    </div>
  );
}

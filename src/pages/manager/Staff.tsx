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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Phone, Mail, Loader2, Eye, Calendar, MapPin, X } from "lucide-react";
import { useManagerContext } from "@/components/ManagerLayout";
import { getStaffById, getTotalStaff } from "@/services/facilityStaff";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Định nghĩa kiểu dữ liệu cho nhân viên
interface StaffMember {
  _id: string;
  userId: {
    _id: string;
    fullName: string;
    email: string;
    avatar: string;
    phone?: string;
    address?: string;
    yob?: string;
  };
  position: string;
  department?: string;
  isDeleted: boolean;
  assignedAt?: string;
}

export default function Staff() {
  const { facilityId } = useManagerContext();
  const [isLoading, setIsLoading] = useState(true);
  const [staffs, setStaffs] = useState<StaffMember[]>([]);
  const [totalStaff, setTotalStaff] = useState(0);
  const [totalDoctors, setTotalDoctors] = useState(0);
  const [totalNurses, setTotalNurses] = useState(0);
  const [totalTransporters, setTotalTransporters] = useState(0);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    const fetchStaffMembers = async () => {
      setIsLoading(true);
      try {
        const response: any = await getTotalStaff(facilityId || "");
        setStaffs(response.data.result || []);
        setTotalStaff(response.data.total || 0);

        // Đếm số lượng nhân viên theo vị trí
        setTotalDoctors(
          response.data.result.filter(
            (staff: any) => staff.position === "DOCTOR"
          ).length
        );
        setTotalNurses(
          response.data.result.filter(
            (staff: any) => staff.position === "NURSE"
          ).length
        );
        setTotalTransporters(
          response.data.result.filter(
            (staff: any) => staff.position === "TRANSPORTER"
          ).length
        );
      } catch (error) {
        console.error("Lỗi khi tải danh sách nhân viên:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (facilityId) {
      fetchStaffMembers();
    }
  }, [facilityId]);

  // Hàm để lấy màu sắc tương ứng với vị trí
  const getRoleColor = (position: string) => {
    switch (position) {
      case "DOCTOR":
        return "bg-blue-100 text-blue-800";
      case "NURSE":
        return "bg-green-100 text-green-800";
      case "TRANSPORTER":
        return "bg-purple-100 text-purple-800";
      case "MANAGER":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPositionName = (position: string) => {
    switch (position) {
      case "DOCTOR":
        return "Bác sĩ";
      case "NURSE":
        return "Y tá";
      case "TRANSPORTER":
        return "Vận chuyển";
      case "MANAGER":
        return "Quản lý";
      default:
        return position;
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleViewDetail = async (_id: string) => {
    const response = await getStaffById(_id);
    console.log(response.data.assignedAt);
    setSelectedStaff(response.data);
    setIsDetailOpen(true);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Danh sách nhân viên</h1>
        <p className="text-muted-foreground">
          Thông tin về nhân viên tại cơ sở
        </p>
      </div>

      {/* Thẻ tổng quan */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng Nhân Viên
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStaff}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Bác Sĩ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {totalDoctors}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Y Tá</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {totalNurses}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Vận Chuyển</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {totalTransporters}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bảng nhân viên */}
      <Card>
        <CardHeader>
          <CardTitle>Danh Sách Nhân Viên</CardTitle>
          <CardDescription>Thông tin về nhân viên tại cơ sở</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : staffs.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Không có nhân viên nào</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nhân Viên</TableHead>
                  <TableHead>Vị Trí</TableHead>
                  <TableHead>Liên Hệ</TableHead>
                  <TableHead className="text-right">Thao Tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staffs.map((staff) => (
                  <TableRow key={staff._id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={staff.userId?.avatar || "/placeholder.svg"}
                            alt={staff.userId?.fullName}
                          />
                          <AvatarFallback>
                            {getInitials(staff.userId?.fullName)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">
                            {staff.userId?.fullName}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getRoleColor(staff.position)}>
                        {getPositionName(staff.position)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Mail className="w-3 h-3 mr-1" />
                          {staff.userId?.email}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Phone className="w-3 h-3 mr-1" />
                          {staff.userId?.phone || "N/A"}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetail(staff._id)}
                        className="text-blue-600 border-blue-200 hover:bg-blue-50"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Xem Chi Tiết
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Modal Chi tiết nhân viên */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">
              Thông Tin Chi Tiết Nhân Viên
            </DialogTitle>
            <DialogDescription className="text-center">
              Xem thông tin chi tiết của nhân viên
            </DialogDescription>
          </DialogHeader>

          {selectedStaff && (
            <div className="space-y-6">
              <div className="flex flex-col items-center space-y-3">
                <Avatar className="h-20 w-20">
                  <AvatarImage
                    src={selectedStaff.userId?.avatar || "/placeholder.svg"}
                    alt={selectedStaff.userId?.fullName}
                  />
                  <AvatarFallback className="text-2xl">
                    {getInitials(selectedStaff.userId?.fullName)}
                  </AvatarFallback>
                </Avatar>

                <div className="text-center">
                  <h2 className="text-xl font-semibold">
                    {selectedStaff.userId?.fullName}
                  </h2>
                  <Badge
                    className={`mt-1 ${getRoleColor(selectedStaff.position)}`}
                  >
                    {getPositionName(selectedStaff.position)}
                  </Badge>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center border-b pb-2">
                  <Mail className="w-5 h-5 text-gray-500 mr-2" />
                  <span className="font-medium mr-2">Email:</span>
                  <span>{selectedStaff.userId?.email}</span>
                </div>

                <div className="flex items-center border-b pb-2">
                  <Phone className="w-5 h-5 text-gray-500 mr-2" />
                  <span className="font-medium mr-2">Điện thoại:</span>
                  <span>{selectedStaff.userId?.phone || "Chưa cập nhật"}</span>
                </div>

                <div className="flex items-center border-b pb-2">
                  <Calendar className="w-5 h-5 text-gray-500 mr-2" />
                  <span className="font-medium mr-2">Ngày sinh:</span>
                  <span>
                    {selectedStaff.userId?.yob
                      ? formatDate(selectedStaff.userId?.yob)
                      : "Chưa cập nhật"}
                  </span>
                </div>

                <div className="flex items-center border-b pb-2">
                  <MapPin className="w-5 h-5 text-gray-500 mr-2" />
                  <span className="font-medium mr-2">Địa chỉ:</span>
                  <span>
                    {selectedStaff.userId?.address || "Chưa cập nhật"}
                  </span>
                </div>

                <div className="flex items-center border-b pb-2">
                  <Calendar className="w-5 h-5 text-gray-500 mr-2" />
                  <span className="font-medium mr-2">Ngày vào làm:</span>
                  <span>
                    {selectedStaff?.assignedAt
                      ? formatDate(selectedStaff?.assignedAt)
                      : "Chưa cập nhật"}
                  </span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setIsDetailOpen(false)} className="w-full">
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

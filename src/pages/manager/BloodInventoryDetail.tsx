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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Calendar,
  MapPin,
  Droplets,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { getBloodInventoryDetail } from "@/services/bloodinventory";
import { set } from "date-fns";

export default function BloodInventoryDetail() {
  const [inventoryDetail, setInventoryDetail] = useState<any>([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [editFormData, setEditFormData] = useState({
    totalQuantity: "",
  });

  const navigate = useNavigate();

  const slug = useParams<{ id: any }>();

  useEffect(() => {
    const fetchInventoryDetail = async () => {
      setLoading(true);
      try {
        const response = await getBloodInventoryDetail(slug.id);
        setInventoryDetail(response);
        console.log(response);
      } catch (error) {
        console.error("Error fetching inventory detail:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInventoryDetail();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  //   const getStatusFromStats = (unitStats: BloodInventoryDetail["unitStats"]) => {
  //     const available = unitStats.find((stat) => stat._id === "available");
  //     const expired = unitStats.find((stat) => stat._id === "expired");

  //     if (expired && expired.count > 0) return "Critical";
  //     if (available && available.totalQuantity < 500) return "Low Stock";
  //     return "Good";
  //   };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Good":
        return "bg-green-100 text-green-800";
      case "Low Stock":
        return "bg-yellow-100 text-yellow-800";
      case "Expiring Soon":
        return "bg-orange-100 text-orange-800";
      case "Critical":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Good":
        return <CheckCircle className="w-4 h-4" />;
      case "Low Stock":
        return <AlertTriangle className="w-4 h-4" />;
      case "Expiring Soon":
        return <Clock className="w-4 h-4" />;
      case "Critical":
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const handleUpdateQuantity = async () => {
    try {
      // API call to update quantity
      console.log("Updating quantity:", editFormData.totalQuantity);
      setIsEditDialogOpen(false);
      // Refresh data
    } catch (error) {
      console.error("Failed to update quantity", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  if (!inventoryDetail) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto" />
          <p className="mt-4 text-lg font-semibold">
            Không tìm thấy thông tin kho máu
          </p>
        </div>
      </div>
    );
  }

  //   const currentStatus = getStatusFromStats(inventoryDetail.unitStats);
  //   const availableStats = inventoryDetail.unitStats.find(
  //     (stat) => stat._id === "available"
  //   );
  //   const reservedStats = inventoryDetail.unitStats.find(
  //     (stat) => stat._id === "reserved"
  //   );
  //   const expiredStats = inventoryDetail.unitStats.find(
  //     (stat) => stat._id === "expired"
  //   );

  //   // Calculate total expiring quantity
  //   const totalExpiringQuantity = inventoryDetail.expiringUnits.reduce(
  //     (sum, unit) => sum + unit.quantity,
  //     0
  //   );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col space-y-4">
          <div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/manager/inventory")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại
            </Button>
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Chi tiết đơn vị máu
            </h1>
            <p className="text-muted-foreground">
              Thông tin chi tiết về đơn vị máu
            </p>
          </div>
        </div>
        {/* <div className="flex space-x-2">
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Edit className="w-4 h-4 mr-2" />
                Chỉnh sửa
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Cập nhật số lượng</DialogTitle>
                <DialogDescription>
                  Điều chỉnh tổng số lượng đơn vị máu trong kho
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="totalQuantity" className="text-right">
                    Tổng số lượng
                  </Label>
                  <Input
                    id="totalQuantity"
                    type="number"
                    value={editFormData.totalQuantity}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        totalQuantity: e.target.value,
                      })
                    }
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleUpdateQuantity}>
                  Cập nhật
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button variant="destructive">
            <Trash2 className="w-4 h-4 mr-2" />
            Xóa
          </Button>
        </div> */}
      </div>

      {/* Status and Quick Stats */}
      {/* <div className="grid gap-4 md:grid-cols-5"> */}
      {/* <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              {getStatusIcon(currentStatus)}
              <span className="ml-2">Trạng thái</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className={getStatusColor(currentStatus)}>
              {currentStatus}
            </Badge>
          </CardContent>
        </Card> */}
      {/* <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tổng số lượng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {inventoryDetail.totalQuantity.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">ml</p>
          </CardContent>
        </Card> */}
      {/* <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Có sẵn</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {availableStats?.totalQuantity.toLocaleString() || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {availableStats?.count || 0} đơn vị
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Đã đặt trước</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {reservedStats?.totalQuantity.toLocaleString() || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {reservedStats?.count || 0} đơn vị
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Sắp hết hạn</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {totalExpiringQuantity.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {inventoryDetail.expiringUnits.length} lô
            </p>
          </CardContent>
        </Card> */}
      {/* </div> */}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Blood Component Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Droplets className="w-5 h-5 mr-2" />
              Thông tin thành phần máu
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Thành phần
                </Label>
                <p className="text-lg font-semibold">
                  {inventoryDetail.componentId.name || "Đang tải"}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Nhóm máu
                </Label>
                <p className="text-lg font-semibold">
                  {inventoryDetail.groupId.name || "Đang tải"}
                </p>
              </div>
            </div>
            <Separator />
            {inventoryDetail && (
              <>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Số lượng
                  </Label>
                  <p className="text-sm">
                    {inventoryDetail.totalQuantity.toLocaleString() ||
                      "Đang tải"}
                  </p>
                </div>
                {/* <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Nhiệt độ bảo quản
                    </Label>
                    <p className="text-sm">2-6°C</p>
                  </div>
                </div> */}
              </>
            )}
          </CardContent>
        </Card>

        {/* Facility Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Thông tin chi nhánh
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">
                Tên chi nhánh
              </Label>
              <p className="text-lg font-semibold">
                {inventoryDetail.facilityId.name || "Đang tải"}
              </p>
            </div>
            {typeof inventoryDetail.facilityId === "object" && (
              <>
                {inventoryDetail.facilityId.address && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Địa chỉ
                    </Label>
                    <p className="text-sm">
                      {inventoryDetail.facilityId.address}
                    </p>
                  </div>
                )}
                {inventoryDetail.facilityId && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Code
                    </Label>
                    <p className="text-sm">{inventoryDetail.facilityId.code}</p>
                  </div>
                )}
              </>
            )}
            <Separator />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Ngày tạo
                </Label>
                <p className="text-sm flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {formatDate(inventoryDetail.createdAt)}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Cập nhật cuối
                </Label>
                <p className="text-sm flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {formatDate(inventoryDetail.updatedAt)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Unit Statistics */}
      {/* <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Thống kê đơn vị máu
          </CardTitle>
          <CardDescription>
            Phân bố trạng thái các đơn vị máu trong kho
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {inventoryDetail.unitStats.map((stat) => (
              <div key={stat._id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium capitalize">
                    {stat._id === "available"
                      ? "Có sẵn"
                      : stat._id === "reserved"
                      ? "Đã đặt trước"
                      : stat._id === "expired"
                      ? "Hết hạn"
                      : stat._id}
                  </Label>
                  <Badge
                    variant={
                      stat._id === "available"
                        ? "default"
                        : stat._id === "reserved"
                        ? "secondary"
                        : "destructive"
                    }
                  >
                    {stat.count} đơn vị
                  </Badge>
                </div>
                <p className="text-2xl font-bold">
                  {stat.totalQuantity.toLocaleString()} ml
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card> */}

      {/* Expiring Units */}
      {/* {inventoryDetail.expiringUnits.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-orange-500" />
              Đơn vị sắp hết hạn
            </CardTitle>
            <CardDescription>Các lô máu cần được sử dụng sớm</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Số lượng</TableHead>
                  <TableHead>Ngày hết hạn</TableHead>
                  <TableHead>Thời gian còn lại</TableHead>
                  <TableHead>Mức độ ưu tiên</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventoryDetail.expiringUnits.map((unit, index) => {
                  const expiryDate = new Date(unit.expiresAt);
                  const now = new Date();
                  const daysLeft = Math.ceil(
                    (expiryDate.getTime() - now.getTime()) /
                      (1000 * 60 * 60 * 24)
                  );

                  return (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {unit.quantity.toLocaleString()} ml
                      </TableCell>
                      <TableCell>{formatDate(unit.expiresAt)}</TableCell>
                      <TableCell>
                        <span
                          className={
                            daysLeft <= 3
                              ? "text-red-600 font-semibold"
                              : daysLeft <= 7
                              ? "text-orange-600"
                              : "text-green-600"
                          }
                        >
                          {daysLeft > 0 ? `${daysLeft} ngày` : "Đã hết hạn"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            daysLeft <= 3
                              ? "destructive"
                              : daysLeft <= 7
                              ? "secondary"
                              : "default"
                          }
                        >
                          {daysLeft <= 3
                            ? "Khẩn cấp"
                            : daysLeft <= 7
                            ? "Cao"
                            : "Bình thường"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )} */}
    </div>
  );
}

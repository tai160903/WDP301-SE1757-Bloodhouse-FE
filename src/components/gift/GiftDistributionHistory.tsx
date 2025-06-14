import React, { useState, useEffect } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Eye, Download, Calendar, User, Package, Gift } from "lucide-react";
import { toast } from "sonner";
import {
  getDistributionReport,
  getSharedGiftItems,
  getGiftPackages,
  type GiftDistribution,
  type DistributionSummary,
  type GetDistributionReportParams,
  type GiftItem,
  type GiftPackage
} from "@/services/gift";
import { getGiftCategoryText } from "@/utils/changeText";

interface User {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
}

interface BloodDonation {
  _id: string;
  donationDate: string;
  quantity: number;
}

interface Staff {
  _id: string;
  userId: User;
  position: string;
}

interface GiftDistributionHistoryProps {
  onExport?: () => void;
}

export function GiftDistributionHistory({ onExport }: GiftDistributionHistoryProps) {
  const [distributions, setDistributions] = useState<GiftDistribution[]>([]);
  const [giftItems, setGiftItems] = useState<GiftItem[]>([]);
  const [giftPackages, setGiftPackages] = useState<GiftPackage[]>([]);
  const [summary, setSummary] = useState<DistributionSummary>({
    totalDistributions: 0,
    totalQuantity: 0,
    totalCost: 0
  });
  const [loading, setLoading] = useState(true);
  const [selectedDistribution, setSelectedDistribution] = useState<GiftDistribution | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filter states
  const [filters, setFilters] = useState({
    search: "",
    startDate: "",
    endDate: "",
    giftItemId: "all",
    packageId: "all",
    distributedBy: "all",
  });

  useEffect(() => {
    fetchDistributions();
    fetchGiftItems();
    fetchGiftPackages();
  }, [currentPage, filters]);

  const fetchDistributions = async () => {
    try {
      setLoading(true);
      const params: GetDistributionReportParams = {
        page: currentPage,
        limit: 10,
        ...filters
      };

      // Remove empty filters and "all" values
      Object.keys(params).forEach(key => {
        const value = params[key as keyof GetDistributionReportParams];
        if (value === "" || value === "all") {
          delete params[key as keyof GetDistributionReportParams];
        }
      });

      const response = await getDistributionReport(params);
      setDistributions(response.data.data);
      setSummary(response.data.summary);
      setTotalPages(response.data.metadata.totalPages);
    } catch (error: any) {
      console.error('Error fetching distributions:', error);
      toast.error("Không thể tải lịch sử phát quà");
    } finally {
      setLoading(false);
    }
  };

  const fetchGiftItems = async () => {
    try {
      const response = await getSharedGiftItems({ isActive: true });
      setGiftItems(response.data.data);
    } catch (error: any) {
      console.error('Error fetching gift items:', error);
    }
  };

  const fetchGiftPackages = async () => {
    try {
      const response = await getGiftPackages();
      setGiftPackages(response.data.data);
    } catch (error: any) {
      console.error('Error fetching gift packages:', error);
    }
  };

  const handleExportReport = async () => {
    try {
      // For now, just trigger the callback
      toast.success("Xuất báo cáo thành công");
      onExport?.();
    } catch (error: any) {
      console.error('Error exporting report:', error);
      toast.error("Không thể xuất báo cáo");
    }
  };

  const openDetailDialog = (distribution: GiftDistribution) => {
    setSelectedDistribution(distribution);
    setIsDetailDialogOpen(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const getDistributionType = (distribution: GiftDistribution) => {
    if (distribution.packageId) {
      return { type: "Gói quà", name: distribution.packageId.name, icon: Package };
    }
    if (distribution.giftItemId) {
      return { type: "Quà lẻ", name: distribution.giftItemId.name, icon: Gift };
    }
    return { type: "Không xác định", name: "N/A", icon: Gift };
  };

  const getCategoryText = (category: string) => {
    return getGiftCategoryText(category);
  };

  const getPositionText = (position: string) => {
    const positionMap: { [key: string]: string } = {
      manager: "Quản lý",
      nurse: "Y tá",
      admin: "Quản trị viên"
    };
    return positionMap[position] || position;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Lịch sử phát quà</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Lịch sử phát quà</CardTitle>
            <CardDescription>
              Theo dõi và quản lý lịch sử phát quà tặng cho người hiến máu
            </CardDescription>
          </div>
          <Button onClick={handleExportReport} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Xuất báo cáo
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tổng lượt phát</p>
                  <p className="text-2xl font-bold">{summary.totalDistributions}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tổng số lượng</p>
                  <p className="text-2xl font-bold">{summary.totalQuantity}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tổng giá trị</p>
                  <p className="text-2xl font-bold">{formatCurrency(summary.totalCost)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <Input
            placeholder="Tìm kiếm..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
          />
          <div className="grid gap-2">
            <Label htmlFor="startDate" className="text-xs">Từ ngày</Label>
            <Input
              id="startDate"
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="endDate" className="text-xs">Đến ngày</Label>
            <Input
              id="endDate"
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
            />
          </div>
          <Select
            value={filters.giftItemId}
            onValueChange={(value) => setFilters(prev => ({ ...prev, giftItemId: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Quà tặng" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              {giftItems.map((item) => (
                <SelectItem key={item._id} value={item._id}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={filters.packageId}
            onValueChange={(value) => setFilters(prev => ({ ...prev, packageId: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Gói quà" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              {giftPackages.map((pkg) => (
                <SelectItem key={pkg._id} value={pkg._id}>
                  {pkg.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={filters.distributedBy}
            onValueChange={(value) => setFilters(prev => ({ ...prev, distributedBy: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Người phát" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              {/* These would be populated from API */}
            </SelectContent>
          </Select>
        </div>

        {/* Distribution Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Người nhận</TableHead>
              <TableHead>Quà tặng</TableHead>
              <TableHead>Số lượng</TableHead>
              <TableHead>Giá trị</TableHead>
              <TableHead>Người phát</TableHead>
              <TableHead>Ngày phát</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {distributions.map((distribution) => {
              const distributionType = getDistributionType(distribution);
              const TypeIcon = distributionType.icon;
              
              return (
                <TableRow key={distribution._id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{distribution.userId.fullName}</div>
                        <div className="text-sm text-muted-foreground">
                          {distribution.userId.phone}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <TypeIcon className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{distributionType.name}</div>
                        <Badge variant="outline" className="text-xs">
                          {distributionType.type}
                        </Badge>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{distribution.quantity}</TableCell>
                  <TableCell>
                    {formatCurrency(distribution.quantity * distribution.costPerUnit)}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{distribution.distributedBy.userId.fullName}</div>
                      <Badge variant="secondary" className="text-xs">
                        {getPositionText(distribution.distributedBy.position)}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    {formatDateTime(distribution.distributedAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openDetailDialog(distribution)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {distributions.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            Chưa có lịch sử phát quà nào.
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Trước
            </Button>
            <span className="flex items-center px-3 text-sm">
              Trang {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Sau
            </Button>
          </div>
        )}
      </CardContent>

      {/* Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chi tiết phát quà</DialogTitle>
            <DialogDescription>
              Thông tin chi tiết về lần phát quà tặng
            </DialogDescription>
          </DialogHeader>
          {selectedDistribution && (
            <div className="grid gap-6 py-4">
              {/* Recipient Information */}
              <div className="grid gap-4">
                <h4 className="font-semibold flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Thông tin người nhận
                </h4>
                <div className="grid grid-cols-2 gap-4 pl-6">
                  <div>
                    <Label className="text-sm font-medium">Họ tên</Label>
                    <p className="text-sm text-muted-foreground">{selectedDistribution.userId.fullName}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Số điện thoại</Label>
                    <p className="text-sm text-muted-foreground">{selectedDistribution.userId.phone}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Email</Label>
                    <p className="text-sm text-muted-foreground">{selectedDistribution.userId.email}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Ngày hiến máu</Label>
                    <p className="text-sm text-muted-foreground">
                      {formatDateTime(selectedDistribution.donationId.donationDate)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Gift Information */}
              <div className="grid gap-4">
                <h4 className="font-semibold flex items-center gap-2">
                  <Gift className="w-4 h-4" />
                  Thông tin quà tặng
                </h4>
                <div className="grid grid-cols-2 gap-4 pl-6">
                  <div>
                    <Label className="text-sm font-medium">Loại</Label>
                    <p className="text-sm text-muted-foreground">
                      {getDistributionType(selectedDistribution).type}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Tên</Label>
                    <p className="text-sm text-muted-foreground">
                      {getDistributionType(selectedDistribution).name}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Số lượng</Label>
                    <p className="text-sm text-muted-foreground">{selectedDistribution.quantity}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Giá trị</Label>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(selectedDistribution.quantity * selectedDistribution.costPerUnit)}
                    </p>
                  </div>
                  {selectedDistribution.giftItemId && (
                    <div>
                      <Label className="text-sm font-medium">Danh mục</Label>
                      <p className="text-sm text-muted-foreground">
                        {getCategoryText(selectedDistribution.giftItemId.category)}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Distribution Information */}
              <div className="grid gap-4">
                <h4 className="font-semibold flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Thông tin phát quà
                </h4>
                <div className="grid grid-cols-2 gap-4 pl-6">
                  <div>
                    <Label className="text-sm font-medium">Người phát</Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedDistribution.distributedBy.userId.fullName}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Chức vụ</Label>
                    <p className="text-sm text-muted-foreground">
                      {getPositionText(selectedDistribution.distributedBy.position)}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Ngày phát</Label>
                    <p className="text-sm text-muted-foreground">
                      {formatDateTime(selectedDistribution.distributedAt)}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Cơ sở</Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedDistribution.facilityId.name}
                    </p>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedDistribution.notes && (
                <div className="grid gap-2">
                  <Label className="text-sm font-medium">Ghi chú</Label>
                  <p className="text-sm text-muted-foreground p-3 bg-muted rounded">
                    {selectedDistribution.notes}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
} 
import React, { useState, useEffect, useCallback, useMemo } from "react";
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
} from "@/components/ui/dialog";
import { Eye, Download, Calendar, User, Package, Gift, Search, Filter } from "lucide-react";
import { toast } from "sonner";
import {
  getDistributionReport,
  getGiftPackages,
  type GiftDistribution,
  type DistributionSummary,
  type GetDistributionReportParams,
  type GiftPackage
} from "@/services/gift";
import { getGiftCategoryText } from "@/utils/changeText";

interface User {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
}


interface GiftDistributionHistoryProps {
  onExport?: () => void;
}

// Separate component for the distribution list to prevent filter bar re-renders
const DistributionList = React.memo(({ 
  distributions, 
  loading, 
  onView,
  getDistributionType,
  formatCurrency,
  formatDateTime,
  getPositionText
}: {
  distributions: GiftDistribution[];
  loading: boolean;
  onView: (distribution: GiftDistribution) => void;
  getDistributionType: (distribution: GiftDistribution) => any;
  formatCurrency: (amount: number) => string;
  formatDateTime: (dateString: string) => string;
  getPositionText: (position: string) => string;
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
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
            <TableRow key={distribution._id} className="hover:bg-muted/50 transition-colors">
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{distribution.userId.fullName}</div>
                    <div className="text-sm text-muted-foreground">
                      {distribution.userId.phone}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <TypeIcon className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{distributionType.name}</div>
                    <Badge variant="outline" className="text-xs mt-1">
                      {distributionType.type}
                    </Badge>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="font-semibold text-lg text-gray-900">{distribution.quantity}</div>
              </TableCell>
              <TableCell>
                <div className="font-semibold text-green-600">
                  {formatCurrency(distribution.quantity * distribution.costPerUnit)}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                    <User className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{distribution.distributedBy.userId.fullName}</div>
                    <Badge variant="secondary" className="text-xs mt-1">
                      {getPositionText(distribution.distributedBy.position)}
                    </Badge>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium text-gray-900">
                    {formatDateTime(distribution.distributedAt).split(' ')[0]}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {formatDateTime(distribution.distributedAt).split(' ')[1]}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onView(distribution)}
                  className="hover:bg-blue-50 hover:border-blue-200"
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
});

DistributionList.displayName = "DistributionList";

// Custom hook for debounced search
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export function GiftDistributionHistory({ onExport }: GiftDistributionHistoryProps) {
  const [distributions, setDistributions] = useState<GiftDistribution[]>([]);
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

  // Filter states with debounced search
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    packageId: "all",
  });

  // Debounced search term to prevent excessive API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Fetch distributions when debounced search term, filters, or page changes
  useEffect(() => {
    fetchDistributions();
  }, [debouncedSearchTerm, filters, currentPage]);

  // Reset page when search term or filters change
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [debouncedSearchTerm, filters]);

  // Fetch gift packages only once
  useEffect(() => {
    fetchGiftPackages();
  }, []);

  const fetchDistributions = useCallback(async () => {
    try {
      setLoading(true);
      const params: GetDistributionReportParams = {
        page: currentPage,
        limit: 10,
        ...filters,
        search: debouncedSearchTerm || undefined
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
  }, [currentPage, debouncedSearchTerm, filters]);

  const fetchGiftPackages = useCallback(async () => {
    try {
      const response = await getGiftPackages();
      setGiftPackages(response.data.data);
    } catch (error: any) {
      console.error('Error fetching gift packages:', error);
    }
  }, []);

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

  const formatCurrency = useCallback((amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  }, []);

  const formatDateTime = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN');
  }, []);

  const getDistributionType = useCallback((distribution: GiftDistribution) => {
    if (distribution.packageId) {
      return { type: "Gói quà", name: distribution.packageId.name, icon: Package };
    }
    if (distribution.giftItemId) {
      return { type: "Quà lẻ", name: distribution.giftItemId.name, icon: Gift };
    }
    return { type: "Không xác định", name: "N/A", icon: Gift };
  }, []);

  const getCategoryText = useCallback((category: string) => {
    return getGiftCategoryText(category);
  }, []);

  const getPositionText = useCallback((position: string) => {
    const positionMap: { [key: string]: string } = {
      manager: "Quản lý",
      nurse: "Y tá",
      admin: "Quản trị viên"
    };
    return positionMap[position] || position;
  }, []);

  const clearAllFilters = () => {
    setSearchTerm("");
    setFilters({
      startDate: "",
      endDate: "",
      packageId: "all",
    });
  };

  const hasActiveFilters = searchTerm || 
    filters.startDate || 
    filters.endDate || 
    filters.packageId !== "all";

  // Memoized filter bar to prevent unnecessary re-renders
  const FilterBar = useMemo(() => (
    <div className="mb-6">
      {/* Single Row Filter Bar */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-end">
        {/* Search Input */}
        <div className="relative w-full lg:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Tìm kiếm theo tên người hiến máu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Date Filters */}
        <div className="flex gap-3">
          <div className="grid gap-1 min-w-[140px]">
            <Label htmlFor="startDate" className="text-xs font-medium text-gray-600">Từ ngày</Label>
            <Input
              id="startDate"
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
              className="text-sm"
            />
          </div>
          <div className="grid gap-1 min-w-[140px]">
            <Label htmlFor="endDate" className="text-xs font-medium text-gray-600">Đến ngày</Label>
            <Input
              id="endDate"
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
              className="text-sm"
            />
          </div>
        </div>

        {/* Package Filter */}
        <div className="grid gap-1 min-w-[160px]">
          <Label className="text-xs font-medium text-gray-600">Gói quà</Label>
          <Select
            value={filters.packageId}
            onValueChange={(value) => setFilters(prev => ({ ...prev, packageId: value }))}
          >
            <SelectTrigger className="text-sm">
              <SelectValue placeholder="Gói quà" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả gói quà</SelectItem>
              {giftPackages.map((pkg) => (
                <SelectItem key={pkg._id} value={pkg._id}>
                  {pkg.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            onClick={clearAllFilters}
            size="sm"
            className="flex items-center gap-2 whitespace-nowrap"
          >
            <Filter className="w-4 h-4" />
            Xóa bộ lọc
          </Button>
        )}
      </div>
    </div>
  ), [searchTerm, filters, hasActiveFilters, giftPackages]);

  if (loading && distributions.length === 0) {
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
            <CardTitle className="text-2xl font-bold text-gray-900">Lịch sử phát quà</CardTitle>
            <CardDescription className="text-base text-gray-600 mt-1">
              Theo dõi và quản lý lịch sử phát quà tặng cho người hiến máu
            </CardDescription>
          </div>
          {/* <Button onClick={handleExportReport} variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Xuất báo cáo
          </Button> */}
        </div>
      </CardHeader>
      <CardContent>
        {FilterBar}
        <DistributionList
          distributions={distributions}
          loading={loading}
          onView={openDetailDialog}
          getDistributionType={getDistributionType}
          formatCurrency={formatCurrency}
          formatDateTime={formatDateTime}
          getPositionText={getPositionText}
        />

        {!loading && distributions.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Gift className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            {hasActiveFilters ? 
              "Không tìm thấy lịch sử phát quà nào phù hợp với bộ lọc" : 
              "Chưa có lịch sử phát quà nào."
            }
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Trước
            </Button>
            <span className="flex items-center px-4 text-sm font-medium">
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-6">
            <DialogTitle className="text-2xl font-bold text-gray-900">Chi tiết phát quà</DialogTitle>
            <DialogDescription className="text-base text-gray-600">
              Thông tin chi tiết về lần phát quà tặng
            </DialogDescription>
          </DialogHeader>
          {selectedDistribution && (
            <div className="grid gap-8 py-4">
              {/* Header Section */}
              <div className="flex flex-col md:flex-row gap-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border">
                <div className="flex-shrink-0 flex justify-center md:justify-start">
                  <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                    <Gift className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="text-xl font-bold text-gray-900">
                    {getDistributionType(selectedDistribution).name}
                  </h3>
                  <Badge variant="outline" className="text-sm">
                    {getDistributionType(selectedDistribution).type}
                  </Badge>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>Số lượng: <strong>{selectedDistribution.quantity}</strong></span>
                    <span>Giá trị: <strong className="text-green-600">{formatCurrency(selectedDistribution.quantity * selectedDistribution.costPerUnit)}</strong></span>
                  </div>
                </div>
              </div>

              {/* Recipient Information */}
              <div className="bg-white rounded-xl border p-6">
                <h4 className="font-semibold text-lg text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Thông tin người nhận
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Họ tên</Label>
                      <p className="text-base font-semibold text-gray-900 mt-1">{selectedDistribution.userId.fullName}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Email</Label>
                      <p className="text-base text-gray-700 mt-1">{selectedDistribution.userId.email}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Số điện thoại</Label>
                      <p className="text-base font-semibold text-gray-900 mt-1">{selectedDistribution.userId.phone}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Ngày hiến máu</Label>
                      <p className="text-base text-gray-700 mt-1">
                        {formatDateTime(selectedDistribution.donationId.donationDate)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Gift Information */}
              <div className="bg-white rounded-xl border p-6">
                <h4 className="font-semibold text-lg text-gray-900 mb-4 flex items-center gap-2">
                  <Gift className="w-5 h-5 text-green-600" />
                  Thông tin quà tặng
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Loại</Label>
                      <p className="text-base font-semibold text-gray-900 mt-1">
                        {getDistributionType(selectedDistribution).type}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Số lượng</Label>
                      <p className="text-base font-semibold text-gray-900 mt-1">{selectedDistribution.quantity}</p>
                    </div>
                    {selectedDistribution.giftItemId && (
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Danh mục</Label>
                        <p className="text-base text-gray-700 mt-1">
                          {getCategoryText(selectedDistribution.giftItemId.category)}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Tên</Label>
                      <p className="text-base font-semibold text-gray-900 mt-1">
                        {getDistributionType(selectedDistribution).name}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Giá trị</Label>
                      <p className="text-base font-semibold text-green-600 mt-1">
                        {formatCurrency(selectedDistribution.quantity * selectedDistribution.costPerUnit)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Distribution Information */}
              <div className="bg-white rounded-xl border p-6">
                <h4 className="font-semibold text-lg text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  Thông tin phát quà
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Người phát</Label>
                      <p className="text-base font-semibold text-gray-900 mt-1">
                        {selectedDistribution.distributedBy.userId.fullName}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Ngày phát</Label>
                      <p className="text-base text-gray-700 mt-1">
                        {formatDateTime(selectedDistribution.distributedAt)}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Chức vụ</Label>
                      <Badge variant="secondary" className="mt-1">
                        {getPositionText(selectedDistribution.distributedBy.position)}
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Cơ sở</Label>
                      <p className="text-base text-gray-700 mt-1">
                        {selectedDistribution.facilityId.name}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedDistribution.notes && (
                <div className="bg-white rounded-xl border p-6">
                  <Label className="text-sm font-medium text-gray-500">Ghi chú</Label>
                  <p className="text-base text-gray-700 mt-3 p-4 bg-gray-50 rounded-lg border">
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
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Edit, 
  AlertTriangle,
  CheckCircle,
  Plus
} from "lucide-react";
import { toast } from "sonner";
import {
  getBudget,
  manageBudget,
  type GiftBudget,
  type ManageBudgetData
} from "@/services/gift";

interface GiftBudgetManagerProps {
  onBudgetUpdate?: () => void;
}

export function GiftBudgetManager({ onBudgetUpdate }: GiftBudgetManagerProps) {
  const [budget, setBudget] = useState<GiftBudget | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    budget: 0,
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    fetchBudget();
  }, []);

  const fetchBudget = async () => {
    try {
      setLoading(true);
      const response = await getBudget();
      setBudget(response.data);
    } catch (error: any) {
      console.error('Error fetching budget:', error);
      // If budget doesn't exist, it's not an error - just no budget set yet
      if (!error.message?.includes('not found')) {
        toast.error("Không thể tải thông tin ngân sách");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBudget = async () => {
    try {
      if (formData.budget <= 0) {
        toast.error("Ngân sách phải lớn hơn 0");
        return;
      }

      if (!formData.startDate || !formData.endDate) {
        toast.error("Vui lòng chọn ngày bắt đầu và kết thúc");
        return;
      }

      if (new Date(formData.startDate) >= new Date(formData.endDate)) {
        toast.error("Ngày bắt đầu phải trước ngày kết thúc");
        return;
      }

      if (budget && formData.budget < budget.spent) {
        toast.error(`Ngân sách mới không thể nhỏ hơn số tiền đã chi (${formatCurrency(budget.spent)})`);
        return;
      }

      const budgetData: ManageBudgetData = {
        budget: formData.budget,
        startDate: formData.startDate,
        endDate: formData.endDate,
      };

      await manageBudget(budgetData);
      
      toast.success("Cập nhật ngân sách thành công");
      setIsEditDialogOpen(false);
      fetchBudget();
      onBudgetUpdate?.();
    } catch (error: any) {
      console.error('Error updating budget:', error);
      toast.error(error.message || "Không thể cập nhật ngân sách");
    }
  };

  const openEditDialog = () => {
    if (budget) {
      setFormData({
        budget: budget.budget,
        startDate: budget.startDate.split('T')[0],
        endDate: budget.endDate.split('T')[0],
      });
    } else {
      // Set default values for new budget
      const now = new Date();
      const nextYear = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
      setFormData({
        budget: 0,
        startDate: now.toISOString().split('T')[0],
        endDate: nextYear.toISOString().split('T')[0],
      });
    }
    setIsEditDialogOpen(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getBudgetStatus = () => {
    if (!budget) return { status: "Chưa có", color: "gray", icon: AlertTriangle };
    
    const spentPercentage = (budget.spent / budget.budget) * 100;
    const remaining = budget.budget - budget.spent;
    const now = new Date();
    const endDate = new Date(budget.endDate);
    const isExpired = now > endDate;

    if (isExpired) {
      return { status: "Hết hạn", color: "red", icon: AlertTriangle };
    }
    
    if (spentPercentage >= 90) {
      return { status: "Sắp hết", color: "red", icon: AlertTriangle };
    }
    
    if (spentPercentage >= 70) {
      return { status: "Cảnh báo", color: "orange", icon: TrendingDown };
    }
    
    return { status: "Bình thường", color: "green", icon: CheckCircle };
  };

  const getSpentPercentage = () => {
    if (!budget || budget.budget === 0) return 0;
    return Math.min((budget.spent / budget.budget) * 100, 100);
  };

  const getRemainingDays = () => {
    if (!budget) return 0;
    const now = new Date();
    const endDate = new Date(budget.endDate);
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(diffDays, 0);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Quản lý ngân sách</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const budgetStatus = getBudgetStatus();
  const spentPercentage = getSpentPercentage();
  const remainingDays = getRemainingDays();
  const StatusIcon = budgetStatus.icon;

  return (
    <div className="space-y-6">
      {/* Budget Overview */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Tổng quan ngân sách</CardTitle>
              <CardDescription>
                Theo dõi và quản lý ngân sách quà tặng của cơ sở
              </CardDescription>
            </div>
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={openEditDialog}>
                  {budget ? (
                    <>
                      <Edit className="w-4 h-4 mr-2" />
                      Cập nhật ngân sách
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Thiết lập ngân sách
                    </>
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {budget ? "Cập nhật ngân sách" : "Thiết lập ngân sách"}
                  </DialogTitle>
                  <DialogDescription>
                    {budget ? "Cập nhật ngân sách hiện tại" : "Thiết lập ngân sách mới cho quà tặng"}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="budget">Tổng ngân sách (VND) *</Label>
                    <Input
                      id="budget"
                      type="number"
                      min="0"
                      step="100000"
                      value={formData.budget}
                      onChange={(e) => setFormData(prev => ({ ...prev, budget: parseFloat(e.target.value) || 0 }))}
                      placeholder="10000000"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="startDate">Ngày bắt đầu *</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="endDate">Ngày kết thúc *</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                      />
                    </div>
                  </div>
                  {budget && (
                    <div className="p-3 bg-muted rounded">
                      <p className="text-sm text-muted-foreground">
                        <strong>Lưu ý:</strong> Số tiền đã chi: {formatCurrency(budget.spent)}
                      </p>
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Hủy
                  </Button>
                  <Button onClick={handleUpdateBudget}>
                    {budget ? "Cập nhật" : "Thiết lập"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {budget ? (
            <div className="space-y-6">
              {/* Status and Progress */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <StatusIcon className={`w-5 h-5 text-${budgetStatus.color}-500`} />
                  <Badge 
                    variant={budgetStatus.color === 'green' ? 'default' : 'destructive'}
                    className={budgetStatus.color === 'orange' ? 'bg-orange-100 text-orange-800' : ''}
                  >
                    {budgetStatus.status}
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Còn lại {remainingDays} ngày</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(budget.startDate)} - {formatDate(budget.endDate)}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Đã sử dụng</span>
                  <span>{spentPercentage.toFixed(1)}%</span>
                </div>
                <Progress 
                  value={spentPercentage} 
                  className={`h-3 ${spentPercentage >= 90 ? 'bg-red-100' : spentPercentage >= 70 ? 'bg-orange-100' : 'bg-green-100'}`}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{formatCurrency(budget.spent)}</span>
                  <span>{formatCurrency(budget.budget)}</span>
                </div>
              </div>

              {/* Budget Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Tổng ngân sách</p>
                        <p className="text-lg font-bold">{formatCurrency(budget.budget)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <TrendingDown className="w-5 h-5 text-red-500" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Đã chi tiêu</p>
                        <p className="text-lg font-bold">{formatCurrency(budget.spent)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Còn lại</p>
                        <p className="text-lg font-bold">{formatCurrency(budget.budget - budget.spent)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Budget Details */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <Label className="text-sm font-medium">Cơ sở</Label>
                  <p className="text-sm text-muted-foreground">{budget.facilityId.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Mã cơ sở</Label>
                  <p className="text-sm text-muted-foreground">{budget.facilityId.code}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Ngày tạo</Label>
                  <p className="text-sm text-muted-foreground">{formatDate(budget.createdAt)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Cập nhật cuối</Label>
                  <p className="text-sm text-muted-foreground">{formatDate(budget.updatedAt)}</p>
                </div>
              </div>

              {/* Warnings */}
              {spentPercentage >= 90 && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    <p className="text-sm font-medium text-red-800">Cảnh báo ngân sách</p>
                  </div>
                  <p className="text-sm text-red-700 mt-1">
                    Bạn đã sử dụng hơn 90% ngân sách. Vui lòng kiểm soát chi tiêu hoặc tăng ngân sách.
                  </p>
                </div>
              )}

              {remainingDays <= 30 && remainingDays > 0 && (
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-orange-500" />
                    <p className="text-sm font-medium text-orange-800">Sắp hết hạn</p>
                  </div>
                  <p className="text-sm text-orange-700 mt-1">
                    Ngân sách sẽ hết hạn trong {remainingDays} ngày. Hãy chuẩn bị ngân sách mới.
                  </p>
                </div>
              )}

              {remainingDays <= 0 && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    <p className="text-sm font-medium text-red-800">Ngân sách đã hết hạn</p>
                  </div>
                  <p className="text-sm text-red-700 mt-1">
                    Ngân sách hiện tại đã hết hạn. Vui lòng thiết lập ngân sách mới để tiếp tục hoạt động.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <DollarSign className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Chưa có ngân sách</h3>
              <p className="text-muted-foreground mb-4">
                Thiết lập ngân sách để bắt đầu quản lý quà tặng
              </p>
              <Button onClick={openEditDialog}>
                <Plus className="w-4 h-4 mr-2" />
                Thiết lập ngân sách
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 
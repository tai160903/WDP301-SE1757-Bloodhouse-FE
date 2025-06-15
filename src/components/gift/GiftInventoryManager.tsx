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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Package, AlertTriangle, TrendingUp, Search } from "lucide-react";
import { toast } from "sonner";
import {
  getGiftInventory,
  getSharedGiftItems,
  addGiftToInventory,
  updateGiftInventory,
  deleteGiftInventory,
  type GiftItem,
  type GiftInventory,
  type AddGiftToInventoryData,
  type UpdateGiftInventoryData
} from "@/services/gift";
import { getGiftCategoryText } from "@/utils/changeText";

interface GiftInventoryManagerProps {
  onInventoryUpdate?: () => void;
}

// Separate component for the inventory list to prevent search bar re-renders
const InventoryList = React.memo(({ 
  inventories, 
  loading, 
  onEdit, 
  onDelete,
  getStockStatus,
  getCategoryText,
  formatCurrency 
}: {
  inventories: GiftInventory[];
  loading: boolean;
  onEdit: (inventory: GiftInventory) => void;
  onDelete: (inventoryId: string) => void;
  getStockStatus: (inventory: GiftInventory) => any;
  getCategoryText: (category: string) => string;
  formatCurrency: (amount: number) => string;
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
          <TableHead>Quà tặng</TableHead>
          <TableHead>Danh mục</TableHead>
          <TableHead>Tồn kho</TableHead>
          <TableHead>Có sẵn</TableHead>
          <TableHead>Giá/đơn vị</TableHead>
          <TableHead>Mức tối thiểu</TableHead>
          <TableHead>Trạng thái</TableHead>
          <TableHead>Cập nhật cuối</TableHead>
          <TableHead className="text-right">Thao tác</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {inventories.map((inventory) => {
          const stockStatus = getStockStatus(inventory);
          const StatusIcon = stockStatus.icon;
          
          return (
            <TableRow key={inventory._id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <img
                    src={inventory.giftItemId.image || 'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lzykzjypyie96a'}
                    alt={inventory.giftItemId.name}
                    className="w-10 h-10 rounded object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lzykzjypyie96a';
                    }}
                  />
                  <div>
                    <div className="font-medium">{inventory.giftItemId.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {inventory.giftItemId.unit}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="secondary">
                  {getCategoryText(inventory.giftItemId.category)}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {inventory.quantity}
                  {inventory.reservedQuantity > 0 && (
                    <span className="text-xs text-muted-foreground">
                      ({inventory.reservedQuantity} đã đặt)
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {inventory.availableQuantity}
                  {inventory.availableQuantity <= inventory.minStockLevel && (
                    <AlertTriangle className="w-4 h-4 text-orange-500" />
                  )}
                </div>
              </TableCell>
              <TableCell>{formatCurrency(inventory.costPerUnit)}</TableCell>
              <TableCell>{inventory.minStockLevel}</TableCell>
              <TableCell>
                <Badge 
                  variant={stockStatus.variant}
                  className={stockStatus.className}
                >
                  <StatusIcon className="w-3 h-3 mr-1" />
                  {stockStatus.status}
                </Badge>
              </TableCell>
              <TableCell>
                {new Date(inventory.updatedAt).toLocaleDateString('vi-VN')}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(inventory)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(inventory._id)}
                    disabled={inventory.quantity > 0}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
});


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

export function GiftInventoryManager({ onInventoryUpdate }: GiftInventoryManagerProps) {
  const [inventories, setInventories] = useState<GiftInventory[]>([]);
  const [giftItems, setGiftItems] = useState<GiftItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedInventory, setSelectedInventory] = useState<GiftInventory | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");

  // Debounced search term to prevent excessive API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Form states
  const [formData, setFormData] = useState({
    giftItemId: "",
    quantity: 0,
    costPerUnit: 0,
    minStockLevel: 10,
  });

  // Reset page when filters change
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [debouncedSearchTerm, categoryFilter, stockFilter]);

  // Fetch inventories when debounced search term, filters, or page changes
  useEffect(() => {
    fetchInventories();
  }, [debouncedSearchTerm, categoryFilter, stockFilter, currentPage]);

  // Fetch gift items only once
  useEffect(() => {
    fetchGiftItems();
  }, []);

  const fetchGiftItems = useCallback(async () => {
    try {
      const response = await getSharedGiftItems({ isActive: true });
      setGiftItems(response.data.data);
    } catch (error: any) {
      console.error('Error fetching gift items:', error);
      toast.error("Không thể tải danh sách quà tặng");
    }
  }, []);

  const fetchInventories = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getGiftInventory({ 
        page: currentPage, 
        search: debouncedSearchTerm || undefined,
        category: categoryFilter === "all" ? undefined : categoryFilter,
        lowStock: stockFilter === 'low',
        limit: 10
      });
      setInventories(response.data.data);
      setTotalPages(response.data.metadata.totalPages);
    } catch (error: any) {
      console.error('Error fetching inventories:', error);
      toast.error("Không thể tải danh sách kho");
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearchTerm, categoryFilter, stockFilter]);

  const handleAddToInventory = async () => {
    try {
      if (!formData.giftItemId || formData.quantity <= 0 || formData.costPerUnit <= 0) {
        toast.error("Vui lòng điền đầy đủ thông tin hợp lệ");
        return;
      }

      const inventoryData: AddGiftToInventoryData = {
        giftItemId: formData.giftItemId,
        quantity: formData.quantity,
        costPerUnit: formData.costPerUnit,
        minStockLevel: formData.minStockLevel,
      };

      await addGiftToInventory(inventoryData);
      
      toast.success("Thêm vào kho thành công");
      setIsAddDialogOpen(false);
      resetForm();
      fetchInventories();
      onInventoryUpdate?.();
    } catch (error: any) {
      console.error('Error adding to inventory:', error);
      toast.error(error.message || "Không thể thêm vào kho");
    }
  };

  const handleUpdateInventory = async () => {
    try {
      if (!selectedInventory) return;

      const inventoryData: UpdateGiftInventoryData = {
        quantity: formData.quantity,
        costPerUnit: formData.costPerUnit,
        minStockLevel: formData.minStockLevel
      };

      await updateGiftInventory(selectedInventory._id, inventoryData);
      
      toast.success("Cập nhật kho thành công");
      setIsEditDialogOpen(false);
      resetForm();
      fetchInventories();
      onInventoryUpdate?.();
    } catch (error: any) {
      console.error('Error updating inventory:', error);
      toast.error(error.message || "Không thể cập nhật kho");
    }
  };

  const handleDeleteInventory = async (inventoryId: string) => {
    try {
      if (!confirm("Bạn có chắc chắn muốn xóa mục kho này?")) return;

      await deleteGiftInventory(inventoryId);
      
      toast.success("Xóa khỏi kho thành công");
      fetchInventories();
      onInventoryUpdate?.();
    } catch (error: any) {
      console.error('Error deleting inventory:', error);
      toast.error(error.message || "Không thể xóa khỏi kho");
    }
  };

  const resetForm = useCallback(() => {
    setFormData({
      giftItemId: "",
      quantity: 0,
      costPerUnit: 0,
      minStockLevel: 10,
    });
    setSelectedInventory(null);
  }, []);

  const openEditDialog = (inventory: GiftInventory) => {
    setSelectedInventory(inventory);
    setFormData({
      giftItemId: inventory.giftItemId._id,
      quantity: inventory.quantity,
      costPerUnit: inventory.costPerUnit,
      minStockLevel: inventory.minStockLevel,
    });
    setIsEditDialogOpen(true);
  };

  const getStockStatus = useCallback((inventory: GiftInventory) => {
    if (inventory.availableQuantity === 0) {
      return { status: "Hết hàng", variant: "destructive" as const, icon: AlertTriangle };
    }
    if (inventory.availableQuantity <= inventory.minStockLevel) {
      return { status: "Sắp hết", variant: "outline" as const, icon: AlertTriangle, className: "border-orange-500 text-orange-600" };
    }
    return { status: "Còn hàng", variant: "default" as const, icon: TrendingUp, className: "bg-green-100 text-green-800" };
  }, []);

  const getCategoryText = useCallback((category: string) => {
    return getGiftCategoryText(category);
  }, []);

  const formatCurrency = useCallback((amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  }, []);

  // Memoized search and filter bar to prevent unnecessary re-renders
  const SearchAndFilterBar = useMemo(() => (
    <div className="flex gap-4 mb-6">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Tìm kiếm quà tặng theo tên..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      <Select value={categoryFilter} onValueChange={setCategoryFilter}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Lọc theo danh mục" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả danh mục</SelectItem>
          <SelectItem value="food">Thực phẩm</SelectItem>
          <SelectItem value="beverage">Đồ uống</SelectItem>
          <SelectItem value="merchandise">Hàng lưu niệm</SelectItem>
          <SelectItem value="health">Sức khỏe</SelectItem>
          <SelectItem value="other">Khác</SelectItem>
        </SelectContent>
      </Select>
      <Select value={stockFilter} onValueChange={setStockFilter}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Lọc theo tồn kho" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả</SelectItem>
          <SelectItem value="low">Sắp hết hàng</SelectItem>
          <SelectItem value="available">Còn hàng</SelectItem>
          {/* <SelectItem value="out">Hết hàng</SelectItem> */}
        </SelectContent>
      </Select>
      {(searchTerm || categoryFilter !== "all" || stockFilter !== "all") && (
        <Button
          variant="outline"
          onClick={() => {
            setSearchTerm("");
            setCategoryFilter("all");
            setStockFilter("all");
          }}
          size="sm"
        >
          Xóa bộ lọc
        </Button>
      )}
    </div>
  ), [searchTerm, categoryFilter, stockFilter]);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Quản lý kho quà tặng</CardTitle>
            <CardDescription>
              Quản lý tồn kho và nhập xuất quà tặng
            </CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="w-4 h-4 mr-2" />
                Nhập kho
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nhập quà tặng vào kho</DialogTitle>
                <DialogDescription>
                  Thêm quà tặng mới hoặc bổ sung số lượng
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="giftItem">Quà tặng *</Label>
                  <Select
                    value={formData.giftItemId}
                    onValueChange={(value) => {
                      const selectedItem = giftItems.find(item => item._id === value);
                      setFormData(prev => ({
                        ...prev,
                        giftItemId: value,
                        costPerUnit: selectedItem?.costPerUnit || 0
                      }));
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn quà tặng" />
                    </SelectTrigger>
                    <SelectContent>
                      {giftItems.map((item) => (
                        <SelectItem key={item._id} value={item._id}>
                          {item.name} ({item.unit})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="quantity">Số lượng *</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      value={formData.quantity}
                      onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))}
                      placeholder="0"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="costPerUnit">Giá mỗi đơn vị *</Label>
                    <Input
                      id="costPerUnit"
                      type="number"
                      min="0"
                      step="1000"
                      value={formData.costPerUnit}
                      onChange={(e) => setFormData(prev => ({ ...prev, costPerUnit: parseFloat(e.target.value) || 0 }))}
                      placeholder="0"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="minStockLevel">Mức tồn kho tối thiểu</Label>
                  <Input
                    id="minStockLevel"
                    type="number"
                    min="0"
                    value={formData.minStockLevel}
                    onChange={(e) => setFormData(prev => ({ ...prev, minStockLevel: parseInt(e.target.value) || 10 }))}
                    placeholder="10"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Hủy
                </Button>
                <Button onClick={handleAddToInventory}>
                  Nhập kho
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {SearchAndFilterBar}

        <InventoryList
          inventories={inventories}
          loading={loading}
          onEdit={openEditDialog}
          onDelete={handleDeleteInventory}
          getStockStatus={getStockStatus}
          getCategoryText={getCategoryText}
          formatCurrency={formatCurrency}
        />

        {!loading && inventories.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            {searchTerm || categoryFilter !== "all" || stockFilter !== "all" ? 
              "Không tìm thấy quà tặng nào phù hợp với bộ lọc" : 
              "Chưa có quà tặng nào trong kho. Nhập quà tặng đầu tiên của bạn!"
            }
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

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cập nhật kho</DialogTitle>
            <DialogDescription>
              Chỉnh sửa thông tin kho quà tặng
            </DialogDescription>
          </DialogHeader>
          {selectedInventory && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Quà tặng</Label>
                <div className="flex items-center gap-3 p-2 bg-muted rounded">
                  <img
                    src={selectedInventory.giftItemId.image || 'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lzykzjypyie96a'}
                    alt={selectedInventory.giftItemId.name}
                    className="w-8 h-8 rounded object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lzykzjypyie96a';
                    }}
                  />
                  <div>
                    <div className="font-medium">{selectedInventory.giftItemId.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {selectedInventory.giftItemId.unit}
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-quantity">Số lượng *</Label>
                  <Input
                    id="edit-quantity"
                    type="number"
                    min="0"
                    value={formData.quantity}
                    onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-costPerUnit">Giá mỗi đơn vị *</Label>
                  <Input
                    id="edit-costPerUnit"
                    type="number"
                    min="0"
                    step="1000"
                    value={formData.costPerUnit}
                    onChange={(e) => setFormData(prev => ({ ...prev, costPerUnit: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-minStockLevel">Mức tồn kho tối thiểu</Label>
                <Input
                  id="edit-minStockLevel"
                  type="number"
                  min="0"
                  value={formData.minStockLevel}
                  onChange={(e) => setFormData(prev => ({ ...prev, minStockLevel: parseInt(e.target.value) || 10 }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div>
                  <span className="font-medium">Số lượng đã đặt:</span> {selectedInventory.reservedQuantity}
                </div>
                <div>
                  <span className="font-medium">Có sẵn:</span> {selectedInventory.availableQuantity}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleUpdateInventory}>
              Cập nhật
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
} 
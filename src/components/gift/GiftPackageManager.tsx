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
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2, Package, Eye, AlertCircle, Search } from "lucide-react";
import { toast } from "sonner";
import { 
  getGiftPackages, 
  getSharedGiftItems, 
  createGiftPackage, 
  updateGiftPackage, 
  deleteGiftPackage,
  type GiftItem,
  type GiftPackage,
  type CreateGiftPackageData,
  type UpdateGiftPackageData
} from "@/services/gift";

interface PackageItem {
  giftItemId: string | GiftItem;
  quantity: number;
}

interface GiftPackageManagerProps {
  onPackageUpdate?: () => void;
}

// Separate component for the package list to prevent search bar re-renders
const PackageList = React.memo(({ 
  packages, 
  loading, 
  onEdit, 
  onView, 
  onDelete,
  getStatusBadge,
  getGiftItemFromPackageItem 
}: {
  packages: GiftPackage[];
  loading: boolean;
  onEdit: (pkg: GiftPackage) => void;
  onView: (pkg: GiftPackage) => void;
  onDelete: (packageId: string) => void;
  getStatusBadge: (pkg: GiftPackage) => React.ReactNode;
  getGiftItemFromPackageItem: (item: PackageItem) => string;
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
          <TableHead>Tên gói quà</TableHead>
          <TableHead>Hình ảnh</TableHead>
          <TableHead>Số lượng</TableHead>
          <TableHead>Trạng thái</TableHead>
          <TableHead>Ngày tạo</TableHead>
          <TableHead className="text-right">Thao tác</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {packages.map((pkg) => (
          <TableRow key={pkg._id}>
            <TableCell>
              <div>
                <div className="font-medium">{pkg.name}</div>
                {pkg.description && (
                  <div className="text-sm text-muted-foreground line-clamp-2">
                    {pkg.description}
                  </div>
                )}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center">
                <img
                  src={pkg.image || 'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lzykzjypyie96a'}
                  alt={pkg.name}
                  className="w-12 h-12 rounded-lg object-cover border"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lzykzjypyie96a';
                  }}
                />
              </div>
            </TableCell>
            <TableCell>
              <div className="flex flex-col">
                <span className="font-medium">{pkg.quantity}</span>
                <span className="text-sm text-muted-foreground">
                  Còn: {pkg.availableQuantity}
                  {pkg.availableQuantity < 10 && (
                    <AlertCircle className="w-3 h-3 text-orange-500 inline ml-1" />
                  )}
                </span>
              </div>
            </TableCell>
            <TableCell>{getStatusBadge(pkg)}</TableCell>
            <TableCell>
              <div className="flex flex-col">
                <span>{new Date(pkg.createdAt).toLocaleDateString('vi-VN')}</span>
                <span className="text-sm text-muted-foreground">
                  {new Date(pkg.createdAt).toLocaleTimeString('vi-VN', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              </div>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onView(pkg)}
                >
                  <Eye className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(pkg)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(pkg._id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
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

export function GiftPackageManager({ onPackageUpdate }: GiftPackageManagerProps) {
  const [packages, setPackages] = useState<GiftPackage[]>([]);
  const [giftItems, setGiftItems] = useState<GiftItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<GiftPackage | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Debounced search term to prevent excessive API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    items: [] as { giftItemId: string; quantity: number }[],
    quantity: 1,
    image: "",
  });

  // Fetch packages when debounced search term or page changes
  useEffect(() => {
    fetchPackages();
  }, [debouncedSearchTerm, currentPage]);

  // Reset page when search term changes
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [debouncedSearchTerm]);

  // Fetch gift items only once
  useEffect(() => {
    fetchGiftItems();
  }, []);

  const fetchPackages = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getGiftPackages({ 
        page: currentPage, 
        search: debouncedSearchTerm || undefined,
        limit: 10
      });
      setPackages(response.data.data);
      setTotalPages(response.data.metadata.totalPages);
    } catch (error: any) {
      console.error('Error fetching packages:', error);
      toast.error("Không thể tải danh sách gói quà");
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearchTerm]);

  const fetchGiftItems = useCallback(async () => {
    try {
      const response = await getSharedGiftItems({ isActive: true });
      setGiftItems(response.data.data);
    } catch (error: any) {
      console.error('Error fetching gift items:', error);
      toast.error("Không thể tải danh sách quà tặng");
    }
  }, []);

  const handleCreatePackage = async () => {
    try {
      if (!formData.name || formData.items.length === 0) {
        toast.error("Vui lòng nhập tên gói và chọn ít nhất một món quà");
        return;
      }

      const packageData: CreateGiftPackageData = {
        name: formData.name,
        description: formData.description,
        items: formData.items,
        quantity: formData.quantity,
        image: formData.image,
      };

      await createGiftPackage(packageData);
      
      toast.success("Tạo gói quà thành công");
      setIsCreateDialogOpen(false);
      resetForm();
      fetchPackages();
      onPackageUpdate?.();
    } catch (error: any) {
      console.error('Error creating package:', error);
      toast.error(error.message || "Không thể tạo gói quà");
    }
  };

  const handleUpdatePackage = async () => {
    try {
      if (!selectedPackage || !formData.name) {
        toast.error("Vui lòng nhập tên gói");
        return;
      }

      const packageData: UpdateGiftPackageData = {
        name: formData.name,
        description: formData.description,
        quantity: formData.quantity,
        image: formData.image,
      };

      await updateGiftPackage(selectedPackage._id, packageData);
      
      toast.success("Cập nhật gói quà thành công");
      setIsEditDialogOpen(false);
      resetForm();
      fetchPackages();
      onPackageUpdate?.();
    } catch (error: any) {
      console.error('Error updating package:', error);
      toast.error(error.message || "Không thể cập nhật gói quà");
    }
  };

  const handleDeletePackage = async (packageId: string) => {
    try {
      if (!confirm("Bạn có chắc chắn muốn xóa gói quà này?")) return;

      await deleteGiftPackage(packageId);
      
      toast.success("Xóa gói quà thành công");
      fetchPackages();
      onPackageUpdate?.();
    } catch (error: any) {
      console.error('Error deleting package:', error);
      toast.error(error.message || "Không thể xóa gói quà");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      items: [],
      quantity: 1,
      image: "",
    });
    setSelectedPackage(null);
  };

  const openEditDialog = (pkg: GiftPackage) => {
    setSelectedPackage(pkg);
    setFormData({
      name: pkg.name,
      description: pkg.description || "",
      items: pkg.items.map(item => ({
        giftItemId: typeof item.giftItemId === 'string' ? item.giftItemId : (item.giftItemId as GiftItem)._id,
        quantity: item.quantity
      })),
      quantity: pkg.quantity,
      image: pkg.image || "",
    });
    setIsEditDialogOpen(true);
  };

  const openViewDialog = (pkg: GiftPackage) => {
    setSelectedPackage(pkg);
    setIsViewDialogOpen(true);
  };

  const addItemToPackage = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { giftItemId: "", quantity: 1 }]
    }));
  };

  const removeItemFromPackage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const updatePackageItem = (index: number, field: 'giftItemId' | 'quantity', value: string | number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const getStatusBadge = useCallback((pkg: GiftPackage) => {
    if (!pkg.isActive) {
      return <Badge variant="secondary">Không hoạt động</Badge>;
    }
    if (pkg.availableQuantity === 0) {
      return <Badge variant="destructive">Hết hàng</Badge>;
    }
    if (pkg.availableQuantity < 10) {
      return <Badge variant="outline" className="border-orange-500 text-orange-600">Sắp hết</Badge>;
    }
    return <Badge variant="default" className="bg-green-100 text-green-800">Còn hàng</Badge>;
  }, []);

  const getGiftItemName = useCallback((itemId: string) => {
    const item = giftItems.find(gi => gi._id === itemId);
    return item ? item.name : 'Không xác định';
  }, [giftItems]);

  const getGiftItemFromPackageItem = useCallback((packageItem: PackageItem): string => {
    if (typeof packageItem.giftItemId === 'string') {
      return getGiftItemName(packageItem.giftItemId);
    } else {
      return (packageItem.giftItemId as GiftItem).name;
    }
  }, [getGiftItemName]);

  // Memoized search bar to prevent unnecessary re-renders
  const SearchBar = useMemo(() => (
    <div className="flex gap-4 mb-6">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Tìm kiếm gói quà theo tên..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      {searchTerm && (
        <Button
          variant="outline"
          onClick={() => setSearchTerm("")}
          size="sm"
        >
          Xóa bộ lọc
        </Button>
      )}
    </div>
  ), [searchTerm]);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Quản lý gói quà</CardTitle>
            <CardDescription>
              Tạo và quản lý các gói quà tặng cho người hiến máu
            </CardDescription>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="w-4 h-4 mr-2" />
                Tạo gói quà
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Tạo gói quà mới</DialogTitle>
                <DialogDescription>
                  Tạo một gói quà tặng mới cho người hiến máu
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Tên gói quà *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Nhập tên gói quà"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Mô tả</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Mô tả gói quà"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="quantity">Số lượng gói *</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      value={formData.quantity}
                      onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="image">URL hình ảnh</Label>
                  <Input
                    id="image"
                    value={formData.image}
                    onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex justify-between items-center">
                    <Label>Danh sách quà tặng *</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addItemToPackage}>
                      <Plus className="w-4 h-4 mr-1" />
                      Thêm quà
                    </Button>
                  </div>
                  {formData.items.map((item, index) => (
                    <div key={index} className="flex gap-2 items-end">
                      <div className="flex-1">
                        <Select
                          value={item.giftItemId}
                          onValueChange={(value) => updatePackageItem(index, 'giftItemId', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn quà tặng" />
                          </SelectTrigger>
                          <SelectContent>
                            {giftItems.map((giftItem) => (
                              <SelectItem key={giftItem._id} value={giftItem._id}>
                                {giftItem.name} ({giftItem.unit})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="w-20">
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updatePackageItem(index, 'quantity', parseInt(e.target.value) || 1)}
                          placeholder="SL"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeItemFromPackage(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  {formData.items.length === 0 && (
                    <div className="text-center py-4 text-muted-foreground">
                      Chưa có quà tặng nào. Nhấn "Thêm quà" để bắt đầu.
                    </div>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Hủy
                </Button>
                <Button onClick={handleCreatePackage}>
                  Tạo gói quà
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {SearchBar}

        <PackageList
          packages={packages}
          loading={loading}
          onEdit={openEditDialog}
          onView={openViewDialog}
          onDelete={handleDeletePackage}
          getStatusBadge={getStatusBadge}
          getGiftItemFromPackageItem={getGiftItemFromPackageItem}
        />

        {!loading && packages.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            {searchTerm ? 
              `Không tìm thấy gói quà nào với từ khóa "${searchTerm}"` : 
              "Chưa có gói quà nào. Tạo gói quà đầu tiên của bạn!"
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa gói quà</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin gói quà tặng cho người hiến máu
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            {/* Basic Information */}
            <div className="grid gap-4">
              <h3 className="text-lg font-medium">Thông tin cơ bản</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-name">Tên gói quà *</Label>
                  <Input
                    id="edit-name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Nhập tên gói quà"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-quantity">Số lượng gói *</Label>
                  <Input
                    id="edit-quantity"
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Mô tả</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Mô tả gói quà"
                  rows={3}
                />
              </div>
            </div>

            {/* Image Section */}
            <div className="grid gap-4">
              <h3 className="text-lg font-medium">Hình ảnh</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                <div className="grid gap-2">
                  <Label htmlFor="edit-image">URL hình ảnh</Label>
                  <Input
                    id="edit-image"
                    value={formData.image}
                    onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                {formData.image && (
                  <div className="flex justify-center md:justify-start">
                    <div className="grid gap-2">
                      <Label className="text-sm font-medium">Xem trước</Label>
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-24 h-24 rounded-lg object-cover border"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lzykzjypyie96a';
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleUpdatePackage}>
              Cập nhật gói quà
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-6">
            <DialogTitle className="text-2xl font-bold">Chi tiết gói quà</DialogTitle>
            <DialogDescription className="text-base text-muted-foreground">
              Xem thông tin chi tiết của gói quà tặng
            </DialogDescription>
          </DialogHeader>
          {selectedPackage && (
            <div className="space-y-6">
              {/* Header Section with Image and Basic Info */}
              <div className="flex flex-col md:flex-row gap-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border">
                {/* Package Image */}
                <div className="flex-shrink-0 flex justify-center md:justify-start">
                  <div className="relative">
                    <img
                      src={selectedPackage.image || 'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lzykzjypyie96a'}
                      alt={selectedPackage.name}
                      className="w-32 h-32 rounded-xl object-cover border-2 border-white shadow-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lzykzjypyie96a';
                      }}
                    />
                    <div className="absolute -top-2 -right-2">
                      {getStatusBadge(selectedPackage)}
                    </div>
                  </div>
                </div>
                
                {/* Basic Information */}
                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{selectedPackage.name}</h3>
                    {selectedPackage.description && (
                      <p className="text-gray-600 leading-relaxed">{selectedPackage.description}</p>
                    )}
                  </div>
                  
                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-3 border shadow-sm">
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Tổng số gói</div>
                      <div className="text-2xl font-bold text-blue-600 mt-1">{selectedPackage.quantity}</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 border shadow-sm">
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Còn lại</div>
                      <div className="text-2xl font-bold text-green-600 mt-1">{selectedPackage.availableQuantity}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Gift Items Section */}
              <div className="bg-white rounded-xl border p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Package className="w-5 h-5 mr-2 text-blue-600" />
                  Danh sách quà tặng
                </h4>
                <div className="grid gap-3">
                  {selectedPackage.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="font-medium text-gray-900">
                          {getGiftItemFromPackageItem(item)}
                        </span>
                      </div>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800 font-semibold">
                        x{item.quantity}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Metadata Section */}
              <div className="bg-white rounded-xl border p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Thông tin thời gian</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-500">Ngày tạo</div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-900">
                        {new Date(selectedPackage.createdAt).toLocaleDateString('vi-VN')}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(selectedPackage.createdAt).toLocaleTimeString('vi-VN', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-500">Cập nhật cuối</div>
                    <div className="flex flex-col">
                      {selectedPackage.updatedAt ? (
                        <>
                          <span className="font-semibold text-gray-900">
                            {new Date(selectedPackage.updatedAt).toLocaleDateString('vi-VN')}
                          </span>
                          <span className="text-sm text-gray-500">
                            {new Date(selectedPackage.updatedAt).toLocaleTimeString('vi-VN', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                        </>
                      ) : (
                        <span className="text-gray-400 italic">Chưa cập nhật</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="pt-6 border-t">
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)} className="px-6">
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
} 
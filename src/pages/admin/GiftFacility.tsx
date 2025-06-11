import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Plus, Gift, Edit, Trash2, Package, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  getGiftItems,
  createGiftItem,
  updateGiftItem,
  deleteGiftItem,
  GiftItem,
  CreateGiftItemData,
  UpdateGiftItemData,
  GiftStats,
} from "@/services/gift";
import { getGiftCategories, getGiftCategoryText, getGiftCategoryColor, getGiftUnitText, getGiftUnits } from "@/utils/changeText";
import { GiftStatsCards } from "@/components/gift/GiftStatsCards";

const GIFT_CATEGORIES = [
  "food",
  "clothing", 
  "healthcare",
  "electronics",
  "books",
  "toys",
  "other"
];

function GiftFacilityManagement() {
  const [giftItems, setGiftItems] = useState<GiftItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [limit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [stats, setStats] = useState<GiftStats | null>(null);
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedGiftItem, setSelectedGiftItem] = useState<GiftItem | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // Form data
  const [formData, setFormData] = useState<CreateGiftItemData>({
    name: "",
    description: "",
    image: "",
    unit: "item",
    category: "other",
    costPerUnit: 0,
  });

  useEffect(() => {
    fetchGiftItems();
  }, [currentPage, limit, selectedCategory]);

  const fetchGiftItems = async () => {
    setLoading(true);
    try {
      const response = await getGiftItems({ 
        page: currentPage, 
        limit,
        search: searchTerm || undefined,
        category: selectedCategory === "all" ? undefined : selectedCategory,
        isActive: true
      });
      
      console.log('API Response:', response); // Debug log
      
      // Use the correct response structure: response.data.data and response.data.metadata
      setGiftItems(response.data.data);
      setTotalPages(response.data.metadata.totalPages);
      setTotalItems(response.data.metadata.total);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching gift items:', err);
      setError(err.message || "Không thể tải danh sách quà tặng.");
      toast.error(err.message || "Không thể tải danh sách quà tặng.");
      setGiftItems([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchGiftItems();
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleCreateGiftItem = async () => {
    if (!formData.name.trim() || !formData.unit || !formData.category || formData.costPerUnit <= 0) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc.");
      return;
    }

    setFormLoading(true);
    try {
      await createGiftItem(formData);
      toast.success("Tạo quà tặng thành công!");
      setShowCreateModal(false);
      resetForm();
      fetchGiftItems();
    } catch (err: any) {
      toast.error(err.message || "Không thể tạo quà tặng.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditGiftItem = async () => {
    if (!selectedGiftItem || !formData.name.trim() || formData.costPerUnit <= 0) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc.");
      return;
    }

    setFormLoading(true);
    try {
      await updateGiftItem(selectedGiftItem._id, formData as UpdateGiftItemData);
      toast.success("Cập nhật quà tặng thành công!");
      setShowEditModal(false);
      resetForm();
      fetchGiftItems();
    } catch (err: any) {
      toast.error(err.message || "Không thể cập nhật quà tặng.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteGiftItem = async () => {
    if (!selectedGiftItem) return;

    setFormLoading(true);
    try {
      await deleteGiftItem(selectedGiftItem._id);
      toast.success("Xóa quà tặng thành công!");
      setShowDeleteModal(false);
      fetchGiftItems();
    } catch (err: any) {
      toast.error(err.message || "Không thể xóa quà tặng.");
    } finally {
      setFormLoading(false);
    }
  };

  const openCreateModal = () => {
    resetForm();
    setShowCreateModal(true);
  };

  const openEditModal = (giftItem: GiftItem) => {
    setSelectedGiftItem(giftItem);
    setFormData({
      name: giftItem.name,
      description: giftItem.description || "",
      image: giftItem.image || "",
      unit: giftItem.unit,
      category: giftItem.category,
      costPerUnit: giftItem.costPerUnit,
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (giftItem: GiftItem) => {
    setSelectedGiftItem(giftItem);
    setShowDeleteModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      image: "",
      unit: "item",
      category: "other",
      costPerUnit: 0,
    });
    setSelectedGiftItem(null);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND' 
    }).format(amount);
  };

  // Add safety checks for array operations
  const safeGiftItems = Array.isArray(giftItems) ? giftItems : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-full">
              <Gift className="h-8 w-8 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Quản lý đơn vị quà tặng
              </h1>
              <p className="text-gray-600 mt-1">
                Quản lý các đơn vị quà tặng trong hệ thống
              </p>
            </div>
          </div>
          <Button 
            onClick={openCreateModal}
            className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg"
          >
            <Plus className="mr-2 h-4 w-4" />
            Thêm quà tặng
          </Button>
        </div>

        {/* Stats Cards */}
        <GiftStatsCards onStatsUpdate={setStats} />

        {/* Main Content */}
        <Card className="shadow-xl border-0 py-0">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
            <CardTitle className="text-xl font-semibold flex items-center gap-2 py-4">
              <Package className="h-5 w-5" />
              Danh sách quà tặng
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {/* Search */}
            <div className="flex gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Tìm kiếm theo tên quà tặng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 text-base border-2 focus:border-purple-300"
                />
              </div>
              <Select value={selectedCategory} onValueChange={handleCategoryFilter}>
                <SelectTrigger className="w-48 h-12">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Tất cả danh mục" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả danh mục</SelectItem>
                  {getGiftCategories().map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                onClick={handleSearch}
                className="bg-purple-600 hover:bg-purple-700 text-white h-12 px-6"
              >
                Tìm kiếm
              </Button>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="text-lg text-gray-600">Đang tải...</div>
              </div>
            ) : error ? (
              <div className="flex justify-center items-center h-64">
                <div className="text-lg text-red-600">{error}</div>
              </div>
            ) : (
              <>
                {/* Table */}
                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="font-semibold text-gray-700">
                          Thông tin quà tặng
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700">
                          Danh mục
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700">
                          Đơn vị
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700">
                          Giá trị
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700">
                          Trạng thái
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700">
                          Ngày tạo
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700">
                          Hành động
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {safeGiftItems.map((giftItem) => (
                        <TableRow
                          key={giftItem._id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              {giftItem.image ? (
                                <img
                                  src={giftItem.image}
                                  alt={giftItem.name}
                                  className="h-10 w-10 rounded-lg object-cover"
                                />
                              ) : (
                                <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                                  <Gift className="h-5 w-5 text-purple-600" />
                                </div>
                              )}
                              <div>
                                <div className="font-medium text-gray-900">
                                  {giftItem.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {giftItem.description || "Không có mô tả"}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={`font-semibold ${getGiftCategoryColor(giftItem.category)}`}
                            >
                              {getGiftCategoryText(giftItem.category)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm text-gray-900">
                              {getGiftUnitText(giftItem.unit)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm font-medium text-gray-900">
                              {formatCurrency(giftItem.costPerUnit)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={`font-medium ${
                                giftItem.isActive
                                  ? "bg-green-100 text-green-800 border-green-200"
                                  : "bg-red-100 text-red-800 border-red-200"
                              }`}
                            >
                              {giftItem.isActive ? "Hoạt động" : "Không hoạt động"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm text-gray-900">
                              {new Date(giftItem.createdAt).toLocaleDateString('vi-VN')}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openEditModal(giftItem)}
                                className="hover:bg-blue-50 hover:border-blue-300"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openDeleteModal(giftItem)}
                                className="hover:bg-red-50 hover:border-red-300 text-red-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between px-6 py-4 border-t">
                  <div className="text-sm text-gray-600">
                    Hiển thị {(currentPage - 1) * limit + 1} đến{" "}
                    {Math.min(currentPage * limit, totalItems)} trong số {totalItems}{" "}
                    mục
                  </div>
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => handlePageChange(currentPage - 1)}
                          className={`cursor-pointer hover:bg-gray-100 transition-colors ${
                            currentPage === 1
                              ? "pointer-events-none opacity-50"
                              : ""
                          }`}
                        />
                      </PaginationItem>

                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(
                          (page) =>
                            page === 1 ||
                            page === totalPages ||
                            (page >= currentPage - 1 && page <= currentPage + 1)
                        )
                        .map((page, index, array) => (
                          <React.Fragment key={page}>
                            {index > 0 && array[index - 1] !== page - 1 && (
                              <PaginationItem>
                                <PaginationEllipsis className="cursor-default" />
                              </PaginationItem>
                            )}
                            <PaginationItem>
                              <PaginationLink
                                onClick={() => handlePageChange(page)}
                                isActive={currentPage === page}
                                className={`cursor-pointer hover:bg-gray-100 transition-colors ${
                                  currentPage === page
                                    ? "bg-purple-600 text-white"
                                    : ""
                                }`}
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          </React.Fragment>
                        ))}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() => handlePageChange(currentPage + 1)}
                          className={`cursor-pointer hover:bg-gray-100 transition-colors ${
                            currentPage === totalPages
                              ? "pointer-events-none opacity-50"
                              : ""
                          }`}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Create Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Thêm quà tặng mới</DialogTitle>
            <DialogDescription>
              Điền thông tin để tạo quà tặng mới trong hệ thống.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="name">Tên quà tặng *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nhập tên quà tặng..."
              />
            </div>
            <div>
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Nhập mô tả quà tặng..."
              />
            </div>
            <div>
              <Label htmlFor="image">URL hình ảnh</Label>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="Nhập URL hình ảnh..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Danh mục *</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    {getGiftCategories().map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="unit">Đơn vị *</Label>
                <Select 
                  value={formData.unit} 
                  onValueChange={(value) => setFormData({ ...formData, unit: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn đơn vị" />
                  </SelectTrigger>
                  <SelectContent>
                    {getGiftUnits().map((unit) => (
                      <SelectItem key={unit.value} value={unit.value}>
                        {unit.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="costPerUnit">Giá trị mỗi đơn vị (VND) *</Label>
              <Input
                id="costPerUnit"
                type="number"
                min="0"
                step="1000"
                value={formData.costPerUnit}
                onChange={(e) => setFormData({ ...formData, costPerUnit: parseInt(e.target.value) || 0 })}
                placeholder="Nhập giá trị..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCreateModal(false)}
              disabled={formLoading}
            >
              Hủy
            </Button>
            <Button
              onClick={handleCreateGiftItem}
              disabled={formLoading}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {formLoading ? "Đang tạo..." : "Tạo quà tặng"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa quà tặng</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin quà tặng.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="edit-name">Tên quà tặng *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nhập tên quà tặng..."
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Mô tả</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Nhập mô tả quà tặng..."
              />
            </div>
            <div>
              <Label htmlFor="edit-image">URL hình ảnh</Label>
              <Input
                id="edit-image"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="Nhập URL hình ảnh..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-category">Danh mục *</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    {getGiftCategories().map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-unit">Đơn vị *</Label>
                <Select 
                  value={formData.unit} 
                  onValueChange={(value) => setFormData({ ...formData, unit: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn đơn vị" />
                  </SelectTrigger>
                  <SelectContent>
                    {getGiftUnits().map((unit) => (
                      <SelectItem key={unit.value} value={unit.value}>
                        {unit.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="edit-costPerUnit">Giá trị mỗi đơn vị (VND) *</Label>
              <Input
                id="edit-costPerUnit"
                type="number"
                min="0"
                step="1000"
                value={formData.costPerUnit}
                onChange={(e) => setFormData({ ...formData, costPerUnit: parseInt(e.target.value) || 0 })}
                placeholder="Nhập giá trị..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowEditModal(false)}
              disabled={formLoading}
            >
              Hủy
            </Button>
            <Button
              onClick={handleEditGiftItem}
              disabled={formLoading}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {formLoading ? "Đang cập nhật..." : "Cập nhật"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-600">Xác nhận xóa</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa quà tặng "{selectedGiftItem?.name}" không? 
              Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
              disabled={formLoading}
            >
              Hủy
            </Button>
            <Button
              onClick={handleDeleteGiftItem}
              disabled={formLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {formLoading ? "Đang xóa..." : "Xóa"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default GiftFacilityManagement;
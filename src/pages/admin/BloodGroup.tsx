"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogOverlay,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Search,
  Edit,
  Plus,
  Droplets,
  AlertTriangle,
  Calendar,
  RefreshCw,
  X,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  getBloodGroups,
  createBloodGroup,
  updateBloodGroup,
  BloodGroup,
  BloodGroupInput,
} from "../../services/bloodGroup/blood-group";

// Custom CSS để đảm bảo overlay có màu mong muốn
const customStyles = `
  [data-radix-portal] .custom-overlay {
    background-color: rgba(254, 242, 242, 0.5) !important; /* red-50/50 */
    position: fixed;
    inset: 0;
    z-index: 50;
    backdrop-filter: blur(2px);
  }
`;

function BloodGroupManagement() {
  const [bloodGroups, setBloodGroups] = useState<BloodGroup[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<BloodGroup | null>(null);
  const [formData, setFormData] = useState<BloodGroupInput>({
    name: "",
    note: "",
    characteristics: [],
    populationRate: 0,
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const VALID_BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  useEffect(() => {
    const fetchBloodGroups = async () => {
      setLoading(true);
      try {
        const data = await getBloodGroups();
        setBloodGroups(data);
      } catch (err: any) {
        setError(err.message || "Không thể tải danh sách nhóm máu");
      } finally {
        setLoading(false);
      }
    };
    fetchBloodGroups();
  }, []);

  const validateCharacteristics = (chars: string[]) => {
    const totalLength = chars.join(", ").length;
    return totalLength <= 600000;
  };

  const validateForm = () => {
    if (!VALID_BLOOD_TYPES.includes(formData.name)) {
      setFormError(
        "Nhóm máu phải là một trong: A+, A-, B+, B-, AB+, AB-, O+, O-"
      );
      return false;
    }
    if (formData.populationRate < 0 || formData.populationRate > 100) {
      setFormError("Tỷ lệ dân số phải từ 0 đến 100");
      return false;
    }
    setFormError(null);
    return true;
  };

  const handleAddBloodGroup = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const newGroup = await createBloodGroup(formData);
      setBloodGroups([...bloodGroups, newGroup]);
      setIsAddOpen(false);
      setFormData({
        name: "",
        note: "",
        characteristics: [],
        populationRate: 0,
      });
    } catch (err: any) {
      setError(err.message || "Không thể thêm nhóm máu");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateBloodGroup = async () => {
    if (!selectedGroup || !validateForm()) return;
    setIsSubmitting(true);
    try {
      const updatedGroup = await updateBloodGroup(selectedGroup._id, formData);
      setBloodGroups(
        bloodGroups.map((group) =>
          group._id === selectedGroup._id ? updatedGroup : group
        )
      );
      setIsDetailOpen(false);
      setFormData({
        name: "",
        note: "",
        characteristics: [],
        populationRate: 0,
      });
      setSelectedGroup(null);
    } catch (err: any) {
      setError(err.message || "Không thể cập nhật nhóm máu");
    } finally {
      setIsSubmitting(false);
    }
  };

  const truncateCharacteristics = (chars: string[]) => {
    const text = chars.join(", ");
    if (text.length > 30) {
      return text.slice(0, 27) + "...";
    }
    return text;
  };

  const filteredBloodGroups = bloodGroups.filter(
    (group) =>
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (group.note?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
  );

  const getStatusColor = (inventory: number, capacity: number) => {
    const percentage = (inventory / capacity) * 100;
    if (percentage >= 70) return "bg-green-100 text-green-800 border-green-200";
    if (percentage >= 30)
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-red-100 text-red-800 border-red-200";
  };

  const getBloodTypeColor = (bloodType: string) => {
    const colors = {
      "A+": "bg-blue-100 text-blue-800 border-blue-200",
      "A-": "bg-blue-200 text-blue-900 border-blue-300",
      "B+": "bg-green-100 text-green-800 border-green-200",
      "B-": "bg-green-200 text-green-900 border-green-300",
      "AB+": "bg-purple-100 text-purple-800 border-purple-200",
      "AB-": "bg-purple-200 text-purple-900 border-purple-300",
      "O+": "bg-red-100 text-red-800 border-red-200",
      "O-": "bg-red-200 text-red-900 border-red-300",
    };
    return (
      colors[bloodType as keyof typeof colors] ||
      "bg-gray-100 text-gray-800 border-gray-200"
    );
  };

  const getInventoryPercentage = (current: number, capacity: number) => {
    return Math.round((current / capacity) * 100);
  };

  const totalInventory = bloodGroups.reduce(
    (sum, group) => sum + (group.populationRate || 0),
    0
  );
  const criticalGroups = bloodGroups.filter(
    (group) => getInventoryPercentage(group.populationRate || 0, 100) < 10
  );

  const handleAddOpen = (open: boolean) => {
    setIsAddOpen(open);
    if (open) {
      setIsDetailOpen(false);
      setFormData({
        name: "",
        note: "",
        characteristics: [],
        populationRate: 0,
      });
      setFormError(null);
    }
  };

  const handleDetailOpen = (open: boolean) => {
    setIsDetailOpen(open);
    if (open) {
      setIsAddOpen(false);
    } else {
      setSelectedGroup(null);
      setFormData({
        name: "",
        note: "",
        characteristics: [],
        populationRate: 0,
      });
      setFormError(null);
    }
  };

  return (
    <div>
      <style>{customStyles}</style>
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-100 rounded-full">
                <Droplets className="h-8 w-8 text-red-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Quản Lý Nhóm Máu
                </h1>
                <p className="text-gray-600 mt-1">
                  Theo dõi kho máu và mức độ cung ứng
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Dialog open={isAddOpen} onOpenChange={handleAddOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-red-600 hover:bg-red-700 text-white shadow-lg">
                    <Plus className="mr-2 h-4 w-4" />
                    Thêm Nhóm Máu
                  </Button>
                </DialogTrigger>
                <DialogOverlay className="custom-overlay" />
                <DialogContent className="bg-white rounded-lg shadow-xl border border-red-100">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-gray-900">
                      Thêm Nhóm Máu Mới
                    </DialogTitle>
                    <DialogDescription className="text-sm text-gray-500">
                      Thêm một nhóm máu mới vào hệ thống kho máu.
                    </DialogDescription>
                    <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100">
                      <X className="h-4 w-4" />
                      <span className="sr-only">Đóng</span>
                    </DialogClose>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    {formError && (
                      <Alert className="border-red-200 bg-red-50">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        <AlertDescription className="text-red-800">
                          {formError}
                        </AlertDescription>
                      </Alert>
                    )}
                    <div className="grid gap-2">
                      <Label htmlFor="name" className="text-gray-700">
                        Nhóm Máu
                      </Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            name: e.target.value.toUpperCase(),
                          })
                        }
                        placeholder="Ví dụ: A+, O-"
                        className="border-red-200 focus:border-red-400 focus:ring-red-400"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="note" className="text-gray-700">
                        Ghi Chú
                      </Label>
                      <Input
                        id="note"
                        value={formData.note}
                        onChange={(e) =>
                          setFormData({ ...formData, note: e.target.value })
                        }
                        placeholder="Nhập ghi chú"
                        className="border-red-200 focus:border-red-400 focus:ring-red-400"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label
                        htmlFor="characteristics"
                        className="text-gray-700"
                      >
                        Đặc Điểm
                      </Label>
                      <Input
                        id="characteristics"
                        value={formData.characteristics.join(", ")}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            characteristics: e.target.value
                              .split(",")
                              .map((item) => item.trim()),
                          })
                        }
                        placeholder="Ví dụ: Người hiến máu toàn cầu, Tương thích với AB+"
                        className="border-red-200 focus:border-red-400 focus:ring-red-400"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="populationRate" className="text-gray-700">
                        Tỷ Lệ Dân Số (%)
                      </Label>
                      <Input
                        id="populationRate"
                        type="number"
                        min="0"
                        max="100"
                        value={formData.populationRate}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            populationRate: Number(e.target.value),
                          })
                        }
                        placeholder="Ví dụ: 30"
                        className="border-red-200 focus:border-red-400 focus:ring-red-400"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline" className="border-gray-300">
                        Hủy
                      </Button>
                    </DialogClose>
                    <Button
                      className="bg-red-600 hover:bg-red-700 text-white"
                      onClick={handleAddBloodGroup}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      ) : null}
                      Lưu
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {error && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {criticalGroups.length > 0 && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <strong>Cảnh Báo Nguồn Cung Thiếu Hụt:</strong>{" "}
                {criticalGroups.map((group) => group.name).join(", ")} đang ở
                mức rất thấp. Cần hành động ngay.
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="border-l-4 border-l-red-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Tổng Kho Máu
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {totalInventory.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">đơn vị</p>
                  </div>
                  <Droplets className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Tổng Số Loại Máu
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {bloodGroups.length}
                    </p>
                    <p className="text-xs text-gray-500">loại</p>
                  </div>
                  <Droplets className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-xl border-0 py-0">
            <CardHeader className="bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-t-lg">
              <CardTitle className="text-xl font-semibold flex items-center gap-2 py-4">
                <Droplets className="h-5 w-5" />
                Kho Nhóm Máu
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Tìm kiếm nhóm máu theo loại hoặc ghi chú..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 text-base border-2 focus:border-red-300 border-red-200"
                />
              </div>

              <div className="rounded-lg border overflow-hidden  ">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-semibold text-gray-700">
                        Nhóm Máu
                      </TableHead>
                      <TableHead className="font-semibold text-gray-700">
                        Trạng Thái Kho
                      </TableHead>
                      <TableHead className="font-semibold text-gray-700 max-w-[150px]">
                        Đặc Điểm
                      </TableHead>
                      <TableHead className="font-semibold text-gray-700">
                        Cập Nhật Lần Cuối
                      </TableHead>
                      <TableHead className="font-semibold text-gray-700">
                        Trạng Thái
                      </TableHead>
                      <TableHead className="font-semibold text-gray-700">
                        Hành Động
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBloodGroups.map((group) => (
                      <TableRow
                        key={group._id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-pink-600 text-white font-bold text-lg">
                              {group.name}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">
                                Nhóm {group.name}
                              </div>
                              <Badge
                                variant="outline"
                                className={`text-xs ${getBloodTypeColor(
                                  group.name
                                )}`}
                              >
                                {group.name === "O-"
                                  ? "Người Hiến Máu Toàn Cầu"
                                  : `Tương Thích: ${group.characteristics.length}`}
                              </Badge>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="font-medium">
                                {group.populationRate} %
                              </span>
                              <span className="text-gray-500">/ 100</span>
                            </div>
                            <Progress
                              value={group.populationRate}
                              className="h-2"
                            />
                            <div className="text-xs text-gray-500">
                              {group.populationRate}% dung lượng
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-[150px]">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="text-sm text-gray-600 truncate">
                                  {truncateCharacteristics(
                                    group.characteristics
                                  )}
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{group.characteristics.join(", ")}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="h-3 w-3 text-gray-400" />
                              <span className="text-gray-600">
                                Cập nhật:{" "}
                                {new Date(group.updatedAt).toLocaleDateString(
                                  "vi-VN"
                                )}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`font-medium ${getStatusColor(
                              group.populationRate,
                              100
                            )}`}
                          >
                            {group.populationRate >= 70
                              ? "Đủ"
                              : group.populationRate >= 30
                              ? "Thấp"
                              : "Nguy Kịch"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Dialog
                            open={isDetailOpen}
                            onOpenChange={handleDetailOpen}
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="hover:bg-blue-50 hover:border-blue-300"
                                onClick={() => {
                                  setSelectedGroup(group);
                                  setFormData({
                                    name: group.name,
                                    note: group.note,
                                    characteristics: group.characteristics,
                                    populationRate: group.populationRate,
                                  });
                                  setIsDetailOpen(true);
                                  setIsAddOpen(false);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                                Cập Nhật
                              </Button>
                            </DialogTrigger>
                            <DialogOverlay className="custom-overlay" />
                            <DialogContent className="bg-white rounded-lg shadow-xl border border-red-100">
                              <DialogHeader>
                                <DialogTitle className="text-xl font-semibold text-gray-900">
                                  Cập Nhật Nhóm Máu
                                </DialogTitle>
                                <DialogDescription className="text-sm text-gray-500">
                                  Cập nhật thông tin của một nhóm máu hiện có.
                                </DialogDescription>
                                <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70">
                                  <X className="h-4 w-4" />
                                  <span className="sr-only">Đóng</span>
                                </DialogClose>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                {formError && (
                                  <Alert className="border-red-200 bg-red-50">
                                    <AlertTriangle className="h-4 w-4 text-red-600" />
                                    <AlertDescription className="text-red-800">
                                      {formError}
                                    </AlertDescription>
                                  </Alert>
                                )}
                                <div className="grid gap-2">
                                  <Label
                                    htmlFor="name"
                                    className="text-gray-700"
                                  >
                                    Nhóm Máu
                                  </Label>
                                  <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) =>
                                      setFormData({
                                        ...formData,
                                        name: e.target.value.toUpperCase(),
                                      })
                                    }
                                    placeholder="Ví dụ: A+, O-"
                                    className="border-red-200 focus:border-red-400 focus:ring-red-400"
                                  />
                                </div>
                                <div className="grid gap-2">
                                  <Label
                                    htmlFor="note"
                                    className="text-gray-700"
                                  >
                                    Ghi Chú
                                  </Label>
                                  <Input
                                    id="note"
                                    value={formData.note}
                                    onChange={(e) =>
                                      setFormData({
                                        ...formData,
                                        note: e.target.value,
                                      })
                                    }
                                    placeholder="Nhập ghi chú"
                                    className="border-red-200 focus:border-red-400 focus:ring-red-400"
                                  />
                                </div>
                                <div className="grid gap-2">
                                  <Label
                                    htmlFor="characteristics"
                                    className="text-gray-700"
                                  >
                                    Đặc Điểm
                                  </Label>
                                  <Input
                                    id="characteristics"
                                    value={formData.characteristics.join(", ")}
                                    onChange={(e) =>
                                      setFormData({
                                        ...formData,
                                        characteristics: e.target.value
                                          .split(",")
                                          .map((item) => item.trim()),
                                      })
                                    }
                                    placeholder="Ví dụ: Người hiến máu toàn cầu, Tương thích với AB+"
                                    className="border-red-200 focus:border-red-400 focus:ring-red-400"
                                  />
                                </div>
                                <div className="grid gap-2">
                                  <Label
                                    htmlFor="populationRate"
                                    className="text-gray-700"
                                  >
                                    Tỷ Lệ Dân Số (%)
                                  </Label>
                                  <Input
                                    id="populationRate"
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={formData.populationRate}
                                    onChange={(e) =>
                                      setFormData({
                                        ...formData,
                                        populationRate: Number(e.target.value),
                                      })
                                    }
                                    placeholder="Ví dụ: 30"
                                    className="border-red-200 focus:border-red-400 focus:ring-red-400"
                                  />
                                </div>
                              </div>
                              <DialogFooter>
                                <DialogClose asChild>
                                  <Button
                                    variant="outline"
                                    className="border-gray-300"
                                  >
                                    Hủy
                                  </Button>
                                </DialogClose>
                                <Button
                                  className="bg-red-600 hover:bg-red-700 text-white"
                                  onClick={handleUpdateBloodGroup}
                                  disabled={isSubmitting}
                                >
                                  {isSubmitting ? (
                                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                  ) : null}
                                  Cập Nhật
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {filteredBloodGroups.length === 0 && (
                <div className="text-center py-12">
                  <Droplets className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Không tìm thấy nhóm máu
                  </h3>
                  <p className="text-gray-500">
                    Không có nhóm máu nào khớp với tiêu chí tìm kiếm. Hãy thử
                    điều chỉnh từ khóa.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default BloodGroupManagement;

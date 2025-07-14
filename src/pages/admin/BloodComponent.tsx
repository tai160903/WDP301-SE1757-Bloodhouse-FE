"use client";

import { useState, useEffect, useRef } from "react";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import {
  Search,
  Edit,
  Plus,
  AlertTriangle,
  FlaskRoundIcon as Flask,
  Calendar,
  RefreshCw,
  X,
} from "lucide-react";
import {
  getBloodComponents,
  createBloodComponent,
  updateBloodComponent,
  BloodComponent,
} from "../../services/bloodComponent/blood-component";

function BloodComponentManagement() {
  const [components, setComponents] = useState<BloodComponent[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState<BloodComponent | null>(null);
  const [formData, setFormData] = useState<{ name: string }>({ name: "" });
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const nameInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const fetchComponents = async () => {
      setLoading(true);
      try {
        const data = await getBloodComponents();
        setComponents(data);
      } catch (err: any) {
        setError(err.message || "Không thể tải danh sách thành phần máu.");
      } finally {
        setLoading(false);
      }
    };
    fetchComponents();
  }, []);

  const filteredComponents = components.filter((component) =>
    component.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddComponent = async () => {
    if (!formData.name.trim()) {
      setFormError("Tên thành phần máu là bắt buộc.");
      return;
    }
    setIsSubmitting(true);
    try {
      const newComponent = await createBloodComponent({ name: formData.name });
      setComponents([...components, newComponent]);
      setIsAddOpen(false);
      setFormData({ name: "" });
      setFormError(null);
    } catch (err: any) {
      setError(err.message || "Không thể thêm thành phần máu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateComponent = async () => {
    if (!selectedComponent || !formData.name.trim()) {
      setFormError("Tên thành phần máu là bắt buộc.");
      return;
    }
    setIsSubmitting(true);
    try {
      const updatedComponent = await updateBloodComponent(selectedComponent._id, {
        name: formData.name,
      });
      setComponents(
        components.map((comp) =>
          comp._id === selectedComponent._id ? updatedComponent : comp
        )
      );
      setIsEditOpen(false);
      setSelectedComponent(null);
      setFormData({ name: "" });
      setFormError(null);
    } catch (err: any) {
      setError(err.message || "Không thể cập nhật thành phần máu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getComponentAgeStatus = (updatedAt: string) => {
    const updatedDate = new Date(updatedAt);
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate.getTime() - updatedDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 7) return { text: "Mới cập nhật", color: "text-green-600" };
    if (diffDays <= 30) return { text: "Tương đối cũ", color: "text-yellow-600" };
    return { text: "Cần cập nhật", color: "text-red-600" };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Tiêu đề */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-full">
              <Flask className="h-8 w-8 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Quản lý Thành phần Máu
              </h1>
              <p className="text-gray-600 mt-1">
                Theo dõi các thành phần máu và điều kiện lưu trữ
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg"
              onClick={() => setIsAddOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Thêm Thành phần
            </Button>
          </div>
        </div>

        {loading && (
          <Alert className="mb-6 border-purple-200 bg-purple-50">
            <AlertDescription className="text-purple-800">
              Đang tải thành phần...
            </AlertDescription>
          </Alert>
        )}
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        {/* Thống kê */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Số loại Thành phần
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {components.length}
                  </p>
                </div>
                <Flask className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Modal Thêm Thành phần */}
        {isAddOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">
                  Thêm Thành phần Mới
                </h2>
                <button
                  onClick={() => setIsAddOpen(false)}
                  className="rounded-sm opacity-70 hover:opacity-100"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Đóng</span>
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Thêm một thành phần máu mới vào kho.
              </p>
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
                    Tên Thành phần
                  </Label>
                  <Input
                    id="name"
                    ref={nameInputRef}
                    autoFocus
                    value={formData.name}
                    onChange={(e) => setFormData({ name: e.target.value })}
                    placeholder="VD: Hồng cầu"
                    className="border-gray-300 focus:border-purple-400"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button
                  variant="outline"
                  className="border-gray-300"
                  onClick={() => setIsAddOpen(false)}
                >
                  Hủy
                </Button>
                <Button
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                  onClick={handleAddComponent}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Lưu
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Cập nhật Thành phần */}
        {isEditOpen && selectedComponent && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">
                  Cập nhật Thành phần
                </h2>
                <button
                  onClick={() => {
                    setIsEditOpen(false);
                    setSelectedComponent(null);
                    setFormData({ name: "" });
                    setFormError(null);
                  }}
                  className="rounded-sm opacity-70 hover:opacity-100"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Đóng</span>
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Cập nhật thông tin thành phần máu.
              </p>
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
                  <Label htmlFor="name-update" className="text-gray-700">
                    Tên Thành phần
                  </Label>
                  <Input
                    id="name-update"
                    ref={nameInputRef}
                    autoFocus
                    value={formData.name}
                    onChange={(e) => setFormData({ name: e.target.value })}
                    placeholder="VD: Hồng cầu"
                    className="border-gray-300 focus:border-purple-400"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button
                  variant="outline"
                  className="border-gray-300"
                  onClick={() => {
                    setIsEditOpen(false);
                    setSelectedComponent(null);
                    setFormData({ name: "" });
                    setFormError(null);
                  }}
                >
                  Hủy
                </Button>
                <Button
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                  onClick={handleUpdateComponent}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Cập nhật
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Nội dung Chính */}
        <Card className="shadow-xl border-0 py-0">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
            <CardTitle className="text-xl font-semibold flex items-center gap-2 py-4">
              <Flask className="h-5 w-5" />
              Danh sách Thành phần
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {/* Tìm kiếm */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Tìm kiếm thành phần theo tên..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 text-base border-2 focus:border-purple-300"
              />
            </div>

            {/* Bảng */}
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold text-gray-700">
                      Thông tin Thành phần
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      Cập nhật Gần nhất
                    </TableHead>
                    {/* <TableHead className="font-semibold text-gray-700">
                      Trạng thái
                    </TableHead> */}
                    <TableHead className="font-semibold text-gray-700">
                      Hành động
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredComponents.map((component) => {
                    const status = getComponentAgeStatus(component.updatedAt);
                    return (
                      <TableRow
                        key={component._id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 text-white">
                              <Flask className="h-6 w-6" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">
                                {component.name}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-3 w-3 text-gray-400" />
                            <span className="text-gray-600">
                              {new Date(component.updatedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </TableCell>
                        {/* <TableCell>
                          <span className={`font-medium ${status.color}`}>
                            {status.text}
                          </span>
                        </TableCell> */}
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="hover:bg-blue-50 hover:border-blue-300"
                              onClick={() => {
                                setSelectedComponent(component);
                                setFormData({ name: component.name });
                                setIsEditOpen(true);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                              Cập nhật
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {filteredComponents.length === 0 && !loading && (
              <div className="text-center py-12">
                <Flask className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Không tìm thấy thành phần máu
                </h3>
                <p className="text-gray-500">
                  Không có thành phần máu nào khớp với tiêu chí tìm kiếm. Hãy thử
                  điều chỉnh từ khóa tìm kiếm.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default BloodComponentManagement;
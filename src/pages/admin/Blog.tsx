"use client";

import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Edit, Trash2, Plus, Calendar, BookOpen, Heart, Eye } from "lucide-react";
import { getAll, Blog } from "../../services/blog/index";

// Updated Blog interface with optional fields
interface Blog {
  _id: string;
  title?: string;
  authorId?: { fullName?: string };
  categoryId?: { name?: string };
  createdAt?: string;
  status?: string;
  summary?: string;
  content?: string;
}

function BlogManagement() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await getAll();
        const data = response.data;
        console.log(data)
        // Ensure data is an array and filter out invalid entries
        const validBlogs = Array.isArray(data)
          ? data.filter((blog: Blog) => blog._id ) // Filter out blogs without _id or authorId.fullName
          : [];

        setBlogs(validBlogs);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        setFeedback({ type: "error", message: "Không thể tải danh sách bài viết. Vui lòng thử lại." });
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa bài viết này? Hành động này không thể hoàn tác.")) {
      return;
    }
    setActionLoading(true);
    setFeedback(null);
    try {
      await remove(id);
      setBlogs(blogs.filter((blog) => blog._id !== id));
      setFeedback({ type: "success", message: "Xóa bài viết thành công!" });
    } catch (error) {
      console.error("Error deleting blog:", error);
      setFeedback({ type: "error", message: "Không thể xóa bài viết." });
    } finally {
      setActionLoading(false);
    }
  };

  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) =>
      [
        blog.title?.toLowerCase(),
        blog.authorId?.fullName?.toLowerCase(),
        blog.categoryId?.name?.toLowerCase(),
        ...(blog.tags?.map((tag) => tag.toLowerCase()) || []),
      ]
        .filter(Boolean)
        .some((value) => value?.includes(searchTerm.toLowerCase()))
    );
  }, [blogs, searchTerm]);

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800 border-green-200";
      case "draft":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "archived":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case "Health Education":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Medical":
        return "bg-red-100 text-red-800 border-red-200";
      case "Awareness":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Stories":
        return "bg-pink-100 text-pink-800 border-pink-200";
      case "Guide":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return "N/A";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2); // Limit to 2 characters
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-100 rounded-full">
              <BookOpen className="h-8 w-8 text-orange-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Quản lý bài viết</h1>
              <p className="text-gray-600 mt-1">Tạo và quản lý nội dung giáo dục</p>
            </div>
          </div>
          <Button
            onClick={() => navigate("/admin/blogs/create")}
            className="bg-orange-600 hover:bg-orange-700 text-white shadow-lg"
            disabled={actionLoading}
            aria-label="Tạo bài viết mới"
          >
            <Plus className="mr-2 h-4 w-4" />
            Tạo bài viết mới
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tổng số bài viết</p>
                  <p className="text-2xl font-bold text-gray-900">{blogs.length}</p>
                </div>
                <BookOpen className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-t-lg">
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Thư viện nội dung
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Tìm kiếm bài viết theo tiêu đề, tác giả, danh mục hoặc thẻ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 text-base border-2 focus:border-orange-300"
                aria-label="Tìm kiếm bài viết"
              />
            </div>

            {feedback && (
              <div className={`mb-4 text-sm ${feedback.type === "success" ? "text-green-600" : "text-red-600"}`}>
                {feedback.message}
              </div>
            )}

            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold text-gray-700 w-[30%]">Thông tin bài viết</TableHead>
                    <TableHead className="font-semibold text-gray-700 w-[25%]">Tác giả & Danh mục</TableHead>
                    <TableHead className="font-semibold text-gray-700 w-[15%]">Ngày xuất bản</TableHead>
                    <TableHead className="font-semibold text-gray-700 w-[15%]">Trạng thái</TableHead>
                    <TableHead className="font-semibold text-gray-700 w-[15%]">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-12">
                        Đang tải...
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredBlogs.map((blog) => (
                      <TableRow key={blog._id} className="hover:bg-gray-50 transition-colors">
                        <TableCell className="truncate">
                          <div className="space-y-2 max-w-[300px]">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium text-gray-900 truncate">
                                {blog.title && blog.title.length > 1 ? `${blog.title.slice(0, 47)}...` : blog.title || "Không có tiêu đề"}
                              </h3>
                            
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-2">{blog.summary || "Không có tóm tắt"}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-gradient-to-br from-orange-500 to-red-600 text-white text-xs font-semibold">
                                  {getInitials(blog.authorId?.fullName)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm font-medium text-gray-900">
                                {blog.authorId?.fullName || "Không xác định"}
                              </span>
                            </div>
                            <Badge
                              variant="outline"
                              className={`text-xs ${getCategoryColor(blog.categoryId?.name)}`}
                            >
                              {blog.categoryId?.name || "Không xác định"}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="h-3 w-3" />
                            <span>
                              {blog.createdAt
                                ? new Date(blog.createdAt).toLocaleDateString("vi-VN")
                                : "N/A"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`font-medium ${getStatusColor(blog.status)}`}>
                            {blog.status === "published"
                              ? "Đã xuất bản"
                              : blog.status === "draft"
                              ? "Bản nháp"
                              : blog.status === "archived"
                              ? "Lưu trữ"
                              : "Không xác định"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="hover:bg-blue-50 hover:border-blue-300"
                              onClick={() => navigate(`/blogs/detail/${blog._id}`)}
                              disabled={actionLoading}
                              aria-label={`Xem chi tiết bài viết ${blog.title || "không có tiêu đề"}`}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="hover:bg-blue-50 hover:border-blue-300"
                              onClick={() => navigate(`/admin/blogs/edit/${blog._id}`)}
                              disabled={actionLoading}
                              aria-label={`Chỉnh sửa bài viết ${blog.title || "không có tiêu đề"}`}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="hover:bg-red-50 hover:border-red-300 text-red-600"
                              onClick={() => handleDelete(blog._id)}
                              disabled={actionLoading}
                              aria-label={`Xóa bài viết ${blog.title || "không có tiêu đề"}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {!loading && filteredBlogs.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy bài viết</h3>
                <p className="text-gray-500">
                  Không có bài viết nào phù hợp với tiêu chí tìm kiếm của bạn. Hãy thử điều chỉnh từ khóa tìm kiếm.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default BlogManagement;
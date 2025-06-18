"use client";

import { useEffect, useState } from "react";
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
import {
  Search,
  Edit,
  Trash2,
  Plus,
  Eye,
  Calendar,
  BookOpen,
  TrendingUp,
  FileText,
  Heart,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Blog, getAll } from "../../services/blog/index"; // Điều chỉnh đường dẫn import nếu cần

function BlogManagement() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: string;
    message: string;
  } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await getAll();
        setBlogs(response.data.data);
      } catch (error: any) {
        setFeedback({
          type: "error",
          message: "Không thể tải danh sách bài viết.",
        });
      }
    };

    fetchBlogs();
  }, []);

  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.authorId?.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string = "") => {
    switch (status.toLowerCase()) {
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

  const getCategoryColor = (category: string = "") => {
    switch (category.toLowerCase()) {
      case "health education":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "blood_donation":
        return "bg-red-100 text-red-800 border-red-200";
      case "event":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "volunteer_story":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getInitials = (name: string = "") =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  const publishedPosts = blogs.filter(
    (blog) => blog.status === "published"
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-100 rounded-full">
              <BookOpen className="h-8 w-8 text-orange-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Quản lý bài viết
              </h1>
              <p className="text-gray-600 mt-1">
                Tạo và quản lý nội dung giáo dục
              </p>
            </div>
          </div>
          <Button
            onClick={() => navigate("/admin/blogs/create")}
            className="bg-orange-600 hover:bg-orange-700 text-white shadow-lg"
            disabled={actionLoading}
          >
            <Plus className="mr-2 h-4 w-4" />
            Tạo bài viết mới
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Tổng số bài viết
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {blogs.length}
                </p>
              </div>
              <FileText className="h-8 w-8 text-orange-500" />
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-600">Đã xuất bản</p>
                <p className="text-2xl font-bold text-gray-900">
                  {publishedPosts}
                </p>
              </div>
              <Eye className="h-8 w-8 text-green-500" />
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-xl border-0 py-0">
          <CardHeader className="bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-t-lg">
            <CardTitle className="text-xl font-semibold flex items-center gap-2 py-4">
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
              />
            </div>

            {feedback && (
              <div
                className={`mb-4 text-sm ${
                  feedback.type === "success"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {feedback.message}
              </div>
            )}

            {filteredBlogs.length > 0 ? (
              <div className="rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead>Thông tin bài viết</TableHead>
                      <TableHead>Tác giả & Danh mục</TableHead>
                      <TableHead>Ngày xuất bản</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Hành động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBlogs.map((blog) => (
                      <TableRow key={blog._id}>
                        <TableCell>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium text-gray-900 line-clamp-1 max-w-[400px] truncate">
                                {blog.title}
                              </h3>
                              {blog.featured && (
                                <Heart className="h-4 w-4 text-pink-500 fill-current" />
                              )}
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-2  max-w-[400px] truncate">
                              {blog.summary}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-2">
                            <div className="flex items-center  gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-gradient-to-br from-orange-500 to-red-600 text-white text-xs font-semibold">
                                  {getInitials(blog.authorId?.fullName)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm font-medium text-gray-900">
                                {blog.authorId?.fullName}
                              </span>
                            </div>
                            <Badge
                              variant="outline"
                              className={`text-xs ${getCategoryColor(
                                blog.categoryId?.name
                              )}`}
                            >
                              {blog.categoryId?.name || "Không xác định"}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Calendar className="h-3 w-3" />
                              <span>
                                {new Date(blog.createdAt).toLocaleDateString(
                                  "vi-VN"
                                )}
                              </span>
                            </div>
                            <div className="text-sm text-gray-500">
                              {blog.type || "Không xác định"}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`font-medium ${getStatusColor(
                              blog.status
                            )}`}
                          >
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
                              onClick={() =>
                                navigate(`/admin/blogs/edit/${blog._id}`)
                              }
                              aria-label="Chỉnh sửa bài viết"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              className="text-red-600"
                              aria-label="Xóa bài viết"
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
            ) : (
              <div className="text-center py-12">
                <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Không tìm thấy bài viết
                </h3>
                <p className="text-gray-500">
                  Hãy thử điều chỉnh tìm kiếm hoặc bộ lọc của bạn.
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

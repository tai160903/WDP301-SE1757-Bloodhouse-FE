"use client";

import React, { useEffect, useState } from "react";
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
import { getBlogs } from "@/services/blog";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

function BlogManagement() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [limit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const res = await getBlogs({ page: currentPage, limit });
        setBlogs(res.data.data);
        setTotalPages(res.data.metadata.totalPages);
        setTotalItems(res.data.metadata.total);
      } catch (err: any) {
        setError(err.message || "Không thể tải danh sách bài viết.");
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, [currentPage, limit]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.categoryId?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const publishedBlogs = blogs.filter(
    (blog) => blog.status === "published"
  ).length;
  const draftBlogs = blogs.filter((blog) => blog.status === "draft").length;
  const totalViews = blogs.reduce((sum, blog) => sum + (blog.views || 0), 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Published":
        return "bg-green-100 text-green-800 border-green-200";
      case "Draft":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Archived":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getCategoryColor = (categoryName: string) => {
    switch (categoryName) {
      case "health_education":
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

  const getCategoryText = (categoryName: string) => {
    switch (categoryName) {
      case "health_education":
        return "Giáo dục sức khỏe";
      case "blood_donation":
        return "Hiến máu";
      case "event":
        return "Sự kiện";
      case "volunteer_story":
        return "Câu chuyện tình nguyện viên";
      default:
        return categoryName;
    }
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
              <h1 className="text-3xl font-bold text-gray-900">
                Quản lý bài viết
              </h1>
              <p className="text-gray-600 mt-1">Quản lý nội dung và bài viết</p>
            </div>
          </div>
          <Button className="bg-orange-600 hover:bg-orange-700 text-white shadow-lg">
            <Plus className="mr-2 h-4 w-4" />
            Thêm bài viết mới
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Tổng số bài viết
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {blogs.length}
                  </p>
                </div>
                <FileText className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Đã xuất bản
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {publishedBlogs}
                  </p>
                </div>
                <Eye className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Lượt xem</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalViews.toLocaleString()}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-pink-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Bản nháp</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {draftBlogs}
                  </p>
                </div>
                <Heart className="h-8 w-8 text-pink-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card className="shadow-xl border-0 py-0">
          <CardHeader className="bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-t-lg">
            <CardTitle className="text-xl font-semibold flex items-center gap-2 py-4">
              <BookOpen className="h-5 w-5" />
              Danh sách bài viết
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Tìm kiếm bài viết theo tiêu đề, loại, danh mục..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 text-base border-2 focus:border-orange-300"
              />
            </div>

            {/* Table */}
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold text-gray-700">
                      Thông tin bài viết
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      Tác giả
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      Danh mục
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      Ngày tạo
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      Trạng thái
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      Hành động
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBlogs.map((blog) => (
                    <TableRow
                      key={blog._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <TableCell>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-gray-900 line-clamp-1">
                              {blog.title}
                            </h3>
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {blog.summary}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <img
                            src={blog.authorId?.avatar || "/default-avatar.png"}
                            alt={blog.authorId?.fullName || "Author"}
                            className="h-8 w-8 rounded-full object-cover"
                          />
                          <span className="text-sm font-medium text-gray-900">
                            {blog.authorId?.fullName}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={getCategoryColor(blog.categoryId?.name)}
                        >
                          {getCategoryText(blog.categoryId?.name)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {new Date(blog.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            blog.status === "published"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }
                        >
                          {blog.status === "published"
                            ? "Đã xuất bản"
                            : "Bản nháp"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="hover:bg-blue-50 hover:border-blue-300 cursor-pointer"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="hover:bg-red-50 hover:border-red-300 text-red-600 cursor-pointer"
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
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t">
                <div className="text-sm text-gray-600">
                  Hiển thị {(currentPage - 1) * limit + 1} đến{" "}
                  {Math.min(currentPage * limit, totalItems)} trong số{" "}
                  {totalItems} bài viết
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
                                  ? "hover:bg-orange-600"
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
            )}

            {filteredBlogs.length === 0 && !loading && (
              <div className="text-center py-12">
                <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Không tìm thấy bài viết
                </h3>
                <p className="text-gray-500">
                  Không có bài viết nào phù hợp với tiêu chí tìm kiếm của bạn.
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

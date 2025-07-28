"use client";

import { useEffect, useState } from "react";
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
import { Plus, Edit, Trash2, Eye, Calendar } from "lucide-react";
import { useManagerContext } from "@/components/ManagerLayout";
import { deleteBlog, getByFacilityId } from "@/services/blog";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { formatDate } from "date-fns";

export default function Blogs() {
  const { facilityId } = useManagerContext();
  const auth = useSelector((state: any) => state.auth);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [totalPuslished, setTotalPublished] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      const response: any = await getByFacilityId(facilityId || "");
      setBlogs(response.data.data || []);
      const publishedCount = response.data.data.filter(
        (post: any) => post.status === "published"
      ).length;
      setTotalPublished(publishedCount);
    };

    fetchBlogs();
  }, [facilityId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Published":
        return "bg-green-100 text-green-800";
      case "Draft":
        return "bg-yellow-100 text-yellow-800";
      case "Scheduled":
        return "bg-blue-100 text-blue-800";
      case "Archived":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleDeletePost = (postId: string) => async () => {
    try {
      if (window.confirm("Are you sure you want to delete this post?")) {
        await deleteBlog(postId, auth?.user?.role);
      }
      setBlogs((prevBlogs) => prevBlogs.filter((post) => post._id !== postId));
      toast.success("Xóa bài viết thành công.");
    } catch (error: any) {
      console.error("Error deleting post:", error);
      toast.error(error?.response?.data?.message || "Lỗi khi xóa bài viết.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Quản lý bài viết
          </h1>
          <p className="text-muted-foreground">
            Quản lý bài viết cho trang web của cơ sở y tế
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() =>
                navigate(`/manager/blogs/create?role=${auth?.user?.role}`)
              }
            >
              <Plus className="w-4 h-4 mr-2" />
              Thêm bài viết
            </Button>
          </DialogTrigger>
          {/* <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Thêm bài viết</DialogTitle>
              <DialogDescription>
                Thêm bài viết cho trang web của cơ sở y tế
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Tiêu đề</Label>
                <Input id="title" placeholder="Enter blog post title" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="author">Tác giả</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select author" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Dr. Sarah Johnson">
                        Dr. Sarah Johnson
                      </SelectItem>
                      <SelectItem value="Dr. Michael Chen">
                        Dr. Michael Chen
                      </SelectItem>
                      <SelectItem value="Nurse Emily Davis">
                        Nurse Emily Davis
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Health Education">
                        Health Education
                      </SelectItem>
                      <SelectItem value="Medical Information">
                        Medical Information
                      </SelectItem>
                      <SelectItem value="Donor Guide">Donor Guide</SelectItem>
                      <SelectItem value="Community">Community</SelectItem>
                      <SelectItem value="News">News</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  placeholder="Brief description of the blog post..."
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  placeholder="Write your blog post content here..."
                  className="min-h-[200px]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Draft">Draft</SelectItem>
                      <SelectItem value="Published">Published</SelectItem>
                      <SelectItem value="Scheduled">Scheduled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="publishDate">Publish Date</Label>
                  <Input id="publishDate" type="date" />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={() => setIsAddDialogOpen(false)}>
                Create Blog Post
              </Button>
            </DialogFooter>
          </DialogContent> */}
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng số bài viết
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{blogs.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Đã đăng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {totalPuslished || 0}
            </div>
          </CardContent>
        </Card>
        {/* <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">4</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15,247</div>
          </CardContent>
        </Card> */}
      </div>

      {/* Blog Posts Table */}
      <Card>
        {/* <CardHeader>
          <CardTitle>Blog</CardTitle>
          <CardDescription>Manage blog posts and articles</CardDescription>
        </CardHeader> */}
        <CardContent>
          {blogs.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tiêu đề</TableHead>
                  <TableHead>Tác giả</TableHead>
                  <TableHead>Danh mục</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ngày đăng</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {blogs.map((post) => (
                  <TableRow key={post._id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{post.title}</div>
                        <div className="text-sm text-muted-foreground line-clamp-2 max-w-md truncate">
                          {post.summary}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{post.authorId.fullName || "Unknown"}</TableCell>
                    <TableCell>
                      {post.type.charAt(0).toUpperCase() + post.type.slice(1)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={getStatusColor(
                          post.status.charAt(0).toUpperCase() +
                            post.status.slice(1)
                        )}
                      >
                        {post.status.charAt(0).toUpperCase() +
                          post.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {post.createdAt ? (
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(post.createdAt, "dd/MM/yyyy")}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">
                          Not scheduled
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            navigate(
                              `/manager/blogs/edit/${post._id}?role=${auth?.user?.role}`
                            )
                          }
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleDeletePost(post._id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 space-y-4">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                <Edit className="w-12 h-12 text-blue-500" />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Chưa có bài viết nào
                </h3>
                <p className="text-gray-500 mb-6 max-w-md">
                  Bạn chưa tạo bài viết nào cho cơ sở y tế. Hãy bắt đầu chia sẻ
                  kiến thức và thông tin hữu ích!
                </p>
                <Button
                  onClick={() =>
                    navigate(`/manager/blogs/create?role=${auth?.user?.role}`)
                  }
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Tạo Bài Viết Đầu Tiên
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

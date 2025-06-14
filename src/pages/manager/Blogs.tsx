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
import { r } from "node_modules/framer-motion/dist/types.d-CtuPurYT";
import { toast } from "sonner";

const blogPosts = [
  {
    id: 1,
    title: "The Importance of Regular Blood Donation",
    author: "Dr. Sarah Johnson",
    category: "Health Education",
    status: "Published",
    publishDate: "2024-01-03",
    views: 1247,
    excerpt:
      "Learn why regular blood donation is crucial for maintaining community health and how it benefits both donors and recipients.",
  },
  {
    id: 2,
    title: "Blood Types and Compatibility: What You Need to Know",
    author: "Dr. Michael Chen",
    category: "Medical Information",
    status: "Published",
    publishDate: "2024-01-01",
    views: 892,
    excerpt:
      "Understanding blood types and compatibility is essential for safe blood transfusions. This guide explains the basics.",
  },
  {
    id: 3,
    title: "Preparing for Your First Blood Donation",
    author: "Nurse Emily Davis",
    category: "Donor Guide",
    status: "Draft",
    publishDate: null,
    views: 0,
    excerpt:
      "A comprehensive guide for first-time blood donors, covering preparation, the donation process, and aftercare.",
  },
  {
    id: 4,
    title: "Community Impact: How Your Donation Saves Lives",
    author: "Dr. Sarah Johnson",
    category: "Community",
    status: "Scheduled",
    publishDate: "2024-01-10",
    views: 0,
    excerpt:
      "Real stories from our community showing how blood donations have made a difference in people's lives.",
  },
];

export default function Blogs() {
  const { facilityId } = useManagerContext();
  const auth = useSelector((state: any) => state.auth);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [blogs, setBlogs] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      const response: any = await getByFacilityId(facilityId || "");
      console.log("Fetched blogs:", response.data.data);
      setBlogs(response.data.data || []);
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
          <h1 className="text-3xl font-bold tracking-tight">Blog Management</h1>
          <p className="text-muted-foreground">
            Create and manage blog posts for the facility website
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
              New Blog Post
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Blog Post</DialogTitle>
              <DialogDescription>
                Create a new blog post for the facility website
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" placeholder="Enter blog post title" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="author">Author</Label>
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
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{blogs.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{}</div>
          </CardContent>
        </Card>
        <Card>
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
        </Card>
      </div>

      {/* Blog Posts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Blog Posts</CardTitle>
          <CardDescription>Manage blog posts and articles</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Publish Date</TableHead>
                {/* <TableHead>Views</TableHead> */}
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blogs?.map((post) => (
                <TableRow key={post._id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{post.title}</div>
                      <div className="text-sm text-muted-foreground line-clamp-2 max-w-md truncate">
                        {post.summary}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{post.author || "Unknown"}</TableCell>
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
                    {post.publishDate ? (
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {post.publishDate}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">
                        Not scheduled
                      </span>
                    )}
                  </TableCell>
                  {/* <TableCell>{post.views.toLocaleString()}</TableCell> */}
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
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { useState } from "react";
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

function BlogManagement() {
  // Enhanced mock data for blood donation blog posts
  const [blogs, setBlogs] = useState([
    {
      id: 1,
      title: "The Importance of Regular Blood Donation",
      author: "Dr. Sarah Johnson",
      category: "Health Education",
      publishDate: "2024-04-15",
      status: "Published",
      views: 1245,
      readTime: "5 min read",
      excerpt:
        "Understanding why regular blood donation is crucial for maintaining adequate blood supplies...",
      tags: ["health", "donation", "education"],
      featured: true,
    },
    {
      id: 2,
      title: "Blood Types Explained: What You Need to Know",
      author: "Dr. Michael Chen",
      category: "Medical",
      publishDate: "2024-05-02",
      status: "Published",
      views: 982,
      readTime: "7 min read",
      excerpt:
        "A comprehensive guide to understanding different blood types and compatibility...",
      tags: ["medical", "blood types", "science"],
      featured: false,
    },
    {
      id: 3,
      title: "Common Myths About Blood Donation Debunked",
      author: "Emma Williams",
      category: "Awareness",
      publishDate: "2024-05-20",
      status: "Draft",
      views: 0,
      readTime: "4 min read",
      excerpt:
        "Separating fact from fiction about blood donation myths and misconceptions...",
      tags: ["myths", "awareness", "facts"],
      featured: false,
    },
    {
      id: 4,
      title: "How Your Donation Saves Lives: Real Stories",
      author: "Robert Davis",
      category: "Stories",
      publishDate: "2024-06-10",
      status: "Published",
      views: 756,
      readTime: "6 min read",
      excerpt:
        "Heartwarming stories from recipients whose lives were saved by blood donations...",
      tags: ["stories", "impact", "testimonials"],
      featured: true,
    },
    {
      id: 5,
      title: "Preparing for Your First Blood Donation",
      author: "Lisa Thompson",
      category: "Guide",
      publishDate: "2024-06-25",
      status: "Published",
      views: 1156,
      readTime: "3 min read",
      excerpt:
        "Everything first-time donors need to know before their donation appointment...",
      tags: ["guide", "first-time", "preparation"],
      featured: false,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Health Education":
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

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const totalViews = blogs.reduce((sum, blog) => sum + blog.views, 0);
  const publishedPosts = blogs.filter(
    (blog) => blog.status === "Published"
  ).length;
  const draftPosts = blogs.filter((blog) => blog.status === "Draft").length;
  const featuredPosts = blogs.filter((blog) => blog.featured).length;

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
                Blog Management
              </h1>
              <p className="text-gray-600 mt-1">
                Create and manage educational content
              </p>
            </div>
          </div>
          <Button
            onClick={() => navigate("/admin/blogs/create")}
            className="bg-orange-600 hover:bg-orange-700 text-white shadow-lg"
            disabled={actionLoading}
            aria-label="Tạo bài viết mới"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create New Post
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Posts
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
                  <p className="text-sm font-medium text-gray-600">Published</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {publishedPosts}
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
                  <p className="text-sm font-medium text-gray-600">
                    Total Views
                  </p>
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
                  <p className="text-sm font-medium text-gray-600">
                    Featured Posts
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {featuredPosts}
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
              Content Library
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search posts by title, author, category, or tags..."
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
                    <TableHead className="font-semibold text-gray-700">
                      Post Information
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      Author & Category
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      Publication
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      Performance
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      Status
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBlogs.map((blog) => (
                    <TableRow
                      key={blog.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <TableCell>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-gray-900 line-clamp-1">
                              {blog.title}
                            </h3>
                            {blog.featured && (
                              <Heart className="h-4 w-4 text-pink-500 fill-current" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {blog.excerpt}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {blog.tags.slice(0, 2).map((tag) => (
                              <Badge
                                key={tag}
                                variant="outline"
                                className="text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                            {blog.tags.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{blog.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-gradient-to-br from-orange-500 to-red-600 text-white text-xs font-semibold">
                                {getInitials(blog.author)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium text-gray-900">
                              {blog.author}
                            </span>
                          </div>
                          <Badge
                            variant="outline"
                            className={`text-xs ${getCategoryColor(
                              blog.category
                            )}`}
                          >
                            {blog.category}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="h-3 w-3" />
                            <span>
                              {new Date(blog.publishDate).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="text-sm text-gray-500">
                            {blog.readTime}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Eye className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-900">
                            {blog.views.toLocaleString()}
                          </span>
                          <span className="text-sm text-gray-500">views</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`font-medium ${getStatusColor(
                            blog.status
                          )}`}
                        >
                          {blog.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="hover:bg-blue-50 hover:border-blue-300"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
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

            {filteredBlogs.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No blog posts found
                </h3>
                <p className="text-gray-500">
                  No blog posts match your search criteria. Try adjusting your
                  search terms.
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
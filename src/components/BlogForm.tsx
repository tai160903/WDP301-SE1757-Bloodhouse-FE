"use client";

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, Image, List } from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  create,
  update,
  getById,
  getCategories,
  getAuthors,
  Blog,
  Category
} from "../services/blog";

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "image"],
    ["clean"],
  ],
};

interface BlogFormProps {
  isEditing?: boolean;
}

interface BlogFormData {
  title: string;
  summary: string;
  content: string;
  type: "introduction" | "blog" | "document";
  categoryId: string;
  authorId: string;
  status: "draft" | "published" | "archived";
  image: string;
}

function BlogForm({ isEditing = false }: BlogFormProps) {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState<BlogFormData>({
    title: "",
    summary: "",
    content: "",
    type: "blog",
    categoryId: "",
    authorId: "",
    status: "draft",
    image: "",
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof BlogFormData, string>>>({});
  const [actionLoading, setActionLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoryResponse, userResponse] = await Promise.all([getCategories(), getAuthors()]);
        const categoryData = categoryResponse.data;
        const userData = userResponse.data;

        setCategories(categoryData);
        setFormData((prev) => ({
          ...prev,
          authorId: userData._id,
        }));

        if (!categoryData.length) setFeedback({ type: "error", message: "Không có danh mục nào được tìm thấy." });
        if (!userData._id) setFeedback({ type: "error", message: "Không thể xác định tác giả hiện tại." });
      } catch (error) {
        setFeedback({ type: "error", message: "Không thể tải danh mục hoặc thông tin tác giả." });
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (isEditing && id) {
      const fetchBlog = async () => {
        try {
          const response = await getById(id);
          const blog: Blog = response.data;
          setFormData({
            title: blog.title || "",
            summary: blog.summary || "",
            content: blog.content || "",
            type: blog.type || "blog",
            categoryId: blog.categoryId?._id || "",
            authorId: blog.authorId._id,
            status: blog.status || "draft",
            image: blog.image || "",
          });
        } catch (error) {
          setFeedback({ type: "error", message: "Không thể tải dữ liệu bài viết." });
        }
      };
      fetchBlog();
    }
  }, [isEditing, id]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof BlogFormData, string>> = {};
    if (!formData.title) newErrors.title = "Tiêu đề là bắt buộc";
    else if (formData.title.length > 50) newErrors.title = "Tiêu đề không được vượt quá 50 ký tự";
    if (!formData.summary) newErrors.summary = "Tóm tắt là bắt buộc";
    if (!formData.content || formData.content.replace(/<(.|\n)*?>/g, "").trim().length === 0)
      newErrors.content = "Nội dung là bắt buộc";
    if (!formData.type) newErrors.type = "Loại nội dung là bắt buộc";
    if (!formData.categoryId) newErrors.categoryId = "Danh mục là bắt buộc";
    if (!formData.authorId) newErrors.authorId = "Tác giả là bắt buộc";
    if (imageFile) {
      const validTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!validTypes.includes(imageFile.type)) newErrors.image = "Hình ảnh phải là jpg, png hoặc gif";
      if (imageFile.size > 5 * 1024 * 1024) newErrors.image = "Hình ảnh không được vượt quá 5MB";
    } else if (isEditing && !formData.image) {
      newErrors.image = "Hình ảnh là bắt buộc";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setActionLoading(true);
    setFeedback(null);

    const submitData = new FormData();
    submitData.append("title", formData.title);
    submitData.append("summary", formData.summary);
    submitData.append("content", formData.content);
    submitData.append("type", formData.type);
    submitData.append("categoryId", formData.categoryId);
    submitData.append("authorId", formData.authorId);
    if (imageFile) submitData.append("image", imageFile);
    else if (formData.image) submitData.append("image", formData.image);

    try {
      if (isEditing && id) {
        await update(id, submitData);
        setFeedback({ type: "success", message: "Cập nhật bài viết thành công!" });
      } else {
        await create(submitData);
        setFeedback({ type: "success", message: "Tạo bài viết thành công!" });
      }
      setTimeout(() => navigate("/admin/blogs"), 1500);
    } catch (error) {
      setFeedback({ type: "error", message: `Không thể ${isEditing ? "cập nhật" : "tạo"} bài viết.` });
    } finally {
      setActionLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSelectChange = (name: keyof BlogFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleContentChange = (content: string) => {
    setFormData((prev) => ({ ...prev, content }));
    setErrors((prev) => ({ ...prev, content: undefined }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, image: reader.result as string }));
        setErrors((prev) => ({ ...prev, image: undefined }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 p-6"
    >
      <Card className="max-w-5xl mx-auto shadow-md border border-gray-200 bg-white rounded-lg">
        <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-lg py-6 px-8">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <BookOpen className="h-6 w-6" />
            {isEditing ? "Chỉnh sửa bài viết" : "Tạo bài viết mới"}
          </CardTitle>
        </CardHeader>

        <CardContent className="p-8 space-y-6">
          {feedback && (
            <div className={`text-sm ${feedback.type === "success" ? "text-green-600" : "text-red-600"}`}>
              {feedback.message}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="col-span-2">
              <Label htmlFor="title">Tiêu đề</Label>
              <Input id="title" name="title" value={formData.title} onChange={handleInputChange} />
              {errors.title && <p className="text-red-600 text-sm">{errors.title}</p>}
            </div>

            {/* Summary */}
            <div>
              <Label htmlFor="summary">Tóm tắt</Label>
              <Input id="summary" name="summary" value={formData.summary} onChange={handleInputChange} />
              {errors.summary && <p className="text-red-600 text-sm">{errors.summary}</p>}
            </div>

            {/* Type */}
            <div>
              <Label>Loại nội dung</Label>
              <Select value={formData.type} onValueChange={(value) => handleSelectChange("type", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="introduction">Giới thiệu</SelectItem>
                  <SelectItem value="blog">Blog</SelectItem>
                  <SelectItem value="document">Tài liệu</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && <p className="text-red-600 text-sm">{errors.type}</p>}
            </div>

            {/* Category */}
            <div>
              <Label>Danh mục</Label>
              <Select value={formData.categoryId} onValueChange={(value) => handleSelectChange("categoryId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat._id} value={cat._id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.categoryId && <p className="text-red-600 text-sm">{errors.categoryId}</p>}
            </div>

            {/* Image Upload */}
            <div>
              <Label>Hình ảnh</Label>
              <Input type="file" accept="image/*" onChange={handleImageChange} />
              {formData.image && (
                <img src={formData.image} alt="Preview" className="mt-2 h-32 w-auto rounded" />
              )}
              {errors.image && <p className="text-red-600 text-sm">{errors.image}</p>}
            </div>
          </div>

          {/* Content Editor */}
          <div>
            <Label>Nội dung</Label>
            <div className="border rounded-md overflow-hidden">
              <ReactQuill
                value={formData.content}
                onChange={handleContentChange}
                modules={quillModules}
                className="min-h-[300px]"
              />
            </div>
            {errors.content && <p className="text-red-600 text-sm">{errors.content}</p>}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t mt-6">
            <Button variant="ghost" onClick={() => navigate("/admin/blogs")} disabled={actionLoading}>
              Hủy
            </Button>
            <Button onClick={handleSubmit} className="bg-orange-600 hover:bg-orange-700 text-white" disabled={actionLoading}>
              {actionLoading ? "Đang xử lý..." : isEditing ? "Cập nhật" : "Tạo"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default BlogForm;

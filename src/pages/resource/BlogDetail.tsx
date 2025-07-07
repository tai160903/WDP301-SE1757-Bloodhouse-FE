import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getById } from "../../services/blog";

const BlogDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchBlogDetail = async () => {
      if (!id) return;
      try {
        const response = await getById(id);
        setBlog(response.data || null);
        console.log("dmm");
        console.log(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết blog:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogDetail();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Đang tải chi tiết...</p>;

  if (!blog)
    return <p className="text-center mt-10">Không tìm thấy bài viết.</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Link to="/blog" className="text-blue-600 underline mb-4 inline-block">
        ← Quay lại danh sách
      </Link>
      <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
      <p className="text-gray-600 mb-2">
        {blog.categoryId?.name || "Không có danh mục"} •{" "}
        {new Date(blog.createdAt).toLocaleDateString("vi-VN", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>
      <div className="flex items-center mb-6">
        <img
          src={blog.authorId?.avatar || "/default-avatar.png"}
          alt={blog.authorId?.fullName || "Tác giả"}
          className="w-10 h-10 rounded-full mr-3 object-cover"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/default-avatar.png";
          }}
        />
        <span>{blog.authorId?.fullName || "Ẩn danh"}</span>
      </div>
      <img
        src={blog.image}
        alt={blog.title}
        className="w-full h-auto mb-6 rounded"
      />
      <div
        className="blog-content prose max-w-none"
        dangerouslySetInnerHTML={{ __html: blog.content || blog.summary }}
      />
    </div>
  );
};

export default BlogDetail;

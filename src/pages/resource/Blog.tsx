import React, { useEffect, useState } from "react";
import { getAll, getBlogs } from "../../services/blog";
import { Link } from "react-router-dom";
interface Blog {
  _id: string;
  title: string;
  image: string;
  summary: string;
  slug: string;
  categoryId?: {
    name: string;
  };
  authorId?: {
    fullName: string;
    avatar: string;
  };
  createdAt: string;
}
const Blog: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await getBlogs({ page: currentPage, limit: 10 });
        setBlogs(response.data.data);
        setTotalPages(response.data.totalPages);
        setTotalItems(response.data.totalItems);
      } catch (err) {
        console.error("Lỗi khi load blogs", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 container mx-auto">
      {blogs.map((blog) => (
        <div
          key={blog._id}
          className="bg-white rounded shadow hover:shadow-lg transition duration-300"
        >
          <Link to={`/blog/${blog._id}`}>
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-48 object-cover rounded-t"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2 hover:text-blue-600">
                {blog.title}
              </h2>
              <p className="text-gray-600 text-sm mb-2">
                {blog.categoryId?.name || "Không có danh mục"} •{" "}
                {new Date(blog.createdAt).toLocaleDateString()}
              </p>
              <p className="text-gray-700 text-sm line-clamp-3">
                {blog.summary}
              </p>
              <div className="flex items-center mt-4">
                <img
                  src={blog.authorId?.avatar || "/default-avatar.png"}
                  alt={blog.authorId?.fullName || "Tác giả"}
                  className="w-8 h-8 rounded-full mr-2"
                />
                <span className="text-sm text-gray-800">
                  {blog.authorId?.fullName || "Ẩn danh"}
                </span>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Blog;

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAll } from "@/services/blog";
import { formatDate } from "date-fns";

export function BlogSection() {
  const [blog, setBlog] = useState([]);

  const fetchBlogPosts = async () => {
    const response: any = await getAll();
    // console.log("Fetched blog posts:", response.data.data);
    setBlog(response.data.data || []);
  };

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const blogPosts = [
    {
      id: 1,
      title: "Trải nghiệm hiến máu đầu tiên của tôi",
      excerpt:
        "Ban đầu tôi khá lo lắng, nhưng đội ngũ nhân viên đã giúp tôi cảm thấy thoải mái trong suốt quá trình.",
      author: "Nguyễn Thị Hương",
      date: "10/05/2023",
      image: "/images/blog-donation-experience.jpg",
    },
    {
      id: 2,
      title: "Hiến máu đã cứu sống con tôi",
      excerpt:
        "Khi con gái tôi cần phẫu thuật khẩn cấp, những người hiến máu đã tạo nên sự khác biệt trong quá trình hồi phục của con.",
      author: "Trần Minh Tuấn",
      date: "22/04/2023",
      image: "/images/blog-donation-experience.jpg",
    },
    {
      id: 3,
      title: "Những hiểu lầm phổ biến về hiến máu",
      excerpt:
        "Hãy cùng làm rõ một số hiểu lầm phổ biến nhất về việc hiến máu.",
      author: "TS. Lê Thị Phương",
      date: "15/03/2023",
      image: "/images/blog-donation-experience.jpg",
    },
  ];

  return (
    <section className="container py-16 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-red-600">
            Câu chuyện & Tài nguyên
          </h2>
          <p className="text-muted-foreground mt-2">
            Đọc trải nghiệm và tìm hiểu thêm về hiến máu
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link to="/blog">
            Xem tất cả bài viết <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {blog.slice(0, 3).map((post: any) => (
          <Card key={post._id} className="overflow-hidden card-hover">
            <div className="relative h-48 overflow-hidden">
              <img
                src={post?.image || "/placeholder.svg"}
                alt={post?.title}
                width={400}
                height={200}
                className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
              />
            </div>
            <CardHeader className="space-y-1">
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="mr-1 h-4 w-4" />
                {formatDate(post?.createdAt, "dd/MM/yyyy HH:mm")}
              </div>
              <CardTitle className="line-clamp-1">{post?.title}</CardTitle>
              <CardDescription>
                Tác giả: {post?.authorId?.fullName}
              </CardDescription>
            </CardHeader>

            <CardFooter>
              <Button variant="ghost" asChild className="w-full">
                <Link to={`/blog/${post._id}`}>
                  Đọc tiếp <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}

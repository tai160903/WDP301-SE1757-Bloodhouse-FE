import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { formatDate } from "date-fns";
import { getAllEvents } from "@/services/event";

export function EventSection() {
  const [events, setEvent] = useState([]);

  const fetchBlogPosts = async () => {
    const response: any = await getAllEvents();
    // console.log("Fetched blog posts:", response.data.data);
    setEvent(response.data.data || []);
  };

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  return (
    <section className="container py-16 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-red-600">
            Các sự kiện và hoạt động
          </h2>
          <p className="text-muted-foreground mt-2">
            Cập nhật những sự kiện mới nhất từ BloodHouse
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link to="/events">
            Xem tất cả sự kiện <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {events?.slice(0, 3).map((event: any) => (
          <Card key={event._id} className="overflow-hidden card-hover">
            <div className="relative h-48 overflow-hidden">
              <img
                src={event?.bannerUrl || "/placeholder.svg"}
                alt={event?.title}
                width={400}
                height={200}
                className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
              />
            </div>
            <CardHeader className="space-y-1">
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="mr-1 h-4 w-4" />
                {formatDate(event?.startTime, "dd/MM/yyyy HH:mm")}
              </div>
              <CardTitle className="line-clamp-1">{event?.title}</CardTitle>
              <CardDescription>
                Số điện thoại liên hệ: {event?.contactPhone || "Chưa cập nhật"}
              </CardDescription>
            </CardHeader>

            <CardFooter>
              <Button variant="ghost" asChild className="w-full">
                <Link to={`/events/${event._id}`}>
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

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, Calendar, Droplet, Search, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { HeroSection } from "@/pages/home/components/hero-section";
import { BlogSection } from "@/pages/home/components/blog-section";
import { BloodTypeInfo } from "@/pages/home/components/blood-type-info";
// import { UrgentRequests } from "@/pages/home/components/urgent-requests";
import { Stats } from "@/pages/home/components/stats";
import { EventSection } from "./components/event-section";
import CarouselFacility from "@/pages/home/components/carousel-facility";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="flex flex-col w-full">
      <HeroSection />

      <section className="w-full py-16">
        <div className="container mx-auto px-4 sm:px-6 space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-red-600">
                BloodHouse Hoạt Động Như Thế Nào?
              </h2>
              <p className="text-muted-foreground mt-2">
                Quy trình hiến máu đơn giản và hiệu quả của chúng tôi
              </p>
            </div>
            <Button asChild>
              <Link to="/donation-registration">
                Trở thành người hiến máu <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="card-hover border-t-4 border-t-primary">
              <CardHeader className="space-y-1">
                <div className="bg-accent w-12 h-12 rounded-full flex items-center justify-center mb-2">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Đăng ký</CardTitle>
                <CardDescription>Đăng ký làm người hiến máu</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Tạo hồ sơ, xác định nhóm máu và đặt lịch sẵn sàng hiến máu của
                  bạn.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" asChild>
                  <Link to="/auth/register">Đăng ký ngay</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="card-hover border-t-4 border-t-primary">
              <CardHeader className="space-y-1">
                <div className="bg-accent w-12 h-12 rounded-full flex items-center justify-center mb-2">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Yêu cầu máu</CardTitle>
                <CardDescription>Đăng kí yêu cầu máu</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Liên hệ với chúng tôi trực tiếp hoặc gửi yêu cầu cần máu và
                  được hỗ trợ tại cơ sở y tế.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" asChild>
                  <Link to="/request">Liên hệ ngay</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="card-hover border-t-4 border-t-primary">
              <CardHeader className="space-y-1">
                <div className="bg-accent w-12 h-12 rounded-full flex items-center justify-center mb-2">
                  <Droplet className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Hiến máu</CardTitle>
                <CardDescription>
                  Cứu sống người khác bằng việc hiến máu
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Đến cơ sở y tế theo lịch hẹn và hoàn thành quá trình hiến máu
                  cứu người.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" asChild>
                  <Link to="/donation-registration">Tìm hiểu thêm</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      <EventSection />
      <BlogSection />
      <CarouselFacility />
    </div>
  );
}

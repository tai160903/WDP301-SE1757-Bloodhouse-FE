import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, Calendar, Droplet, Search, Users } from "lucide-react"
import { Link } from "react-router-dom"
import { HeroSection } from "@/pages/home/components/hero-section"
import { BlogSection } from "@/pages/home/components/blog-section"
import { BloodTypeInfo } from "@/pages/home/components/blood-type-info"
import { UrgentRequests } from "@/pages/home/components/urgent-requests"
import { Stats } from "@/pages/home/components/stats"

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <HeroSection />

      <Stats />z

      <section className="w-full py-16">
        <div className="container mx-auto px-4 sm:px-6 space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-red-600">BloodHouse Hoạt Động Như Thế Nào?</h2>
              <p className="text-muted-foreground mt-2">Quy trình hiến máu đơn giản và hiệu quả của chúng tôi</p>
            </div>
            <Button asChild>
              <Link to="/register">
                Trở thành người hiến máu <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Card grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <Card className="card-hover border-t-4 border-t-primary">
              <CardHeader className="space-y-1">
                <div className="bg-accent w-12 h-12 rounded-full flex items-center justify-center mb-2">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Đăng ký</CardTitle>
                <CardDescription>Đăng ký làm người hiến máu</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Tạo hồ sơ, xác định nhóm máu và đặt lịch sẵn sàng hiến máu của bạn.</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" asChild>
                  <Link to="/register">Đăng ký ngay</Link>
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="card-hover border-t-4 border-t-primary">
            <CardHeader className="space-y-1">
              <div className="bg-accent w-12 h-12 rounded-full flex items-center justify-center mb-2">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Lịch hẹn</CardTitle>
              <CardDescription>Đặt lịch hẹn hiến máu</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Chọn thời gian và địa điểm thuận tiện để hiến máu dựa trên lịch trình của bạn.</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" asChild>
                <Link to="/schedule">Đặt lịch ngay</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="card-hover border-t-4 border-t-primary">
            <CardHeader className="space-y-1">
              <div className="bg-accent w-12 h-12 rounded-full flex items-center justify-center mb-2">
                <Droplet className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Hiến máu</CardTitle>
              <CardDescription>Cứu sống người khác bằng việc hiến máu</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Đến cơ sở y tế theo lịch hẹn và hoàn thành quá trình hiến máu cứu người.</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" asChild>
                <Link to="/learn-more">Tìm hiểu thêm</Link>
              </Button>
            </CardFooter>
          </Card>
          </div>
        </div>
      </section>

      <section className="bg-accent py-16 section-pattern">
        <div className="container space-y-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight text-red-600">Tìm Nhóm Máu Tương Thích</h2>
            <p className="text-muted-foreground mt-2">
              Sử dụng công cụ tương thích của chúng tôi để tìm người hiến máu hoặc người nhận phù hợp dựa trên nhóm máu
            </p>
          </div>

          <Tabs defaultValue="whole-blood" className="max-w-3xl mx-auto">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="whole-blood">Máu toàn phần</TabsTrigger>
              <TabsTrigger value="red-cells">Hồng cầu</TabsTrigger>
              <TabsTrigger value="plasma">Huyết tương & Tiểu cầu</TabsTrigger>
            </TabsList>
            <TabsContent value="whole-blood">
              <BloodTypeInfo type="whole-blood" />
            </TabsContent>
            <TabsContent value="red-cells">
              <BloodTypeInfo type="red-cells" />
            </TabsContent>
            <TabsContent value="plasma">
              <BloodTypeInfo type="plasma" />
            </TabsContent>
          </Tabs>

          <div className="flex justify-center mt-8">
            <Button asChild>
              <Link to="/compatibility">
                <Search className="mr-2 h-4 w-4" /> Tìm người hiến máu tương thích
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <UrgentRequests />

      <BlogSection />
    </div>
  )
}
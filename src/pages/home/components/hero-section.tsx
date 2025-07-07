import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function HeroSection() {
  return (
    <section className="relative hero-gradient text-white w-full">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/pattern-dots.png')] bg-repeat opacity-10"></div>
      </div>
      <div className="container mx-auto px-4 sm:px-6 flex flex-col lg:flex-row items-center py-16 lg:py-28 gap-8 lg:gap-12 relative z-10">
        <div className="flex-1 space-y-6 lg:space-y-8">
          <div className="space-y-2 lg:space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              Mỗi giọt máu <br />
              <span className="text-accent">Cứu một mạng người</span>
            </h1>
            <p className="text-lg md:text-xl max-w-xl text-white/80">
              Tham gia BloodHouse để giúp đỡ những bệnh nhân đang cần. Việc hiến
              máu của bạn có thể cứu sống đến ba người và tạo nên sự khác biệt
              thực sự trong cộng đồng.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-white/90"
              asChild
            >
              <Link to="/auth/register">
                Trở thành người hiến máu <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-red-100 text-primary hover:bg-red-200 hover:text-gray-600"
              asChild
            >
              <Link to="/request">
                Yêu cầu hiến máu <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full bg-white/20 border-2 border-white flex items-center justify-center text-xs font-bold"
                >
                  {["A+", "B-", "O+", "AB+"][i - 1]}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex-1 relative w-full max-w-lg mx-auto lg:mx-0">
          <div className="absolute -top-8 -left-8 w-24 h-24 bg-accent rounded-full opacity-50 blur-xl"></div>
          <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-accent rounded-full opacity-50 blur-xl"></div>
          <div className="relative z-10 rounded-lg shadow-2xl overflow-hidden">
            <img
              src="/images/hero-blood-donation.jpg"
              alt="Hiến máu"
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
}

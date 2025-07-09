/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
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
import { BloodDonationRegistrationForm } from "./components/BloodDonationRegistrationForm";
import { BloodDonationProcess } from "./components/BloodDonationProcess";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, CheckCircle2, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import useAuth from "@/hooks/useAuth";

export default function BloodDonationRegistrationPage() {
  const { isAuthenticated } = useAuth();

  const [formStatus, setFormStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleFormSuccess = (data: any) => {
    setFormStatus({
      type: "success",
      message: data.message || "Đăng ký hiến máu thành công",
    });
  };

  const handleFormError = (error: any) => {
    setFormStatus({
      type: "error",
      message: error.message || "Có lỗi xảy ra, vui lòng thử lại",
    });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="container py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Đăng ký Hiến máu</h1>
        <p className="text-muted-foreground mt-2">
          Lên lịch cho buổi hiến máu của bạn
        </p>
      </div>

      {formStatus && (
        <Alert
          variant={formStatus.type === "success" ? "default" : "destructive"}
        >
          {formStatus.type === "success" ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <AlertTitle>
            {formStatus.type === "success" ? "Thành công" : "Lỗi"}
          </AlertTitle>
          <AlertDescription>{formStatus.message}</AlertDescription>
        </Alert>
      )}

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Thông tin quan trọng</AlertTitle>
        <AlertDescription>
          <p>
            Vui lòng đảm bảo bạn đáp ứng các tiêu chí trước khi đăng ký. Bạn
            phải ít nhất 18 tuổi, nặng ít nhất 50kg, và có sức khỏe tốt. Bạn
            không nên hiến máu nếu đã hiến trong vòng 56 ngày qua.
          </p>

          {!isAuthenticated && (
            <>
              <p>
                Ngoài ra bạn cần phải đăng nhập để đảm bảo việc đăng ký hiến máu
                diễn ra suôn sẻ.{" "}
                <Link to="/auth/login" className="font-bold text-red-500">
                  Nhấn vào đây
                </Link>{" "}
                để đăng nhập.
              </p>
              <p>
                Đăng ký tài khoản đơn giản và miễn phí{" "}
                <Link to="/auth/register" className="font-bold text-red-500">
                  tại đây.
                </Link>
              </p>
            </>
          )}
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="schedule" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="schedule">Lên lịch hiến máu</TabsTrigger>
          <TabsTrigger value="process">Quy trình hiến máu</TabsTrigger>
          <TabsTrigger value="eligibility">Tiêu chí tham gia</TabsTrigger>
        </TabsList>

        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <CardTitle>Lên lịch hiến máu</CardTitle>
              <CardDescription>
                Điền thông tin dưới đây để đăng ký buổi hiến máu
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BloodDonationRegistrationForm
                onSuccess={handleFormSuccess}
                onError={handleFormError}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="process">
          <Card>
            <CardHeader>
              <CardTitle>Quy trình hiến máu</CardTitle>
              <CardDescription>Tìm hiểu về quy trình hiến máu</CardDescription>
            </CardHeader>
            <CardContent>
              <BloodDonationProcess />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="eligibility">
          <Card>
            <CardHeader>
              <CardTitle>Tiêu chí tham gia</CardTitle>
              <CardDescription>
                Kiểm tra xem bạn có đủ điều kiện hiến máu không
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">Yêu cầu cơ bản</h3>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Ít nhất 18 tuổi</li>
                  <li>Nặng ít nhất 50kg</li>
                  <li>Có sức khỏe tốt</li>
                  <li>Chưa hiến máu trong 56 ngày qua</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg">Tạm hoãn</h3>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Cảm lạnh, cúm, sốt: Chờ đến khi hết triệu chứng</li>
                  <li>Mang thai: Chờ 6 tuần sau khi sinh</li>
                  <li>Xăm mình: Chờ 3-12 tháng tùy quy định địa phương</li>
                  <li>Du lịch đến vùng sốt rét: Chờ 3 tháng</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg">
                  Không đủ điều kiện vĩnh viễn
                </h3>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>HIV hoặc nguy cơ HIV</li>
                  <li>Viêm gan B hoặc C</li>
                  <li>Một số bệnh ung thư</li>
                  <li>Sử dụng một số loại thuốc</li>
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full hover:bg-red-50 hover:text-red-600"
              >
                Kiểm tra tiêu chí
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

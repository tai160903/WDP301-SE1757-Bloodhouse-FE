import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Clock, Droplet, FileText, Heart, ShieldCheck, User } from "lucide-react"

export function BloodDonationProcess() {
  const steps = [
    {
      icon: User,
      title: "Đăng ký",
      description: "Đăng ký và hoàn thành bản khảo sát bí mật.",
      time: "10-15 phút",
    },
    {
      icon: FileText,
      title: "Kiểm tra sức khỏe",
      description: "Kiểm tra sức khỏe bao gồm nhiệt độ, nhịp tim, huyết áp và hàm lượng hemoglobin.",
      time: "10-15 phút",
    },
    {
      icon: Droplet,
      title: "Hiến máu",
      description: "Quá trình hiến máu thực tế, thu thập 1 đơn vị máu (khoảng 1 lít).",
      time: "8-10 phút",
    },
    {
      icon: Heart,
      title: "Phục hồi & Nghỉ ngơi",
      description: "Nghỉ ngơi và thưởng thức đồ uống trong khi cơ thể điều chỉnh sau khi hiến máu.",
      time: "15 phút",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {steps.map((step, index) => (
          <Card key={index} className="border-l-4 border-l-red-600">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div className="bg-red-100 p-2 rounded-full">
                  <step.icon className="h-5 w-5 text-red-600" />
                </div>
                <CardTitle className="text-lg">Step {index + 1}</CardTitle>
              </div>
              <CardDescription className="text-base font-medium">{step.title}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">{step.description}</p>
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="h-4 w-4 mr-1" />
                {step.time}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-slate-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-green-600" />
            Những gì bạn có thể mong đợi sau khi hiến máu
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium">Uống đủ nước</h4>
              <p className="text-sm text-muted-foreground">
                Uống đủ nước trong vòng 24-48 giờ để bù đắp thể tích máu đã mất.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium">Tránh tập luyện nặng</h4>
              <p className="text-sm text-muted-foreground">
                Nghỉ ngơi và tránh tập luyện nặng.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium">Giữ gạc lại</h4>
              <p className="text-sm text-muted-foreground">
                Để gạc lại trong vòng 4 giờ sau khi hiến máu.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium">Eat Well</h4>
              <p className="text-sm text-muted-foreground">
                Have a nutritious meal and avoid alcohol for 24 hours after donation.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

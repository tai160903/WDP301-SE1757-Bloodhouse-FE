import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info } from "lucide-react"
import { BloodRequestForm } from "./components/bloodRequestForm"

export default function RequestPage() {
  return (
    <div className="container py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Yêu Cầu Cần Máu</h1>
        <p className="text-muted-foreground mt-2">Gửi yêu cầu cần máu</p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Thông Tin Quan Trọng</AlertTitle>
        <AlertDescription>
          Đối với các tình huống khẩn cấp cần truyền máu ngay lập tức, vui lòng liên hệ với dịch vụ cấp cứu trực tiếp
          theo số 115 hoặc liên hệ với bệnh viện gần nhất. Biểu mẫu này dành cho nhu cầu máu theo lịch.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="standard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="standard">Yêu Cầu Thông Thường</TabsTrigger>
          <TabsTrigger value="urgent" className=" text-red-600 hover:text-red-600 hover:bg-red-50 focus:text-red-600 focus:bg-red-50">Yêu Cầu Khẩn Cấp</TabsTrigger>
        </TabsList>

        <TabsContent value="standard">
          <Card>
            <CardHeader>
              <CardTitle>Yêu Cầu Máu Thông Thường</CardTitle>
              <CardDescription>Cho các thủ tục y tế theo lịch hoặc tình huống không khẩn cấp</CardDescription>
            </CardHeader>
            <CardContent>
              <BloodRequestForm isUrgent={false} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="urgent" >
          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">Yêu Cầu Máu Khẩn Cấp</CardTitle>
              <CardDescription>Cho các tình huống cần máu trong vòng 24-48 giờ</CardDescription>
            </CardHeader>
            <CardContent>
              <BloodRequestForm isUrgent={true} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
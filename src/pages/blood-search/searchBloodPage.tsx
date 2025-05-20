import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info } from "lucide-react"
import { DonorSearch } from "./components/bloodDonorSearch"
import { BloodTypeSearch } from "./components/bloodTypeSearch"

export default function SearchPage() {
  return (
    <div className="container py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tìm kiếm</h1>
        <p className="text-muted-foreground mt-2">Tìm kiếm loại máu tương thích và người hiến máu</p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Tìm kiếm</AlertTitle>
        <AlertDescription>
          Sử dụng công cụ tìm kiếm để tìm kiếm loại máu tương thích hoặc tìm kiếm những người hiến máu trong khu vực của bạn. Đối với nhu cầu khẩn cấp, vui lòng liên hệ với cơ sở y tế trực tiếp hoặc gửi yêu cầu máu khẩn cấp.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="compatibility" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="compatibility">Loại máu tương thích</TabsTrigger>
          <TabsTrigger value="donors">Tìm người hiến máu</TabsTrigger>
        </TabsList>

        <TabsContent value="compatibility">
          <Card>
            <CardHeader>
              <CardTitle>Tìm kiếm loại máu tương thích</CardTitle>
              <CardDescription>Tìm kiếm loại máu tương thích cho truyền máu</CardDescription>
            </CardHeader>
            <CardContent>
              <BloodTypeSearch />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="donors">
          <Card>
            <CardHeader>
              <CardTitle>Tìm kiếm người hiến máu</CardTitle>
              <CardDescription>Tìm kiếm người hiến máu theo vị trí và loại máu</CardDescription>
            </CardHeader>
            <CardContent>
              <DonorSearch />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

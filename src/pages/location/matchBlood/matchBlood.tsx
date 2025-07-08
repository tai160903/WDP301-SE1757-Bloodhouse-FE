"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Loader2, Droplets, Heart, AlertCircle, CheckCircle2, ArrowRight, ArrowLeft } from "lucide-react"
import {
  getBloodGroups,
  getBloodComponents,
  getBloodCompabilities,
  BloodCompability,
} from "../../../services/bloodCompatibility/index";
interface BloodGroup {
  _id: string
  name: string
}

interface BloodComponent {
  _id: string
  name: string
}

interface BloodCompatibility {
  bloodCompability: string
  canDonateTo: BloodGroup[]
  canReceiveFrom: BloodGroup[]
}


export default function BloodCompatibility() {
  const [bloodGroups, setBloodGroups] = useState<BloodGroup[]>([])
  const [bloodComponents, setBloodComponents] = useState<BloodComponent[]>([])
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<string>("")
  const [selectedComponent, setSelectedComponent] = useState<string>("")
  const [result, setResult] = useState<BloodCompatibility | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [initialLoading, setInitialLoading] = useState(true)

  useEffect(() => {
      async function fetchData() {
        try {
          const groups = await getBloodGroups();
          const components = await getBloodComponents();
          setBloodGroups(groups);
          setBloodComponents(components);
          setError(null);
        } catch (err: any) {
          setError(err.message || "Lỗi tải dữ liệu");
        }
      }
      fetchData();
    }, []);

  const handleReset = () => {
    setSelectedBloodGroup("")
    setSelectedComponent("")
    setResult(null)
    setError(null)
  }
  
    const handleCheckCompatibility = async () => {
      if (!selectedBloodGroup || !selectedComponent) return;
  
      setLoading(true);
      setError(null);
      setResult(null);
  
      try {
        const compability = await getBloodCompabilities(selectedBloodGroup, selectedComponent);
        setResult(compability);
      } catch (err: any) {
        setError(err.message || "Lỗi khi kiểm tra tương thích");
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-rose-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="p-3 bg-red-100 rounded-full">
              <Droplets className="h-8 w-8 text-red-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900">Kiểm tra tương thích nhóm máu</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Công cụ hỗ trợ kiểm tra tính tương thích giữa các nhóm máu và thành phần máu khác nhau
          </p>
        </div>

        {/* Main Form */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl text-gray-800 flex items-center justify-center gap-2">
              <Heart className="h-6 w-6 text-red-500" />
              Thông tin kiểm tra
            </CardTitle>
            <CardDescription>Vui lòng chọn nhóm máu và thành phần máu để kiểm tra tương thích</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Blood Group Selection */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Droplets className="h-4 w-4 text-red-500" />
                  Nhóm máu
                </label>
                <Select value={selectedBloodGroup} onValueChange={setSelectedBloodGroup}>
                  <SelectTrigger className="w-full h-12 px-4 border-2 border-gray-200 hover:border-red-300 transition-colors">
                    <SelectValue placeholder="Chọn nhóm máu" />
                  </SelectTrigger>
                  <SelectContent>
                    {bloodGroups.map((bg) => (
                      <SelectItem key={bg._id} value={bg._id}>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-red-600 border-red-200">
                            {bg.name}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Blood Component Selection */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Heart className="h-4 w-4 text-red-500" />
                  Thành phần máu
                </label>
                <Select value={selectedComponent} onValueChange={setSelectedComponent}>
                  <SelectTrigger className="w-full h-12 px-4 border-2 border-gray-200 hover:border-red-300 transition-colors">
                    <SelectValue placeholder="Chọn thành phần máu" />
                  </SelectTrigger>
                  <SelectContent>
                    {bloodComponents.map((bc) => (
                      <SelectItem key={bc._id} value={bc._id}>
                        {bc.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleCheckCompatibility}
                disabled={!selectedBloodGroup || !selectedComponent || loading}
                className="flex-1 h-12 bg-red-600 hover:bg-red-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang kiểm tra...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Kiểm tra tương thích
                  </>
                )}
              </Button>
              <Button
                onClick={handleReset}
                variant="outline"
                className="h-12 px-6 border-2 hover:bg-gray-50 bg-transparent"
              >
                Đặt lại
              </Button>
            </div>

            {/* Error Alert */}
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-700 font-medium">{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        {result && (
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-800 flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                Kết quả tương thích
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Description */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-gray-700 leading-relaxed">{result.bloodCompability}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Can Donate To */}
                <Card className="border-green-200 bg-green-50/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-green-800 flex items-center gap-2">
                      <ArrowRight className="h-5 w-5" />
                      Có thể hiến máu cho
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {result.canDonateTo.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {result.canDonateTo.map((group) => (
                          <Badge key={group._id} className="bg-green-100 text-green-800 hover:bg-green-200">
                            {group.name}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">Không có nhóm máu tương thích</p>
                    )}
                  </CardContent>
                </Card>

                {/* Can Receive From */}
                <Card className="border-blue-200 bg-blue-50/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-blue-800 flex items-center gap-2">
                      <ArrowLeft className="h-5 w-5" />
                      Có thể nhận máu từ
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {result.canReceiveFrom.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {result.canReceiveFrom.map((group) => (
                          <Badge key={group._id} className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                            {group.name}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">Không có nhóm máu tương thích</p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Important Notice */}
              <Alert className="border-amber-200 bg-amber-50">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-800">
                  <strong>Lưu ý quan trọng:</strong> Thông tin này chỉ mang tính chất tham khảo. Việc hiến và nhận máu
                  cần được thực hiện dưới sự giám sát của các chuyên gia y tế có thẩm quyền.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

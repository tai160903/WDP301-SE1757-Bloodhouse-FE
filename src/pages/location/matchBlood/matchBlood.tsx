"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Loader2,
  Droplets,
  TestTube,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Heart,
  Users,
  AlertCircle,
  BookOpen,
  Search,
} from "lucide-react"

// Types
interface BloodGroup {
  id: string
  name: string
  description?: string
}

interface BloodComponent {
  id: string
  name: string
  description?: string
}

interface CompatibilityResult {
  compatible: boolean
  message: string
  riskLevel?: "low" | "medium" | "high"
  recommendations?: string[]
}

// Mock API functions (replace with your actual API calls)
const getBloodGroups = async (): Promise<BloodGroup[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return [
    { id: "1", name: "A+", description: "Nhóm máu A dương tính" },
    { id: "2", name: "A-", description: "Nhóm máu A âm tính" },
    { id: "3", name: "B+", description: "Nhóm máu B dương tính" },
    { id: "4", name: "B-", description: "Nhóm máu B âm tính" },
    { id: "5", name: "AB+", description: "Nhóm máu AB dương tính" },
    { id: "6", name: "AB-", description: "Nhóm máu AB âm tính" },
    { id: "7", name: "O+", description: "Nhóm máu O dương tính" },
    { id: "8", name: "O-", description: "Nhóm máu O âm tính" },
  ]
}

const getBloodComponents = async (): Promise<BloodComponent[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return [
    { id: "1", name: "Hồng cầu", description: "Tế bào hồng cầu" },
    { id: "2", name: "Tiểu cầu", description: "Tế bào tiểu cầu" },
    { id: "3", name: "Huyết tương", description: "Thành phần huyết tương" },
    { id: "4", name: "Máu toàn phần", description: "Máu nguyên chất" },
  ]
}

const getBloodCompabilities = async (bloodGroupId: string, componentId: string): Promise<CompatibilityResult[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Mock compatibility logic
  const isCompatible = Math.random() > 0.3
  const riskLevels = ["low", "medium", "high"] as const
  const riskLevel = riskLevels[Math.floor(Math.random() * riskLevels.length)]

  return [
    {
      compatible: isCompatible,
      message: isCompatible
        ? "Nhóm máu và thành phần máu này tương thích với nhau. Có thể tiến hành truyền máu an toàn."
        : "Nhóm máu và thành phần máu này không tương thích. Cần xem xét các phương án khác.",
      riskLevel,
      recommendations: isCompatible
        ? ["Tiến hành xét nghiệm tương thích chéo", "Theo dõi bệnh nhân sau truyền máu"]
        : ["Tìm kiếm nhóm máu tương thích khác", "Tham khảo ý kiến chuyên gia", "Cân nhắc các phương pháp thay thế"],
    },
  ]
}

const bloodTypes = ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"]

const compatibilityData = {
  "O-": { canGiveTo: ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"], canReceiveFrom: ["O-"] },
  "O+": { canGiveTo: ["O+", "A+", "B+", "AB+"], canReceiveFrom: ["O-", "O+"] },
  "A-": { canGiveTo: ["A-", "A+", "AB-", "AB+"], canReceiveFrom: ["O-", "A-"] },
  "A+": { canGiveTo: ["A+", "AB+"], canReceiveFrom: ["O-", "O+", "A-", "A+"] },
  "B-": { canGiveTo: ["B-", "B+", "AB-", "AB+"], canReceiveFrom: ["O-", "B-"] },
  "B+": { canGiveTo: ["B+", "AB+"], canReceiveFrom: ["O-", "O+", "B-", "B+"] },
  "AB-": { canGiveTo: ["AB-", "AB+"], canReceiveFrom: ["O-", "A-", "B-", "AB-"] },
  "AB+": { canGiveTo: ["AB+"], canReceiveFrom: ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"] },
}

export default function BloodCompatibility() {
  // Static compatibility states
  const [selectedBloodType, setSelectedBloodType] = useState<string>("O+")

  // API checker states
  const [bloodGroups, setBloodGroups] = useState<BloodGroup[]>([])
  const [bloodComponents, setBloodComponents] = useState<BloodComponent[]>([])
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<string>("")
  const [selectedComponent, setSelectedComponent] = useState<string>("")
  const [result, setResult] = useState<CompatibilityResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [groups, components] = await Promise.all([getBloodGroups(), getBloodComponents()])
        if (!Array.isArray(groups) || !Array.isArray(components)) {
          throw new Error("Dữ liệu API không đúng định dạng")
        }
        setBloodGroups(groups)
        setBloodComponents(components)
        setErrorMessage(null)
      } catch (error: any) {
        console.error("Error loading data:", error)
        setBloodGroups([])
        setBloodComponents([])
        setErrorMessage(error.message || "Không thể tải danh sách nhóm máu và thành phần máu")
      } finally {
        setInitialLoading(false)
      }
    }

    loadData()
  }, [])

  const handleCheckCompatibility = async () => {
    if (!selectedBloodGroup || !selectedComponent) return

    setLoading(true)
    setResult(null)
    setErrorMessage(null)

    try {
      const response = await getBloodCompabilities(selectedBloodGroup, selectedComponent)
      if (Array.isArray(response) && response.length > 0) {
        setResult(response[0])
      } else {
        setResult({
          compatible: false,
          message: "Không tìm thấy dữ liệu tương thích từ API",
        })
      }
    } catch (error: any) {
      setResult({
        compatible: false,
        message: error.message || "Không thể kết nối đến server. Vui lòng thử lại sau.",
      })
    } finally {
      setLoading(false)
    }
  }

  const getRiskColor = (riskLevel?: string) => {
    switch (riskLevel) {
      case "low":
        return "text-green-600 bg-green-50 border-green-200"
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "high":
        return "text-red-600 bg-red-50 border-red-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const getRiskIcon = (riskLevel?: string) => {
    switch (riskLevel) {
      case "low":
        return <CheckCircle className="w-4 h-4" />
      case "medium":
        return <AlertTriangle className="w-4 h-4" />
      case "high":
        return <XCircle className="w-4 h-4" />
      default:
        return null
    }
  }

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-red-50 to-pink-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center p-8">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            <span className="ml-2 text-lg">Đang tải dữ liệu...</span>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-red-50 to-pink-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Droplets className="w-8 h-8 text-red-500" />
            <h1 className="text-2xl md:text-4xl font-bold text-gray-900">Hệ Thống Tương Thích Nhóm Máu</h1>
          </div>
          <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto px-4">
            Hệ thống hoàn chỉnh để kiểm tra tương thích nhóm máu với thông tin giáo dục và API kiểm tra chuyên nghiệp
          </p>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        {/* Main Tabs */}
        <Tabs defaultValue="api-checker" className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-12">
            <TabsTrigger value="api-checker" className="flex items-center gap-2 text-sm">
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">Kiểm Tra API</span>
              <span className="sm:hidden">API</span>
            </TabsTrigger>
            <TabsTrigger value="education" className="flex items-center gap-2 text-sm">
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Thông Tin Giáo Dục</span>
              <span className="sm:hidden">Giáo Dục</span>
            </TabsTrigger>
          </TabsList>

          {/* API Checker Tab */}
          <TabsContent value="api-checker" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                  <TestTube className="w-5 h-5 text-blue-600" />
                  Kiểm Tra Tương Thích Chuyên Nghiệp
                </CardTitle>
                <CardDescription className="text-sm">
                  Sử dụng API để kiểm tra khả năng tương thích giữa nhóm máu và thành phần máu cụ thể
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Blood Group Selection */}
                  <div className="space-y-3">
                    <label className="text-base font-medium text-gray-700 block">
                      Nhóm Máu<span className="text-red-500 ml-1">*</span>
                    </label>
                    <Select value={selectedBloodGroup} onValueChange={setSelectedBloodGroup}>
                      <SelectTrigger className="w-full h-16 text-lg">
                        <SelectValue placeholder="Chọn nhóm máu" className="text-lg" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60 z-50">
                        {bloodGroups.length > 0 ? (
                          bloodGroups.map((group) => (
                            <SelectItem key={group.id} value={group.id} className="py-4 px-4">
                              <div className="flex flex-col items-start">
                                <span className="font-medium text-lg">{group.name}</span>
                                {group.description && (
                                  <span className="text-sm text-gray-500 mt-1">{group.description}</span>
                                )}
                              </div>
                            </SelectItem>
                          ))
                        ) : (
                          <div className="p-6 text-base text-gray-500 text-center">Không có nhóm máu nào</div>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Blood Component Selection */}
                  <div className="space-y-3">
                    <label className="text-base font-medium text-gray-700 block">
                      Thành Phần Máu<span className="text-red-500 ml-1">*</span>
                    </label>
                    <Select value={selectedComponent} onValueChange={setSelectedComponent}>
                      <SelectTrigger className="w-full h-16 text-lg">
                        <SelectValue placeholder="Chọn thành phần máu" className="text-lg" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60 z-50">
                        {bloodComponents.length > 0 ? (
                          bloodComponents.map((component) => (
                            <SelectItem key={component.id} value={component.id} className="py-4 px-4">
                              <div className="flex flex-col items-start">
                                <span className="font-medium text-lg">{component.name}</span>
                                {component.description && (
                                  <span className="text-sm text-gray-500 mt-1">{component.description}</span>
                                )}
                              </div>
                            </SelectItem>
                          ))
                        ) : (
                          <div className="p-6 text-base text-gray-500 text-center">Không có thành phần máu nào</div>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Check Button */}
                <Button
                  onClick={handleCheckCompatibility}
                  disabled={!selectedBloodGroup || !selectedComponent || loading}
                  className="w-full h-12 text-base font-medium"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Đang kiểm tra...
                    </>
                  ) : (
                    <>
                      <TestTube className="w-5 h-5 mr-2" />
                      Kiểm Tra Tương Thích
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* API Results */}
            {result && (
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    {result.compatible ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                    Kết Quả Kiểm Tra API
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Compatibility Status */}
                  <Alert className={result.compatible ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                    <AlertDescription className={result.compatible ? "text-green-800" : "text-red-800"}>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant={result.compatible ? "default" : "destructive"} className="text-sm px-3 py-1">
                          {result.compatible ? "TƯƠNG THÍCH" : "KHÔNG TƯƠNG THÍCH"}
                        </Badge>
                        {result.riskLevel && (
                          <Badge variant="outline" className={`${getRiskColor(result.riskLevel)} text-sm px-3 py-1`}>
                            <span className="flex items-center gap-1">
                              {getRiskIcon(result.riskLevel)}
                              <span>
                                {result.riskLevel === "low" && "Nguy cơ thấp"}
                                {result.riskLevel === "medium" && "Nguy cơ trung bình"}
                                {result.riskLevel === "high" && "Nguy cơ cao"}
                              </span>
                            </span>
                          </Badge>
                        )}
                      </div>
                    </AlertDescription>
                  </Alert>

                  {/* Message */}
                  <div className="p-4 bg-gray-50 rounded-lg border">
                    <h4 className="font-medium text-gray-900 mb-2">Thông Tin Chi Tiết:</h4>
                    <p className="text-gray-700 leading-relaxed">{result.message}</p>
                  </div>

                  {/* Recommendations */}
                  {result.recommendations && result.recommendations.length > 0 && (
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-medium text-blue-900 mb-3">Khuyến Nghị:</h4>
                      <ul className="list-disc list-inside space-y-2 text-blue-800">
                        {result.recommendations.map((rec, index) => (
                          <li key={index} className="leading-relaxed">
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Education Tab */}
          <TabsContent value="education" className="space-y-6 mt-6">
            {/* Blood Type Selector */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                  <Heart className="w-5 h-5 text-red-500" />
                  Chọn Nhóm Máu Của Bạn
                </CardTitle>
                <CardDescription>Chọn nhóm máu để xem thông tin tương thích chi tiết</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-2 md:gap-3">
                  {bloodTypes.map((type) => (
                    <Button
                      key={type}
                      variant={selectedBloodType === type ? "default" : "outline"}
                      onClick={() => setSelectedBloodType(type)}
                      className="h-12 text-base font-semibold hover:scale-105 transition-transform"
                    >
                      {type}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Compatibility Information */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border-green-200">
                <CardHeader className="bg-green-50">
                  <CardTitle className="text-green-700 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Có Thể Hiến Máu Cho
                  </CardTitle>
                  <CardDescription>Nhóm máu {selectedBloodType} có thể hiến máu cho các nhóm sau:</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="flex flex-wrap gap-2">
                    {compatibilityData[selectedBloodType as keyof typeof compatibilityData]?.canGiveTo.map((type) => (
                      <Badge key={type} className="bg-green-100 text-green-800 border-green-200 text-sm px-3 py-1">
                        {type}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-blue-200">
                <CardHeader className="bg-blue-50">
                  <CardTitle className="text-blue-700 flex items-center gap-2">
                    <Heart className="w-5 h-5" />
                    Có Thể Nhận Máu Từ
                  </CardTitle>
                  <CardDescription>Nhóm máu {selectedBloodType} có thể nhận máu từ các nhóm sau:</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="flex flex-wrap gap-2">
                    {compatibilityData[selectedBloodType as keyof typeof compatibilityData]?.canReceiveFrom.map(
                      (type) => (
                        <Badge key={type} className="bg-blue-100 text-blue-800 border-blue-200 text-sm px-3 py-1">
                          {type}
                        </Badge>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Compatibility Matrix */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="w-5 h-5 text-purple-500" />
                  Bảng Tương Thích Nhóm Máu
                </CardTitle>
                <CardDescription>
                  Bảng hiển thị khả năng tương thích giữa người hiến (hàng) và người nhận (cột)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <div className="min-w-[600px]">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr>
                          <th className="border border-gray-300 p-3 bg-gray-100 font-semibold text-sm">Hiến → Nhận</th>
                          {bloodTypes.map((type) => (
                            <th
                              key={type}
                              className="border border-gray-300 p-3 bg-gray-100 font-semibold text-center text-sm min-w-[60px]"
                            >
                              {type}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {bloodTypes.map((donorType) => (
                          <tr key={donorType}>
                            <td className="border border-gray-300 p-3 bg-gray-50 font-semibold text-center text-sm">
                              {donorType}
                            </td>
                            {bloodTypes.map((recipientType) => (
                              <td key={recipientType} className="border border-gray-300 p-3 text-center">
                                <div
                                  className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                                    compatibilityData[donorType as keyof typeof compatibilityData]?.canGiveTo.includes(
                                      recipientType,
                                    )
                                      ? "bg-green-500 text-white hover:bg-green-600"
                                      : "bg-red-500 text-white hover:bg-red-600"
                                  }`}
                                >
                                  {compatibilityData[donorType as keyof typeof compatibilityData]?.canGiveTo.includes(
                                    recipientType,
                                  )
                                    ? "✓"
                                    : "✗"}
                                </div>
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="flex items-center gap-6 mt-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <span>Tương thích</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                    <span>Không tương thích</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Important Information */}
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-800">
                  <AlertCircle className="w-5 h-5" />
                  Thông Tin Quan Trọng
                </CardTitle>
              </CardHeader>
              <CardContent className="text-orange-800 space-y-3">
                <ul className="list-disc list-inside space-y-2 leading-relaxed">
                  <li>
                    <strong>O-</strong> được gọi là "người hiến máu toàn năng" - có thể hiến cho tất cả nhóm máu
                  </li>
                  <li>
                    <strong>AB+</strong> được gọi là "người nhận máu toàn năng" - có thể nhận từ tất cả nhóm máu
                  </li>
                  <li>Luôn cần xét nghiệm tương thích chéo trước khi truyền máu</li>
                  <li>Thông tin này chỉ mang tính chất tham khảo, hãy tham khảo ý kiến bác sĩ</li>
                  <li>Trong trường hợp khẩn cấp, hãy liên hệ ngay với cơ sở y tế gần nhất</li>
                </ul>
              </CardContent>
            </Card>

            {/* Blood Type Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tỷ Lệ Nhóm Máu Trong Dân Số</CardTitle>
                <CardDescription>Phân bố nhóm máu phổ biến (theo thống kê chung)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { type: "O+", percentage: "37%", color: "bg-red-500" },
                    { type: "A+", percentage: "36%", color: "bg-blue-500" },
                    { type: "B+", percentage: "8%", color: "bg-green-500" },
                    { type: "AB+", percentage: "3%", color: "bg-purple-500" },
                    { type: "O-", percentage: "7%", color: "bg-red-400" },
                    { type: "A-", percentage: "6%", color: "bg-blue-400" },
                    { type: "B-", percentage: "2%", color: "bg-green-400" },
                    { type: "AB-", percentage: "1%", color: "bg-purple-400" },
                  ].map((item) => (
                    <div
                      key={item.type}
                      className="text-center p-4 border rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div
                        className={`w-12 h-12 ${item.color} rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold shadow-md`}
                      >
                        {item.type}
                      </div>
                      <div className="text-2xl font-bold text-gray-900">{item.percentage}</div>
                      <div className="text-sm text-gray-600">dân số</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

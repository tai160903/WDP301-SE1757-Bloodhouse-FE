"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, Droplets, Users, AlertCircle } from "lucide-react"

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

export default function MatchBlood() {
  const [selectedBloodType, setSelectedBloodType] = useState<string>("O+")

  const getCompatibilityColor = (fromType: string, toType: string) => {
    return compatibilityData[fromType as keyof typeof compatibilityData]?.canGiveTo.includes(toType)
      ? "bg-green-100 text-green-800 border-green-200"
      : "bg-red-100 text-red-800 border-red-200"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Droplets className="w-8 h-8 text-red-500" />
            <h1 className="text-4xl font-bold text-gray-900">Tương Thích Nhóm Máu</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Tìm hiểu về khả năng tương thích giữa các nhóm máu để hiến và nhận máu an toàn
          </p>
        </div>

        {/* Blood Type Selector */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              Chọn Nhóm Máu Của Bạn
            </CardTitle>
            <CardDescription>Chọn nhóm máu để xem thông tin tương thích chi tiết</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
              {bloodTypes.map((type) => (
                <Button
                  key={type}
                  variant={selectedBloodType === type ? "default" : "outline"}
                  onClick={() => setSelectedBloodType(type)}
                  className="h-12 text-lg font-semibold"
                >
                  {type}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Compatibility Information */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-green-700">Có Thể Hiến Máu Cho</CardTitle>
              <CardDescription>Nhóm máu {selectedBloodType} có thể hiến máu cho các nhóm sau:</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {compatibilityData[selectedBloodType as keyof typeof compatibilityData]?.canGiveTo.map((type) => (
                  <Badge key={type} className="bg-green-100 text-green-800 border-green-200 text-sm px-3 py-1">
                    {type}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-blue-700">Có Thể Nhận Máu Từ</CardTitle>
              <CardDescription>Nhóm máu {selectedBloodType} có thể nhận máu từ các nhóm sau:</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {compatibilityData[selectedBloodType as keyof typeof compatibilityData]?.canReceiveFrom.map((type) => (
                  <Badge key={type} className="bg-blue-100 text-blue-800 border-blue-200 text-sm px-3 py-1">
                    {type}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Compatibility Matrix */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-500" />
              Bảng Tương Thích Nhóm Máu
            </CardTitle>
            <CardDescription>
              Bảng hiển thị khả năng tương thích giữa người hiến (hàng) và người nhận (cột)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border p-2 bg-gray-50 font-semibold">Hiến → Nhận</th>
                    {bloodTypes.map((type) => (
                      <th key={type} className="border p-2 bg-gray-50 font-semibold text-center min-w-[60px]">
                        {type}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bloodTypes.map((donorType) => (
                    <tr key={donorType}>
                      <td className="border p-2 bg-gray-50 font-semibold text-center">{donorType}</td>
                      {bloodTypes.map((recipientType) => (
                        <td key={recipientType} className="border p-2 text-center">
                          <div
                            className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-xs font-bold ${
                              compatibilityData[donorType as keyof typeof compatibilityData]?.canGiveTo.includes(
                                recipientType,
                              )
                                ? "bg-green-500 text-white"
                                : "bg-red-500 text-white"
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
            <div className="flex items-center gap-4 mt-4 text-sm">
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
          <CardContent className="text-orange-800 space-y-2">
            <ul className="list-disc list-inside space-y-1">
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
            <CardTitle>Tỷ Lệ Nhóm Máu Trong Dân Số</CardTitle>
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
                <div key={item.type} className="text-center p-4 border rounded-lg">
                  <div
                    className={`w-12 h-12 ${item.color} rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold`}
                  >
                    {item.type}
                  </div>
                  <div className="text-2xl font-bold">{item.percentage}</div>
                  <div className="text-sm text-gray-600">dân số</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

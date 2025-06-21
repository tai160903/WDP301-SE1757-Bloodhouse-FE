"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Heart,
  User,
  Phone,
  FileText,
  Shield,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Star,
  Users,
} from "lucide-react"

export default function processInfo() {
  const processSteps = [
    {
      id: 1,
      title: "Thông Tin Cá Nhân",
      icon: User,
      description: "Cung cấp thông tin cá nhân cơ bản bao gồm họ tên, ngày sinh, giới tính và các chỉ số cơ thể.",
      requirements: [
        "Họ và tên đầy đủ",
        "Ngày sinh (phải từ 18 tuổi trở lên)",
        "Giới tính",
        "Cân nặng (tối thiểu 50kg)",
        "Nhóm máu (nếu biết)",
      ],
      duration: "3-5 phút",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      id: 2,
      title: "Thông Tin Liên Hệ",
      icon: Phone,
      description:
        "Chia sẻ thông tin liên hệ để chúng tôi có thể liên lạc với bạn về lịch hẹn và thông tin quan trọng.",
      requirements: [
        "Địa chỉ email hợp lệ",
        "Số điện thoại chính",
        "Địa chỉ nhà đầy đủ",
        "Thành phố, tỉnh và mã bưu điện",
      ],
      duration: "2-3 phút",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      id: 3,
      title: "Tiền Sử Bệnh Án",
      icon: FileText,
      description: "Cung cấp thông tin về tình trạng sức khỏe, thuốc đang sử dụng và lịch sử hiến máu trước đây.",
      requirements: [
        "Thuốc đang sử dụng",
        "Dị ứng đã biết",
        "Tình trạng bệnh lý",
        "Ngày hiến máu trước đây",
        "Lịch sử đi du lịch gần đây",
      ],
      duration: "5-7 phút",
      color: "from-purple-500 to-violet-500",
      bgColor: "bg-purple-50",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      id: 4,
      title: "Liên Hệ Khẩn Cấp",
      icon: Heart,
      description: "Chỉ định người mà chúng tôi có thể liên hệ trong trường hợp khẩn cấp trong hoặc sau khi hiến máu.",
      requirements: [
        "Tên người liên hệ khẩn cấp",
        "Số điện thoại",
        "Mối quan hệ với bạn",
        "Liên hệ thay thế (tùy chọn)",
      ],
      duration: "2 phút",
      color: "from-pink-500 to-rose-500",
      bgColor: "bg-pink-50",
      iconBg: "bg-pink-100",
      iconColor: "text-pink-600",
    },
    {
      id: 5,
      title: "Đồng Ý & Điều Khoản",
      icon: Shield,
      description: "Xem xét và đồng ý với các điều khoản, chính sách bảo mật và mẫu đồng ý hiến máu của chúng tôi.",
      requirements: [
        "Đọc các yêu cầu đủ điều kiện",
        "Hiểu quy trình hiến máu",
        "Đồng ý khám sàng lọc sức khỏe",
        "Đồng ý với các điều khoản và điều kiện",
      ],
      duration: "3-5 phút",
      color: "from-orange-500 to-amber-500",
      bgColor: "bg-orange-50",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
    },
  ]

  const eligibilityRequirements = [
    "Từ 18 tuổi trở lên",
    "Cân nặng ít nhất 50kg",
    "Có sức khỏe tổng quát tốt",
    "Chưa hiến máu trong 56 ngày qua",
    "Chưa xăm hình hoặc xỏ khuyên trong 4 tháng qua",
    "Chưa đi du lịch đến một số quốc gia gần đây",
  ]

  const whatToBring = [
    "Giấy tờ tùy thân có ảnh do chính phủ cấp",
    "Danh sách thuốc đang sử dụng",
    "Thông tin tiền sử bệnh án",
    "Thông tin liên hệ khẩn cấp",
  ]

  const stats = [
    { number: "3", label: "Mạng người được cứu", icon: Heart },
    { number: "56", label: "Ngày giữa các lần hiến", icon: Clock },
    { number: "10,000+", label: "Người hiến máu hàng năm", icon: Users },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-red-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 to-pink-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-16 sm:py-24">
          <div className="text-center">
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-red-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
                <div className="relative bg-gradient-to-r from-red-500 to-pink-500 p-4 rounded-full">
                  <Heart className="w-12 h-12 text-white" />
                </div>
              </div>
              <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                Quy Trình Đăng Ký
              </h1>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">Hiến Máu Cứu Người</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8 leading-relaxed">
              Tham gia cùng chúng tôi trong hành trình cứu sống với quy trình đăng ký đơn giản 5 bước. Mỗi lần hiến máu
              của bạn có thể cứu được tới 3 mạng người! ❤️
            </p>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto mb-12">
              {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <div
                    key={index}
                    className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20"
                  >
                    <Icon className="w-8 h-8 text-red-500 mx-auto mb-3" />
                    <div className="text-3xl font-bold text-gray-900 mb-1">{stat.number}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                )
              })}
            </div>

            <div className="flex items-center justify-center gap-3 text-gray-600">
              <Clock className="w-5 h-5" />
              <span className="text-lg">Tổng thời gian: 15-20 phút</span>
              <Star className="w-5 h-5 text-yellow-500" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-16">
        {/* Process Steps */}
        <div className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Các Bước Đăng Ký</h2>
            <p className="text-xl text-gray-600">Quy trình đơn giản và thân thiện</p>
          </div>

          <div className="space-y-8">
            {processSteps.map((step, index) => {
              const Icon = step.icon
              const isEven = index % 2 === 0

              return (
                <div key={step.id} className={`flex items-center gap-8 ${!isEven ? "flex-row-reverse" : ""}`}>
                  {/* Content */}
                  <div className="flex-1">
                    <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg overflow-hidden">
                      <div className={`h-2 bg-gradient-to-r ${step.color}`}></div>
                      <CardHeader className="pb-4">
                        <div className="flex items-start gap-4">
                          <div
                            className={`flex items-center justify-center w-16 h-16 ${step.iconBg} rounded-2xl group-hover:scale-110 transition-transform duration-300`}
                          >
                            <Icon className={`w-8 h-8 ${step.iconColor}`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <Badge variant="outline" className={`${step.iconColor} border-current text-lg px-3 py-1`}>
                                Bước {step.id}
                              </Badge>
                              <Badge variant="secondary" className="text-gray-600 bg-gray-100">
                                <Clock className="w-4 h-4 mr-1" />
                                {step.duration}
                              </Badge>
                            </div>
                            <CardTitle className="text-2xl mb-3 text-gray-900">{step.title}</CardTitle>
                            <CardDescription className="text-lg text-gray-600 leading-relaxed">
                              {step.description}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="ml-20">
                          <h4 className="font-semibold mb-4 text-gray-900 text-lg">Những gì bạn cần cung cấp:</h4>
                          <div className="grid gap-3">
                            {step.requirements.map((req, reqIndex) => (
                              <div
                                key={reqIndex}
                                className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                              >
                                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                                <span className="text-gray-700">{req}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Step Number */}
                  <div className="flex-shrink-0">
                    <div
                      className={`w-24 h-24 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center shadow-lg`}
                    >
                      <span className="text-3xl font-bold text-white">{step.id}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Requirements and Preparation */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {/* Eligibility Requirements */}
          <Card className="shadow-xl border-0 overflow-hidden group hover:shadow-2xl transition-all duration-300">
            <div className="h-2 bg-gradient-to-r from-amber-500 to-orange-500"></div>
            <CardHeader className="bg-gradient-to-br from-amber-50 to-orange-50">
              <div className="flex items-center gap-4">
                <div className="bg-amber-100 p-3 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  <AlertCircle className="w-8 h-8 text-amber-600" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-gray-900">Yêu Cầu Đủ Điều Kiện</CardTitle>
                  <CardDescription className="text-lg text-gray-600 mt-2">
                    Đảm bảo bạn đáp ứng các yêu cầu cơ bản này
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {eligibilityRequirements.map((req, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors"
                  >
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-lg">{req}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* What to Bring */}
          <Card className="shadow-xl border-0 overflow-hidden group hover:shadow-2xl transition-all duration-300">
            <div className="h-2 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
            <CardHeader className="bg-gradient-to-br from-blue-50 to-cyan-50">
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  <FileText className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-gray-900">Những Gì Cần Mang Theo</CardTitle>
                  <CardDescription className="text-lg text-gray-600 mt-2">
                    Chuẩn bị sẵn để đăng ký suôn sẻ
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {whatToBring.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
                  >
                    <CheckCircle className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-lg">{item}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Important Notes */}
        <Card className="mb-12 border-0 shadow-xl overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-purple-500 to-pink-500"></div>
          <CardHeader className="bg-gradient-to-br from-purple-50 to-pink-50">
            <div className="flex items-center gap-4">
              <div className="bg-purple-100 p-3 rounded-2xl">
                <AlertCircle className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-2xl text-purple-900">Lưu Ý Quan Trọng</CardTitle>
                <CardDescription className="text-lg text-purple-700 mt-2">
                  Hướng dẫn chuẩn bị trước và sau đăng ký
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="font-bold text-xl text-gray-900 mb-4">Trước Khi Đăng Ký:</h4>
                <div className="space-y-3">
                  {[
                    "Ăn một bữa ăn lành mạnh 2-3 giờ trước",
                    "Uống đủ nước",
                    "Ngủ đủ giấc",
                    "Tránh rượu bia 24 giờ trước",
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-bold text-xl text-gray-900 mb-4">Sau Khi Đăng Ký:</h4>
                <div className="space-y-3">
                  {[
                    "Bạn sẽ nhận được email xác nhận",
                    "Chúng tôi sẽ lên lịch hẹn hiến máu",
                    "Bạn có thể theo dõi lịch sử hiến máu",
                    "Nhận cập nhật về các chiến dịch hiến máu",
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                      <CheckCircle className="w-5 h-5 text-blue-500" />
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="inline-block border-0 shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-red-600 via-pink-600 to-rose-600 p-12 text-white relative">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative space-y-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-white/20 rounded-full blur-xl animate-pulse"></div>
                  <Heart className="w-20 h-20 mx-auto relative" />
                </div>
                <h3 className="text-4xl font-bold">Sẵn Sàng Cứu Sống?</h3>
                <p className="text-xl text-red-100 max-w-lg mx-auto leading-relaxed">
                  Bắt đầu đăng ký hiến máu ngay bây giờ và tham gia cùng hàng nghìn anh hùng tạo nên sự khác biệt.
                </p>
                <Button
                  size="lg"
                  className="bg-white text-red-600 hover:bg-gray-100 text-xl px-8 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  Bắt Đầu Quy Trình Đăng Ký
                  <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search, Droplet, HeartPulse, UserCheck, Shield } from 'lucide-react';
import { BloodTypeInfo } from '@/pages/home/components/blood-type-info';

const infoCards = [
  {
    icon: Droplet,
    title: 'Nhóm máu là gì?',
    content: `Máu được phân loại theo kháng nguyên A và B. Có 4 nhóm máu chính: A, B, AB, O.`,
  },
  {
    icon: Shield,
    title: 'Yếu tố Rh là gì?',
    content: `Rh là protein trên hồng cầu. Có hai loại Rh+ và Rh-.`,
  },
  {
    icon: HeartPulse,
    title: 'Tại sao nên hiến máu?',
    content: `Hiến máu giúp cứu sống người khác, đồng thời có lợi cho sức khỏe người hiến.`,
  },
  {
    icon: UserCheck,
    title: 'Ai có thể hiến máu?',
    content: `Từ 18-60 tuổi, nặng >45kg, không mắc bệnh truyền nhiễm.`,
  },
];

const BloodInformationPage = () => {
  return (
    <div className="bg-gradient-to-br from-red-50 to-white min-h-screen text-gray-800">
      <section className="text-center py-12 px-4 bg-red-600 text-white shadow-md">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Thông Tin Về Máu</h1>
        <p className="max-w-2xl mx-auto text-lg">
          Hiểu rõ về nhóm máu, yếu tố Rh, và lý do tại sao hiến máu là hành động cao cả cứu người.
        </p>
      </section>

      <section className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto py-12 px-6">
        {infoCards.map(({ icon: Icon, title, content }, idx) => (
          <div
            key={idx}
            className="bg-white border-l-4 border-red-500 shadow-md rounded-md p-6 hover:shadow-lg transition duration-300"
          >
            <div className="flex items-center gap-3 mb-4">
              <Icon className="text-red-600 w-6 h-6" />
              <h2 className="text-xl font-semibold text-red-600">{title}</h2>
            </div>
            <p className="text-gray-700">{content}</p>
          </div>
        ))}
      </section>

      <section className="bg-white py-12 px-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Lưu ý sau khi hiến máu</h2>
        <ul className="list-disc ml-6 text-gray-700 space-y-2">
          <li>Uống nhiều nước và nghỉ ngơi hợp lý.</li>
          <li>Không tập thể dục gắng sức trong 24h đầu.</li>
          <li>Bổ sung thức ăn giàu sắt (thịt đỏ, rau xanh).</li>
        </ul>
      </section>

      <section className="bg-red-50 py-16 mt-12 border-t">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-red-600">Tìm Nhóm Máu Tương Thích</h2>
          <p className="text-gray-600 mt-2">
            Sử dụng công cụ dưới đây để xem ai có thể hiến hoặc nhận máu từ bạn.
          </p>
        </div>

        <div className="max-w-4xl mx-auto px-4">
          <Tabs defaultValue="whole-blood" className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="whole-blood">Máu toàn phần</TabsTrigger>
              <TabsTrigger value="red-cells">Hồng cầu</TabsTrigger>
              <TabsTrigger value="plasma">Huyết tương</TabsTrigger>
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

          <div className="flex justify-center mt-6">
            <Button asChild>
              <Link to="/compatibility">
                <Search className="mr-2 h-4 w-4" /> Khám phá thêm
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="text-center text-sm text-gray-500 py-6 mt-12 border-t">
        © 2025 BloodHouse. Thông tin chỉ mang tính tham khảo. Hãy hỏi ý kiến chuyên gia y tế.
      </footer>
    </div>
  );
};

export default BloodInformationPage;

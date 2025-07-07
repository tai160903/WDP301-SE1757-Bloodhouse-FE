import React, { useEffect } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

const FAQWithImage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-r from-red-50 to-white flex items-center justify-center p-0">
      <div className="relative w-full max-w-4xl p-0">
        <section className="bg-white shadow-2xl rounded-lg overflow-hidden mt-16">
          <div className="flex flex-col md:flex-row items-center gap-6 p-6">
            <div className="md:w-1/2 flex flex-col items-center">
              <img
                src="https://cdn4.iconfinder.com/data/icons/medical-115/60/medical-flat-098-heart-beat-512.png"
                alt="Hiến máu"
                className="w-full max-w-[200px] h-auto object-contain rounded-lg"
              />
              <p className="mt-4 text-gray-600 text-sm text-center">
                Mỗi giọt máu bạn hiến là một món quà sự sống cho cộng đồng.
              </p>
              <a
                href="/auth/register"
                className="mt-4 inline-block py-2 px-4 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Đăng Ký Hiến Máu
              </a>
            </div>

            {/* Right FAQ */}
            <div className="md:w-1/2">
              <h2 className="text-2xl font-bold text-red-600 mb-4">
                Câu Hỏi Thường Gặp
              </h2>
              <Accordion type="single" collapsible className="space-y-3">
                <AccordionItem value="1">
                  <AccordionTrigger className="text-gray-800 hover:text-red-600">
                    <span className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8 9l3-3 3 3m0 6l-3 3-3-3"
                        />
                      </svg>
                      Ai được phép hiến máu?
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 text-sm">
                    Người khỏe mạnh từ 18-60 tuổi, cân nặng trên 45kg (nữ) hoặc
                    50kg (nam), không mắc bệnh truyền nhiễm như HIV, viêm gan
                    B/C.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="2">
                  <AccordionTrigger className="text-gray-800 hover:text-red-600">
                    <span className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Hiến máu bao lâu một lần?
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 text-sm">
                    Bạn có thể hiến máu toàn phần mỗi 3 tháng một lần, hoặc theo
                    hướng dẫn của bác sĩ đối với các loại hiến máu khác như tiểu
                    cầu.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="3">
                  <AccordionTrigger className="text-gray-800 hover:text-red-600">
                    <span className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 17V7m0 10h6m-6 0H3m6 0h6m0-10h6m-6 0H9"
                        />
                      </svg>
                      Hiến máu có ảnh hưởng đến sức khỏe không?
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 text-sm">
                    Không, hiến máu an toàn nếu bạn đủ điều kiện. Cơ thể tái tạo
                    máu trong 48 giờ, và hiến máu còn giúp cải thiện tuần hoàn
                    máu.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="4">
                  <AccordionTrigger className="text-gray-800 hover:text-red-600">
                    <span className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 6h16M4 12h16m-7 6h7"
                        />
                      </svg>
                      Cần chuẩn bị gì trước khi hiến máu?
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 text-sm">
                    Ngủ đủ giấc, ăn sáng nhẹ, uống nhiều nước và tránh rượu bia
                    trước khi hiến máu để đảm bảo sức khỏe tốt.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="5">
                  <AccordionTrigger className="text-gray-800 hover:text-red-600">
                    <span className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Máu hiến được sử dụng như thế nào?
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 text-sm">
                    Máu hiến được dùng trong phẫu thuật, điều trị ung thư, tai
                    nạn hoặc các bệnh lý như thiếu máu, đảm bảo cứu sống nhiều
                    người.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default FAQWithImage;

import React from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';

export const FAQPage = () => {
  const faqs = [
    {
      q: 'Làm sao để đăng ký bán hàng trên Unipass?',
      a: 'Bạn chỉ cần nhấn vào nút "Trở thành Người bán" trên thanh công cụ, điền form thông tin cá nhân và tải lên ảnh thẻ sinh viên. Ban quản trị sẽ duyệt trong vòng 24h.',
    },
    {
      q: 'Chức năng Trade (Đổi đồ) hoạt động thế nào?',
      a: 'Khi xem chi tiết một sản phẩm, bạn có thể chọn "Đổi đồ", sau đó chọn một món đồ của bạn để đề xuất đổi lấy món đồ đó. Nếu người bán đồng ý, hai bên có thể tự liên hệ để giao dịch.',
    },
    {
      q: 'Gói Premium mang lại quyền lợi gì?',
      a: 'Khi đăng ký gói Premium, bạn sẽ được miễn phí giao dịch, đăng tải sản phẩm không giới hạn, có huy hiệu VIP và sản phẩm được ưu tiên hiển thị trên đầu.',
    },
    {
      q: 'Nếu bị lừa đảo tôi phải làm sao?',
      a: 'Bạn vui lòng vào mục "Báo cáo vi phạm" để cung cấp bằng chứng. Đội ngũ admin của Unipass sẽ khóa tài khoản vi phạm và hỗ trợ bạn giải quyết tranh chấp.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-[#0A2647] to-[#144272] px-8 py-12 text-white text-center">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
            <HelpCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Câu Hỏi Thường Gặp (FAQ)</h1>
          <p className="text-white/80 max-w-2xl mx-auto">Tổng hợp những thắc mắc phổ biến nhất của sinh viên khi sử dụng Unipass.</p>
        </div>

        <div className="p-8 space-y-6">
          {faqs.map((faq, index) => (
            <details
              key={index}
              className="group bg-gray-50 rounded-xl p-6 border border-gray-200 cursor-pointer open:bg-blue-50 open:border-blue-100 transition-colors"
            >
              <summary className="flex items-center justify-between font-bold text-lg text-[#0A2647]">
                {faq.q}
                <ChevronDown className="w-5 h-5 transition-transform group-open:rotate-180" />
              </summary>
              <div className="mt-4 text-gray-600 leading-relaxed pl-2 border-l-2 border-[#FF6B35]">{faq.a}</div>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQPage;

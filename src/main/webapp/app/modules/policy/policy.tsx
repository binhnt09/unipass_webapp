import React from 'react';
import { Shield, Lock, FileText, UserCheck, AlertCircle } from 'lucide-react';

export const PolicyPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-[#0A2647] to-[#144272] px-8 py-12 text-white text-center">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Chính Sách & Bảo Mật</h1>
          <p className="text-white/80 max-w-2xl mx-auto">
            Tại Unipass, chúng tôi cam kết bảo vệ thông tin cá nhân của bạn. Vui lòng đọc kỹ các điều khoản dưới đây để hiểu rõ cách chúng
            tôi thu thập, sử dụng và bảo vệ dữ liệu.
          </p>
        </div>

        {/* Content Section */}
        <div className="p-8 space-y-12">
          {/* Section 1: Thu thập thông tin */}
          <section>
            <div className="flex items-center gap-3 mb-4 text-[#0A2647]">
              <FileText className="w-6 h-6 text-[#FF6B35]" />
              <h2 className="text-xl font-bold">1. Thu thập thông tin cá nhân</h2>
            </div>
            <div className="pl-9 text-gray-600 space-y-3 leading-relaxed">
              <p>Chúng tôi thu thập các thông tin sau khi bạn đăng ký và sử dụng Unipass:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Thông tin tài khoản: Tên đăng nhập, email, số điện thoại, ảnh đại diện.</li>
                <li>Thông tin trường học: Mã sinh viên, tên trường đại học, cơ sở (campus).</li>
                <li>Dữ liệu giao dịch: Lịch sử mua bán, trao đổi đồ, đánh giá (reviews).</li>
                <li>Thông tin vị trí: Được sử dụng để gợi ý các sản phẩm ở gần bạn (chỉ khi bạn cho phép).</li>
              </ul>
            </div>
          </section>

          {/* Section 2: Sử dụng thông tin */}
          <section>
            <div className="flex items-center gap-3 mb-4 text-[#0A2647]">
              <UserCheck className="w-6 h-6 text-[#FF6B35]" />
              <h2 className="text-xl font-bold">2. Mục đích sử dụng thông tin</h2>
            </div>
            <div className="pl-9 text-gray-600 space-y-3 leading-relaxed">
              <p>Dữ liệu của bạn được sử dụng vào các mục đích chính đáng nhằm nâng cao trải nghiệm:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Xác minh danh tính sinh viên để đảm bảo môi trường giao dịch an toàn.</li>
                <li>Kết nối người mua và người bán, xử lý các giao dịch trên nền tảng.</li>
                <li>Cá nhân hóa trải nghiệm và sử dụng AI để gợi ý sản phẩm phù hợp nhất.</li>
                <li>Gửi thông báo về đơn hàng, tin nhắn mới và các cập nhật quan trọng.</li>
              </ul>
            </div>
          </section>

          {/* Section 3: Bảo mật dữ liệu */}
          <section>
            <div className="flex items-center gap-3 mb-4 text-[#0A2647]">
              <Lock className="w-6 h-6 text-[#FF6B35]" />
              <h2 className="text-xl font-bold">3. Cam kết bảo mật</h2>
            </div>
            <div className="pl-9 text-gray-600 space-y-3 leading-relaxed">
              <p>Unipass áp dụng các tiêu chuẩn bảo mật khắt khe:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Tất cả mật khẩu và thông tin nhạy cảm đều được mã hóa một chiều an toàn (Bcrypt).</li>
                <li>Mọi giao dịch và dữ liệu truyền tải đều được bảo vệ bằng giao thức mã hóa SSL/TLS.</li>
                <li>
                  Chúng tôi <strong className="text-gray-900">KHÔNG</strong> bán, trao đổi hoặc cho thuê thông tin cá nhân của bạn cho bất
                  kỳ bên thứ ba nào.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 4: Trách nhiệm người dùng */}
          <section className="bg-orange-50 rounded-xl p-6 border border-orange-100">
            <div className="flex items-center gap-3 mb-4 text-[#FF6B35]">
              <AlertCircle className="w-6 h-6" />
              <h2 className="text-xl font-bold">4. Trách nhiệm của sinh viên</h2>
            </div>
            <div className="text-gray-700 space-y-3 leading-relaxed">
              <p>Để duy trì cộng đồng Unipass văn minh và an toàn, chúng tôi yêu cầu bạn:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Tự bảo mật thông tin đăng nhập và không chia sẻ tài khoản cho người khác.</li>
                <li>Cung cấp thông tin sinh viên trung thực. Các trường hợp giả mạo sẽ bị khóa tài khoản vĩnh viễn.</li>
                <li>Tuân thủ pháp luật và đạo đức khi đăng bán các mặt hàng hoặc trao đổi trên nền tảng.</li>
              </ul>
            </div>
          </section>
        </div>

        {/* Footer info */}
        <div className="bg-gray-50 p-6 text-center text-sm text-gray-500 border-t border-gray-100">
          <p>Cập nhật lần cuối: Tháng 6, 2026</p>
          <p className="mt-1">Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ: support@unipass.edu.vn</p>
        </div>
      </div>
    </div>
  );
};

export default PolicyPage;

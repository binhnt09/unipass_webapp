import React from 'react';
import { BookOpen, ShoppingBag, RefreshCw, Truck } from 'lucide-react';

export const GuidePage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-[#00F5FF] to-[#9B4DFF] px-8 py-12 text-white text-center">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-4 font-space">Hướng Dẫn Mua Bán</h1>
          <p className="text-white/90 max-w-2xl mx-auto">Khám phá cách thức giao dịch an toàn và nhanh chóng trên Unipass.</p>
        </div>

        <div className="p-8 grid gap-8 md:grid-cols-3">
          <div className="bg-blue-50 rounded-2xl p-6 text-center border border-blue-100">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-blue-900 mb-2">1. Mua Hàng</h3>
            <p className="text-sm text-gray-600">
              Tìm kiếm món đồ yêu thích, thêm vào giỏ hàng hoặc mua ngay. Thanh toán tiện lợi qua MoMo, VNPay hoặc tiền mặt.
            </p>
          </div>

          <div className="bg-purple-50 rounded-2xl p-6 text-center border border-purple-100">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <RefreshCw className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-purple-900 mb-2">2. Đổi Đồ (Trade)</h3>
            <p className="text-sm text-gray-600">
              Sử dụng tính năng Trade để đề xuất trao đổi đồ cũ với người dùng khác. Thương lượng qua chat và tiến hành đổi.
            </p>
          </div>

          <div className="bg-green-50 rounded-2xl p-6 text-center border border-green-100">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-green-900 mb-2">3. Giao Nhận</h3>
            <p className="text-sm text-gray-600">
              Sau khi thỏa thuận, bạn có thể chọn phương thức vận chuyển hoặc hẹn gặp mặt trực tiếp tại trường học để an toàn hơn.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuidePage;

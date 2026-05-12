import React from 'react';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import { Link } from 'react-router';

export function PurchaseSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full">
        {/* Success Card */}
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          {/* Header with Animation */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-center">
            <div className="relative inline-block">
              <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
                <CheckCircle className="w-20 h-20 text-green-500 animate-[scale-in_0.5s_ease-out]" />
              </div>
              <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-20"></div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 sm:p-10 text-center">
            {/* Main Heading */}
            <h1 className="text-3xl sm:text-4xl font-bold text-[#0A2647] mb-4">Yêu cầu mua hàng đã được gửi!</h1>

            <p className="text-lg text-gray-600 mb-8">Yêu cầu của bạn đã được gửi thành công đến người bán. Vui lòng đợi xác nhận.</p>

            {/* Status Box */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 mb-8 border-2 border-yellow-200">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <Package className="w-5 h-5 text-yellow-900" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-bold text-yellow-900 mb-1 text-lg">Trạng thái: Đang chờ người bán xác nhận</h3>
                  <p className="text-sm text-yellow-800">
                    Người bán sẽ xem xét yêu cầu của bạn và phản hồi trong vòng 24-48 giờ. Bạn sẽ nhận được thông báo qua email.
                  </p>
                </div>
              </div>
            </div>

            {/* Order Details Summary */}
            <div className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-200">
              <h3 className="font-bold text-[#0A2647] mb-4 text-left">Chi tiết yêu cầu</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Mã yêu cầu:</span>
                  <span className="font-mono font-bold text-[#0A2647]">RQ2024031904</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Thời gian gửi:</span>
                  <span className="font-medium text-gray-900">19/03/2026 14:32</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Người bán:</span>
                  <span className="font-medium text-gray-900">Nguyễn Văn A</span>
                </div>
                <div className="pt-3 border-t border-gray-300">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900">Tổng giá trị:</span>
                    <span className="text-2xl font-bold text-green-600">12.500.000đ</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <Link
                to="/orders"
                className="w-full py-4 bg-gradient-to-r from-[#FF6B35] to-[#FF5722] hover:from-[#FF5722] hover:to-[#FF6B35] text-white rounded-xl font-bold text-lg transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <Package className="w-5 h-5" />
                Xem đơn hàng của tôi
                <ArrowRight className="w-5 h-5" />
              </Link>

              <Link to="/" className="block w-full text-[#0A2647] hover:text-[#FF6B35] font-medium transition-colors py-2">
                ← Quay lại trang chủ
              </Link>
            </div>

            {/* Additional Info */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>💡 Mẹo:</strong> Bạn có thể liên hệ trực tiếp với người bán qua tin nhắn để trao đổi thêm về sản phẩm trong khi chờ
                xác nhận.
              </p>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="font-bold text-[#0A2647] mb-4">Các bước tiếp theo</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-[#FF6B35] rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                1
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Chờ xác nhận</h4>
                <p className="text-sm text-gray-600">Người bán sẽ xem xét yêu cầu và xác nhận trong vòng 24-48 giờ</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-[#FF6B35] rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                2
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Nhận thông báo</h4>
                <p className="text-sm text-gray-600">Bạn sẽ nhận email và thông báo khi người bán phản hồi</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-[#FF6B35] rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                3
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Hoàn tất giao dịch</h4>
                <p className="text-sm text-gray-600">Nếu được chấp nhận, tiến hành thanh toán và nhận hàng</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

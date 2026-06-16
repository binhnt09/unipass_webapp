import React from 'react';
import { CheckCircle, Crown, ArrowRight } from 'lucide-react';
import { Link } from 'react-router';

export function PremiumSuccessPage() {
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
            <h1 className="text-3xl sm:text-4xl font-bold text-[#0A2647] mb-4">Thanh toán thành công!</h1>

            <p className="text-lg text-gray-600 mb-8">Bạn đã đăng ký gói Premium thành công. Cảm ơn bạn đã sử dụng dịch vụ của UniMart.</p>

            {/* Status Box */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 mb-8 border-2 border-yellow-200">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <Crown className="w-5 h-5 text-yellow-900" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-bold text-yellow-900 mb-1 text-lg">Tài khoản Premium đã được kích hoạt</h3>
                  <p className="text-sm text-yellow-800">
                    Gói dịch vụ của bạn đã được áp dụng vào tài khoản. Hãy bắt đầu trải nghiệm các tính năng dành riêng cho người bán
                    Premium ngay bây giờ!
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <Link
                to="/account"
                className="w-full py-4 bg-gradient-to-r from-[#FF6B35] to-[#FF5722] hover:from-[#FF5722] hover:to-[#FF6B35] text-white rounded-xl font-bold text-lg transition-all shadow-lg flex items-center justify-center gap-2"
              >
                Vào trang quản lý tài khoản
                <ArrowRight className="w-5 h-5" />
              </Link>

              <Link to="/" className="block w-full text-[#0A2647] hover:text-[#FF6B35] font-medium transition-colors py-2">
                ← Quay lại trang chủ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PremiumSuccessPage;

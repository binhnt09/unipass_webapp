import React from 'react';
import { Check, Crown, Star, TrendingUp, Zap, Shield, Sparkles, AlertCircle } from 'lucide-react';
import { Link, useSearchParams } from 'react-router';

export const PremiumPlansPage = () => {
  const [searchParams] = useSearchParams();
  const paymentStatus = searchParams.get('payment');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          {paymentStatus === 'error' && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center justify-center gap-3 max-w-2xl mx-auto">
              <AlertCircle className="w-6 h-6 text-red-500" />
              <p className="text-red-700 font-medium">Thanh toán thất bại hoặc có lỗi xảy ra. Vui lòng thử lại.</p>
            </div>
          )}
          {paymentStatus === 'cancel' && (
            <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center justify-center gap-3 max-w-2xl mx-auto">
              <AlertCircle className="w-6 h-6 text-yellow-500" />
              <p className="text-yellow-700 font-medium">Bạn đã hủy quá trình thanh toán.</p>
            </div>
          )}

          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-[#0A2647] px-4 py-2 rounded-full font-medium text-sm mb-4">
            <Crown className="w-4 h-4" />
            Gói người bán Premium
          </div>
          <h1 className="text-4xl font-bold text-[#0A2647] mb-4">Tăng tốc doanh số bán hàng</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Mở khóa các tính năng mạnh mẽ để tăng khả năng hiển thị và bán hàng nhanh hơn trên UniMart
          </p>
        </div>

        {/* Pricing Cards - 3 Cards Side by Side */}
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
          {/* Card 1: Gói Cơ bản (Free) */}
          <div className="bg-white rounded-2xl shadow-md border-2 border-gray-200 p-8 transition-all hover:shadow-lg flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Gói Cơ bản</h3>
                <p className="text-sm text-gray-600 mt-1">Hoàn hảo để bắt đầu</p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-gray-600" />
              </div>
            </div>

            <div className="mb-8">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-gray-900">Miễn phí</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">Miễn phí mãi mãi</p>
            </div>

            <div className="space-y-4 mb-8 flex-grow">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-green-600" />
                </div>
                <span className="text-gray-700">Đăng tối đa 10 sản phẩm</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-green-600" />
                </div>
                <span className="text-gray-700">Phân tích cơ bản</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-green-600" />
                </div>
                <span className="text-gray-700">Hỗ trợ tiêu chuẩn</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-green-600" />
                </div>
                <span className="text-gray-700">Truy cập cộng đồng</span>
              </div>
            </div>

            <button disabled className="w-full py-3 bg-gray-100 text-gray-500 rounded-lg font-medium cursor-not-allowed text-center block">
              Đang sử dụng
            </button>
          </div>

          {/* Card 2: Gói Tiêu chuẩn (99.000đ) - Elevated/Featured */}
          <div className="bg-white rounded-2xl shadow-xl border-4 border-[#FF6B35] p-8 transition-all hover:shadow-2xl transform md:scale-105 relative flex flex-col">
            {/* Popular Badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#FF6B35] to-[#FF5722] text-white px-6 py-1.5 text-sm font-bold rounded-full shadow-lg">
              PHỔ BIẾN NHẤT
            </div>

            <div className="flex items-center justify-between mb-6 mt-2">
              <div>
                <h3 className="text-2xl font-bold text-[#0A2647]">Gói Tiêu chuẩn</h3>
                <p className="text-sm text-gray-600 mt-1">Hiển thị tốt hơn</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-[#FF6B35] to-[#FF5722] rounded-full flex items-center justify-center flex-shrink-0">
                <Star className="w-6 h-6 text-white" />
              </div>
            </div>

            <div className="mb-8">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-[#0A2647]">99.000đ</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">Thanh toán hàng tháng</p>
            </div>

            <div className="space-y-4 mb-8 flex-grow">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-[#FF6B35] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <div>
                  <span className="text-gray-900 font-medium">Đăng tối đa 50 sản phẩm</span>
                  <p className="text-xs text-gray-600 mt-0.5">Tăng giới hạn sản phẩm</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-[#FF6B35] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <TrendingUp className="w-3 h-3 text-white" />
                </div>
                <div>
                  <span className="text-gray-900 font-medium">Hiển thị ưu tiên</span>
                  <p className="text-xs text-gray-600 mt-0.5">Xuất hiện cao hơn trong kết quả</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-[#FF6B35] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
                <div>
                  <span className="text-gray-900 font-medium">Huy hiệu xác minh</span>
                  <p className="text-xs text-gray-600 mt-0.5">Nổi bật với huy hiệu đặc biệt</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-[#FF6B35] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <span className="text-gray-900 font-medium">Phân tích nâng cao</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-[#FF6B35] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <span className="text-gray-900 font-medium">Hỗ trợ ưu tiên</span>
              </div>
            </div>

            <Link
              to="/payment"
              state={{
                itemName: 'Gói Tiêu chuẩn',
                price: 99000,
                description: 'Hiển thị tốt hơn',
              }}
              className="w-full py-3 bg-gradient-to-r from-[#FF6B35] to-[#FF5722] hover:from-[#FF5722] hover:to-[#FF6B35] text-white rounded-lg font-medium transition-all shadow-lg text-center block"
            >
              Chọn gói này
            </Link>
          </div>

          {/* Card 3: Gói VIP Pro (199.000đ) */}
          <div className="bg-gradient-to-br from-[#0A2647] to-[#144272] rounded-2xl shadow-xl border-2 border-[#FFD700] p-8 transition-all hover:shadow-2xl relative flex flex-col">
            {/* Premium Badge */}
            <div className="absolute -top-3 -right-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#FFD700] to-[#FFA500] rounded-full flex items-center justify-center shadow-lg animate-pulse">
                <Crown className="w-6 h-6 text-[#0A2647]" />
              </div>
            </div>

            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-white">Gói VIP Pro</h3>
                <p className="text-sm text-white/80 mt-1">Cấp độ cao nhất</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-[#FFD700] to-[#FFA500] rounded-full flex items-center justify-center flex-shrink-0">
                <Zap className="w-6 h-6 text-[#0A2647]" />
              </div>
            </div>

            <div className="mb-8">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-white">199.000đ</span>
              </div>
              <p className="text-sm text-white/60 mt-2">Thanh toán hàng tháng</p>
            </div>

            <div className="space-y-4 mb-8 flex-grow">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-[#FFD700] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-[#0A2647]" />
                </div>
                <div>
                  <span className="text-white font-medium">Sản phẩm không giới hạn</span>
                  <p className="text-xs text-white/60 mt-0.5">Đăng bao nhiêu sản phẩm cũng được</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-[#FFD700] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Star className="w-3 h-3 text-[#0A2647]" />
                </div>
                <div>
                  <span className="text-white font-medium">Ghim sản phẩm</span>
                  <p className="text-xs text-white/60 mt-0.5">Giữ 3 sản phẩm ở vị trí đầu</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-[#FFD700] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <TrendingUp className="w-3 h-3 text-[#0A2647]" />
                </div>
                <div>
                  <span className="text-white font-medium">Ưu tiên tìm kiếm hàng đầu</span>
                  <p className="text-xs text-white/60 mt-0.5">Xuất hiện đầu tiên trong tìm kiếm</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-[#FFD700] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Zap className="w-3 h-3 text-[#0A2647]" />
                </div>
                <div>
                  <span className="text-white font-medium">Đề xuất AI thông minh</span>
                  <p className="text-xs text-white/60 mt-0.5">Gợi ý giá và danh mục thông minh</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-[#FFD700] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-[#0A2647]" />
                </div>
                <div>
                  <span className="text-white font-medium">Phân tích chi tiết</span>
                  <p className="text-xs text-white/60 mt-0.5">Báo cáo chuyên sâu</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-[#FFD700] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-[#0A2647]" />
                </div>
                <div>
                  <span className="text-white font-medium">Hỗ trợ ưu tiên 24/7</span>
                  <p className="text-xs text-white/60 mt-0.5">Hỗ trợ chuyên dụng</p>
                </div>
              </div>
            </div>

            <Link
              to="/payment"
              state={{
                itemName: 'Gói VIP Pro',
                price: 199000,
                description: 'Cấp độ cao nhất',
              }}
              className="w-full py-3 bg-gradient-to-r from-[#FFD700] to-[#FFA500] hover:from-[#FFC700] hover:to-[#FF9500] text-[#0A2647] rounded-lg font-medium transition-all shadow-lg text-center block"
            >
              Chọn gói này
            </Link>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="max-w-4xl mx-auto mt-16">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h3 className="text-xl font-bold text-[#0A2647] mb-6 text-center">Tại sao nâng cấp lên Premium?</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-6 h-6 text-[#0A2647]" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">Bán nhanh hơn 3x</h4>
                <p className="text-sm text-gray-600">Người bán Premium bán nhanh gấp 3 lần nhờ khả năng hiển thị tốt hơn</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Star className="w-6 h-6 text-[#FF6B35]" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">Đánh giá cao hơn</h4>
                <p className="text-sm text-gray-600">Huy hiệu xác minh giúp tăng độ tin cậy và thu hút nhiều người mua hơn</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">Hỗ trợ tận tâm</h4>
                <p className="text-sm text-gray-600">Nhận hỗ trợ ưu tiên và giải quyết vấn đề nhanh chóng</p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mt-12">
          <h3 className="text-2xl font-bold text-[#0A2647] mb-6 text-center">Câu hỏi thường gặp</h3>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y divide-gray-200">
            <div className="p-6">
              <h4 className="font-medium text-gray-900 mb-2">Tôi có thể hủy bất cứ lúc nào không?</h4>
              <p className="text-sm text-gray-600">
                Có! Bạn có thể hủy gói đăng ký bất cứ lúc nào. Không có ràng buộc hợp đồng hay phí hủy.
              </p>
            </div>
            <div className="p-6">
              <h4 className="font-medium text-gray-900 mb-2">Điều gì xảy ra khi tôi nâng cấp?</h4>
              <p className="text-sm text-gray-600">
                Tất cả tính năng Premium được kích hoạt ngay lập tức sau khi thanh toán thành công. Sản phẩm của bạn sẽ được hiển thị tốt
                hơn trong vòng vài phút.
              </p>
            </div>
            <div className="p-6">
              <h4 className="font-medium text-gray-900 mb-2">Tôi có thể thay đổi gói sau này không?</h4>
              <p className="text-sm text-gray-600">
                Có! Bạn có thể nâng cấp hoặc hạ cấp gói bất cứ lúc nào. Thay đổi sẽ có hiệu lực từ chu kỳ thanh toán tiếp theo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumPlansPage;

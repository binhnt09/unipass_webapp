/* eslint-disable @typescript-eslint/no-base-to-string */
import React, { useState } from 'react';
import { Wallet, CheckCircle, ArrowLeft, Shield, Loader2 } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router';
import axios from 'axios';

export function PaymentPage() {
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState<'momo' | 'sepay' | null>('sepay');
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const orderData = location.state || {
    itemName: 'Gói người bán cao cấp - Hàng tháng',
    price: 199000,
    description: 'Truy cập đầy đủ vào tính năng Premium trong 30 ngày',
  };

  const handleConfirmPayment = async () => {
    if (!selectedMethod) {
      alert('Vui lòng chọn phương thức thanh toán');
      return;
    }

    if (selectedMethod === 'momo') {
      navigate('/payment/momo', { state: orderData });
    } else if (selectedMethod === 'sepay') {
      setLoading(true);
      try {
        const response = await axios.post('/api/payment/sepay/initiate-checkout', {
          itemName: orderData.itemName,
          price: orderData.price,
        });

        const { checkoutUrl, fields } = response.data;

        // Tạo form ẩn và submit sang SePay
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = checkoutUrl;

        Object.entries(fields).forEach(([key, value]) => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = String(value);
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
      } catch (error) {
        console.error('Lỗi khi khởi tạo thanh toán SePay:', error);
        alert('Có lỗi xảy ra khi khởi tạo thanh toán. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Link to="/premium" className="inline-flex items-center gap-2 text-[#0A2647] hover:text-[#FF6B35] mb-6 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Quay lại trang đăng ký Premium</span>
        </Link>

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0A2647] mb-2">Trang Thanh Toán</h1>
          <p className="text-gray-600">Chọn phương thức thanh toán để hoàn tất đơn hàng</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Payment Methods */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-[#0A2647] mb-6">Chọn phương thức thanh toán</h2>

              <div className="space-y-4">
                {/* SePay Option */}
                <button
                  type="button"
                  disabled={loading}
                  className={`block w-full p-5 border-2 rounded-xl transition-all text-left ${
                    selectedMethod === 'sepay'
                      ? 'border-[#FF6B35] bg-orange-50 shadow-md'
                      : 'border-gray-300 hover:border-gray-400 hover:shadow-sm'
                  }`}
                  onClick={() => setSelectedMethod('sepay')}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Wallet className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="font-bold text-gray-900 text-lg mb-1">Chuyển khoản Ngân hàng (SePay / VietQR)</h3>
                      <p className="text-sm text-gray-600">Thanh toán tự động bằng cách quét mã QR qua ngân hàng</p>
                    </div>
                    {selectedMethod === 'sepay' && <CheckCircle className="w-6 h-6 text-[#FF6B35] flex-shrink-0" />}
                  </div>
                </button>

                {/* MoMo Option */}
                <button
                  type="button"
                  disabled={loading}
                  className={`block w-full p-5 border-2 rounded-xl transition-all text-left ${
                    selectedMethod === 'momo'
                      ? 'border-[#FF6B35] bg-orange-50 shadow-md'
                      : 'border-gray-300 hover:border-gray-400 hover:shadow-sm'
                  }`}
                  onClick={() => setSelectedMethod('momo')}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Wallet className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="font-bold text-gray-900 text-lg mb-1">Ví điện tử MoMo</h3>
                      <p className="text-sm text-gray-600">Thanh toán nhanh chóng, bảo mật với ví MoMo</p>
                    </div>
                    {selectedMethod === 'momo' && <CheckCircle className="w-6 h-6 text-[#FF6B35] flex-shrink-0" />}
                  </div>
                </button>
              </div>

              {/* Security Notice */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-[#0A2647] mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-[#0A2647] mb-1">Thanh toán an toàn</h4>
                    <p className="text-xs text-gray-700 leading-relaxed">
                      Mọi giao dịch đều được mã hóa và bảo vệ. Thông tin thanh toán của bạn được xử lý an toàn qua các đối tác thanh toán
                      đáng tin cậy.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
              <h2 className="text-xl font-bold text-[#0A2647] mb-6">Tóm tắt đơn hàng</h2>

              <div className="space-y-4 mb-6">
                {/* Item Details */}
                <div className="pb-4 border-b border-gray-200">
                  <h3 className="font-medium text-gray-900 mb-2">{orderData.itemName}</h3>
                  <p className="text-sm text-gray-600 mb-3">{orderData.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Giá sản phẩm:</span>
                    <span className="text-lg font-bold text-[#0A2647]">{orderData.price.toLocaleString('vi-VN')} đ</span>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Tạm tính:</span>
                    <span className="font-medium text-gray-900">{orderData.price.toLocaleString('vi-VN')} đ</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Phí xử lý:</span>
                    <span className="font-medium text-green-600">Miễn phí</span>
                  </div>
                </div>

                {/* Total */}
                <div className="pt-4 border-t-2 border-gray-300">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900">Tổng cộng:</span>
                    <span className="text-2xl font-bold text-[#FF6B35]">{orderData.price.toLocaleString('vi-VN')} đ</span>
                  </div>
                </div>
              </div>

              {/* Confirm Button */}
              <button
                onClick={handleConfirmPayment}
                disabled={!selectedMethod || loading}
                className={`w-full py-4 rounded-lg font-bold text-lg transition-all shadow-md flex items-center justify-center gap-2 ${
                  selectedMethod && !loading
                    ? 'bg-gradient-to-r from-[#FF6B35] to-[#FF8C5A] hover:from-[#FF5722] hover:to-[#FF6B35] text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                {loading ? 'Đang kết nối cổng thanh toán...' : 'Xác nhận thanh toán'}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">Nhấn xác nhận, bạn đồng ý với điều khoản thanh toán</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

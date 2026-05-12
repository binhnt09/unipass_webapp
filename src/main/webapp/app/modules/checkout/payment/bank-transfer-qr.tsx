import { ArrowLeft, CheckCircle, X, Clock, Copy, Check, Building2, QrCode, ShieldCheck, AlertCircle, Banknote } from 'lucide-react';
import { Link } from 'react-router';
import React, { useState, useEffect } from 'react';

export function BankTransferQRPage() {
  const [isPaid, setIsPaid] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes in seconds
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const orderDetails = {
    orderId: 'UM2024032303',
    amount: 850000,
    itemName: 'Balo laptop chống nước - Nhiều ngăn tiện lợi',
  };

  const bankInfo = {
    bankName: 'Ngân hàng TMCP Á Châu',
    bankShortName: 'ACB',
    accountNumber: '12345678900',
    accountName: 'CONG TY UNIPASS',
    transferContent: `UNIPASS ${orderDetails.orderId}`,
    branch: 'Chi nhánh Hà Nội',
  };

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <Link
          to="/payment"
          className="inline-flex items-center gap-2 text-[#0A2647] hover:text-[#FF6B35] mb-6 transition-colors font-medium group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Quay lại chọn phương thức</span>
        </Link>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
          {/* Header with Bank Branding */}
          <div className="bg-gradient-to-br from-[#059669] via-[#10B981] to-[#059669] p-8 text-center relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full translate-y-20 -translate-x-20"></div>
            <div className="absolute top-1/3 right-1/3 w-20 h-20 bg-white/5 rounded-full"></div>

            <div className="relative z-10">
              <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-2xl">
                <Building2 className="w-12 h-12 text-[#059669]" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Chuyển khoản ngân hàng</h2>
              <p className="text-white/90 text-sm mb-4">Quét QR hoặc chuyển khoản thủ công</p>

              {/* Timer */}
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-5 py-2.5 rounded-full border border-white/30">
                <Clock className="w-5 h-5 text-white" />
                <span className="text-white font-bold text-lg font-mono">{formatTime(timeLeft)}</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Status Badge */}
            <div className="flex items-center justify-center gap-2 mb-8">
              <div className="flex items-center gap-3 bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-3 rounded-full border-2 border-green-200">
                <div className="relative">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-ping absolute"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <span className="text-sm font-bold text-green-700">Đang chờ thanh toán</span>
              </div>
            </div>

            {/* QR Code Section */}
            <div className="mb-8">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 border-2 border-dashed border-gray-300 hover:border-[#059669] transition-colors">
                <div className="bg-white rounded-2xl p-6 shadow-xl">
                  {/* QR Code */}
                  <div className="aspect-square max-w-xs mx-auto bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl flex items-center justify-center p-8 border-4 border-[#059669]">
                    <div className="w-full h-full bg-white rounded-xl grid grid-cols-10 gap-1 p-4">
                      {[...Array(100)].map((_, i) => (
                        <div key={i} className={`${Math.random() > 0.5 ? 'bg-[#0A2647]' : 'bg-white'} rounded-sm`} />
                      ))}
                    </div>
                  </div>

                  {/* QR Label */}
                  <div className="text-center mt-4">
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-emerald-100 px-4 py-2 rounded-full">
                      <QrCode className="w-4 h-4 text-[#059669]" />
                      <span className="text-sm font-bold text-[#059669]">Mã QR Chuyển khoản</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Instructions */}
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">Quét mã QR bằng ứng dụng ngân hàng để chuyển khoản tự động</p>
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 my-8">
              <div className="flex-1 h-px bg-gray-300"></div>
              <span className="text-sm font-medium text-gray-500">HOẶC</span>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>

            {/* Bank Details */}
            <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-2xl p-6 mb-6 border-2 border-green-200 shadow-md">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 bg-[#059669] rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-[#0A2647] text-lg">Thông tin chuyển khoản</h3>
              </div>
              <div className="space-y-3">
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-500">Ngân hàng</span>
                    <span className="text-xs font-bold text-white bg-[#059669] px-2 py-1 rounded">{bankInfo.bankShortName}</span>
                  </div>
                  <div className="font-bold text-[#0A2647]">{bankInfo.bankName}</div>
                  <div className="text-xs text-gray-500 mt-1">{bankInfo.branch}</div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <span className="text-xs font-medium text-gray-500 block mb-1">Số tài khoản</span>
                      <div className="font-mono font-bold text-[#0A2647] text-lg">{bankInfo.accountNumber}</div>
                    </div>
                    <button
                      onClick={() => copyToClipboard(bankInfo.accountNumber, 'accountNumber')}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      {copiedField === 'accountNumber' ? (
                        <Check className="w-5 h-5 text-green-600" />
                      ) : (
                        <Copy className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <span className="text-xs font-medium text-gray-500 block mb-1">Chủ tài khoản</span>
                      <div className="font-bold text-[#0A2647]">{bankInfo.accountName}</div>
                    </div>
                    <button
                      onClick={() => copyToClipboard(bankInfo.accountName, 'accountName')}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      {copiedField === 'accountName' ? (
                        <Check className="w-5 h-5 text-green-600" />
                      ) : (
                        <Copy className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-4 border-2 border-red-200 shadow-sm">
                  <div className="flex items-start gap-2 mb-2">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <span className="text-xs font-bold text-red-700 block mb-1">Nội dung chuyển khoản (BẮT BUỘC)</span>
                      <div className="font-mono font-bold text-red-700 text-lg">{bankInfo.transferContent}</div>
                    </div>
                    <button
                      onClick={() => copyToClipboard(bankInfo.transferContent, 'transferContent')}
                      className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      {copiedField === 'transferContent' ? (
                        <Check className="w-5 h-5 text-green-600" />
                      ) : (
                        <Copy className="w-5 h-5 text-red-600" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-red-700 font-medium">
                    ⚠️ Vui lòng nhập chính xác nội dung này để đơn hàng được xác nhận tự động
                  </p>
                </div>

                <div className="bg-gradient-to-r from-[#059669] to-[#10B981] rounded-xl p-5 shadow-lg">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-base">Số tiền cần chuyển</span>
                    <span className="text-3xl font-bold text-white">{orderDetails.amount.toLocaleString('vi-VN')}đ</span>
                  </div>
                </div>
              </div>
            </div>

            {/* How to Transfer */}
            <div className="mb-8">
              <h4 className="text-sm font-bold text-[#0A2647] mb-3">Hướng dẫn chuyển khoản</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3 bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="w-6 h-6 bg-[#059669] text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm">
                    1
                  </div>
                  <p className="text-sm text-gray-700">
                    <strong className="text-[#0A2647]">Mở ứng dụng ngân hàng</strong> hoặc Internet Banking
                  </p>
                </div>
                <div className="flex items-start gap-3 bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="w-6 h-6 bg-[#059669] text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm">
                    2
                  </div>
                  <p className="text-sm text-gray-700">
                    <strong className="text-[#0A2647]">Chuyển khoản</strong> đến thông tin tài khoản bên trên
                  </p>
                </div>
                <div className="flex items-start gap-3 bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="w-6 h-6 bg-[#059669] text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm">
                    3
                  </div>
                  <p className="text-sm text-gray-700">
                    <strong className="text-[#0A2647]">Nhập chính xác nội dung</strong> chuyển khoản:{' '}
                    <span className="font-mono text-red-600 font-bold">{bankInfo.transferContent}</span>
                  </p>
                </div>
                <div className="flex items-start gap-3 bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="w-6 h-6 bg-[#059669] text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm">
                    4
                  </div>
                  <p className="text-sm text-gray-700">
                    <strong className="text-[#0A2647]">Xác nhận và hoàn tất</strong> giao dịch
                  </p>
                </div>
              </div>
            </div>

            {/* Order Details */}
            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-6 mb-6 border-2 border-indigo-200 shadow-md">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-[#0A2647] rounded-lg flex items-center justify-center">
                  <Banknote className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-[#0A2647] text-lg">Chi tiết đơn hàng</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between bg-white rounded-xl p-4 shadow-sm">
                  <span className="text-sm text-gray-600">Mã đơn hàng</span>
                  <span className="font-mono font-bold text-[#0A2647]">{orderDetails.orderId}</span>
                </div>
                <div className="flex items-start justify-between bg-white rounded-xl p-4 shadow-sm">
                  <span className="text-sm text-gray-600">Sản phẩm</span>
                  <span className="font-medium text-gray-900 text-sm text-right max-w-xs">{orderDetails.itemName}</span>
                </div>
              </div>
            </div>

            {/* Security Badge */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <ShieldCheck className="w-5 h-5 text-green-600" />
              <span className="text-sm text-gray-600">Giao dịch sẽ được xác nhận tự động sau 1-5 phút</span>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => setIsPaid(true)}
                className="w-full py-4 bg-gradient-to-r from-[#059669] via-[#10B981] to-[#059669] hover:shadow-xl text-white rounded-xl font-bold text-lg transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-6 h-6" />
                Tôi đã chuyển khoản
              </button>
              <Link
                to="/payment"
                className="w-full py-3.5 bg-white border-2 border-gray-300 hover:bg-gray-50 hover:border-[#059669] text-gray-700 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
              >
                <X className="w-5 h-5" />
                Hủy và chọn phương thức khác
              </Link>
            </div>

            {/* Warning */}
            <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border-2 border-amber-200">
              <p className="text-sm text-amber-800 text-center font-medium">
                ⏱️ <strong>Lưu ý:</strong> Vui lòng chuyển khoản trong {formatTime(timeLeft)}. Đơn hàng sẽ tự động hủy nếu không nhận được
                thanh toán.
              </p>
            </div>
          </div>
        </div>

        {/* Payment Success Modal */}
        {isPaid && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center animate-in">
              <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                <CheckCircle className="w-14 h-14 text-green-600" />
              </div>
              <h3 className="text-3xl font-bold text-[#0A2647] mb-3">Đã gửi xác nhận!</h3>
              <p className="text-gray-600 mb-8 text-lg">
                Chúng tôi đang xác minh giao dịch chuyển khoản của bạn. Bạn sẽ nhận được thông báo trong vài phút.
              </p>
              <div className="space-y-3">
                <Link
                  to="/purchase-success"
                  className="w-full py-4 bg-gradient-to-r from-[#FF6B35] to-[#FF5722] hover:from-[#FF5722] hover:to-[#FF6B35] text-white rounded-xl font-bold text-lg transition-all inline-block shadow-lg"
                >
                  Xem chi tiết đơn hàng
                </Link>
                <Link
                  to="/"
                  className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors inline-block"
                >
                  Quay về trang chủ
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

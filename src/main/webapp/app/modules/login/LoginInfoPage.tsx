import { Link } from 'react-router';
import { ShoppingBag, LayoutDashboard, User, Lock, Mail, Copy, Check, Shield, CheckCircle, Home } from 'lucide-react';
import React, { useState } from 'react';

export function LoginInfoPage() {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-orange-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 bg-[#0A2647] rounded-2xl flex items-center justify-center shadow-xl">
              <span className="text-white font-bold text-3xl">U</span>
            </div>
            <h1 className="text-4xl font-bold text-[#0A2647]">Unipass Demo</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Chào mừng bạn đến với Unipass! Sử dụng tài khoản demo bên dưới để trải nghiệm đầy đủ tính năng của hệ thống.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-[#FF6B35] hover:bg-[#FF5722] text-white rounded-lg font-medium transition-colors shadow-md"
          >
            <Home className="w-5 h-5" />
            Về trang chủ
          </Link>
        </div>

        {/* Demo Accounts */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Buyer Account */}
          <div className="bg-white rounded-2xl shadow-xl border-2 border-blue-200 overflow-hidden hover:shadow-2xl transition-shadow">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-6 text-white">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <User className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Tài khoản Người mua</h3>
                  <p className="text-blue-100 text-sm">Buyer Account</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm bg-white/20 rounded-lg px-3 py-2">
                <Shield className="w-4 h-4" />
                <span>Xem đơn hàng, giỏ hàng, tin nhắn</span>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-2">Tên người dùng</label>
                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <span className="font-medium text-gray-900">Minh Hoàng</span>
                  <User className="w-5 h-5 text-gray-400" />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-2">Email đăng nhập</label>
                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <span className="font-mono text-sm text-gray-900">buyer@fpt.edu.vn</span>
                  <button
                    onClick={() => copyToClipboard('buyer@fpt.edu.vn', 'buyer-email')}
                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                    title="Sao chép email"
                  >
                    {copiedField === 'buyer-email' ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-2">Mật khẩu</label>
                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <span className="font-mono text-sm text-gray-900">buyer123</span>
                  <button
                    onClick={() => copyToClipboard('buyer123', 'buyer-pass')}
                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                    title="Sao chép mật khẩu"
                  >
                    {copiedField === 'buyer-pass' ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* University */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-2">Trường đại học</label>
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <span className="text-sm text-gray-900">ĐH FPT</span>
                </div>
              </div>

              {/* Features */}
              <div className="pt-4 border-t border-gray-200">
                <p className="text-xs font-medium text-gray-500 mb-3">Tính năng có thể truy cập:</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Xem đơn mua của tôi</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Quản lý giỏ hàng</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Nhắn tin với người bán</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Xem chi tiết sản phẩm</span>
                  </div>
                </div>
              </div>

              <Link
                to="/orders"
                className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-md"
              >
                <ShoppingBag className="w-5 h-5" />
                Xem đơn mua của tôi
              </Link>
            </div>
          </div>

          {/* Seller Account */}
          <div className="bg-white rounded-2xl shadow-xl border-2 border-orange-200 overflow-hidden hover:shadow-2xl transition-shadow">
            <div className="bg-gradient-to-br from-[#FF6B35] to-[#FF5722] p-6 text-white">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <LayoutDashboard className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Tài khoản Người bán</h3>
                  <p className="text-orange-100 text-sm">Seller Account</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm bg-white/20 rounded-lg px-3 py-2">
                <Shield className="w-4 h-4" />
                <span>Quản lý sản phẩm + tất cả tính năng</span>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-2">Tên người dùng</label>
                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <span className="font-medium text-gray-900">Nam Nguyễn</span>
                  <User className="w-5 h-5 text-gray-400" />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-2">Email đăng nhập</label>
                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <span className="font-mono text-sm text-gray-900">seller@fpt.edu.vn</span>
                  <button
                    onClick={() => copyToClipboard('seller@fpt.edu.vn', 'seller-email')}
                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                    title="Sao chép email"
                  >
                    {copiedField === 'seller-email' ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-2">Mật khẩu</label>
                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <span className="font-mono text-sm text-gray-900">seller123</span>
                  <button
                    onClick={() => copyToClipboard('seller123', 'seller-pass')}
                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                    title="Sao chép mật khẩu"
                  >
                    {copiedField === 'seller-pass' ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* University */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-2">Trường đại học</label>
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <span className="text-sm text-gray-900">ĐH FPT</span>
                </div>
              </div>

              {/* Features */}
              <div className="pt-4 border-t border-gray-200">
                <p className="text-xs font-medium text-gray-500 mb-3">Tính năng có thể truy cập:</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Quản lý sản phẩm đã đăng</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Quản lý yêu cầu mua hàng</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Đăng sản phẩm mới</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>+ Tất cả tính năng người mua</span>
                  </div>
                </div>
              </div>

              <Link
                to="/seller-dashboard"
                className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-[#FF6B35] hover:bg-[#FF5722] text-white rounded-lg font-medium transition-colors shadow-md"
              >
                <LayoutDashboard className="w-5 h-5" />
                Quản lý bán hàng
              </Link>
            </div>
          </div>
        </div>

        {/* How to Use */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-[#0A2647] mb-6 flex items-center gap-2">
            <Shield className="w-6 h-6 text-[#FF6B35]" />
            Hướng dẫn sử dụng
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 text-blue-600 font-bold">
                1
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Đăng nhập vào hệ thống</h3>
                <p className="text-gray-600 text-sm">
                  Click vào nút &quot;Đăng nhập&quot; ở góc trên bên phải, sau đó nhập email và mật khẩu của tài khoản bạn muốn thử nghiệm.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 text-blue-600 font-bold">
                2
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Khám phá tính năng</h3>
                <p className="text-gray-600 text-sm">
                  <strong>Người mua:</strong> Xem đơn hàng, quản lý giỏ hàng, chat với người bán.
                  <br />
                  <strong>Người bán:</strong> Quản lý sản phẩm, xem yêu cầu mua hàng, đăng sản phẩm mới.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 text-blue-600 font-bold">
                3
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Đăng xuất và thử tài khoản khác</h3>
                <p className="text-gray-600 text-sm">
                  Click vào avatar ở góc trên bên phải, chọn &quot;Đăng xuất&quot; để thoát và thử nghiệm với tài khoản còn lại.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-50 to-orange-50 rounded-xl border-2 border-blue-200">
            <Mail className="w-5 h-5 text-[#FF6B35]" />
            <p className="text-sm text-gray-700">
              <strong>Lưu ý:</strong> Đây là tài khoản demo, dữ liệu sẽ được reset định kỳ
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

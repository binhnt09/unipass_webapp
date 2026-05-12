import React, { useState } from 'react';
import { X, Mail, Lock, User, GraduationCap, Shield, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from 'app/contexts/AuthContext';

interface AuthModalProps {
  onClose: () => void;
}

export function AuthModal({ onClose }: AuthModalProps) {
  const { login: authLogin, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [emailError, setEmailError] = useState(false);
  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [showDemoAccounts, setShowDemoAccounts] = useState(true);
  const [loginError, setLoginError] = useState(false);
  const [loading, setLoading] = useState(false);

  // Close modal when login successful
  React.useEffect(() => {
    if (isAuthenticated) {
      onClose();
    }
  }, [isAuthenticated, onClose]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoginError(false);

    const success = authLogin(emailValue, passwordValue);
    if (success) {
      onClose();
    } else {
      setLoginError(true);
    }
    setLoading(false);
  };

  const quickLogin = (email: string, password: string) => {
    setLoading(true);
    setLoginError(false);

    const success = authLogin(email, password);
    if (success) {
      onClose();
    } else {
      setLoginError(true);
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-[#0A2647] text-white p-6 relative sticky top-0 z-10">
          <button onClick={onClose} className="absolute top-4 right-4 p-1 hover:bg-white/10 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 bg-[#FF6B35] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">U</span>
            </div>
            <span className="text-2xl font-bold">Unipass</span>
          </div>
          <p className="text-white/80 text-sm">Chợ trường an toàn của bạn</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 sticky top-[120px] bg-white z-10">
          <button
            onClick={() => {
              setActiveTab('login');
            }}
            className={`flex-1 py-4 px-6 font-medium text-sm transition-colors relative ${
              activeTab === 'login' ? 'text-[#FF6B35] bg-orange-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Đăng nhập
            {activeTab === 'login' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF6B35]"></div>}
          </button>
          <button
            onClick={() => {
              setActiveTab('register');
            }}
            className={`flex-1 py-4 px-6 font-medium text-sm transition-colors relative ${
              activeTab === 'register' ? 'text-[#FF6B35] bg-orange-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Đăng ký
            {activeTab === 'register' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF6B35]"></div>}
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Demo Accounts Info */}
              {showDemoAccounts && (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border-2 border-blue-200">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-blue-600" />
                      <h4 className="font-bold text-blue-900">Tài khoản Demo</h4>
                    </div>
                    <button type="button" onClick={() => setShowDemoAccounts(false)} className="text-blue-600 hover:text-blue-800 text-sm">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {/* Buyer Account */}
                    <div className="bg-white rounded-lg p-3 border border-blue-200">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium text-gray-900 text-sm">👤 Người mua</p>
                          <p className="text-xs text-gray-600 mt-1">buyer@fpt.edu.vn</p>
                          <p className="text-xs text-gray-500">Mật khẩu: buyer123</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => quickLogin('buyer@fpt.edu.vn', 'buyer123')}
                          disabled={loading}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white text-xs rounded-md transition-colors disabled:cursor-not-allowed"
                        >
                          {loading ? '...' : 'Đăng nhập'}
                        </button>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <CheckCircle className="w-3 h-3 text-green-600" />
                        <span>Xem đơn mua, giỏ hàng, tin nhắn</span>
                      </div>
                    </div>

                    {/* Seller Account */}
                    <div className="bg-white rounded-lg p-3 border border-blue-200">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium text-gray-900 text-sm">🏪 Người bán</p>
                          <p className="text-xs text-gray-600 mt-1">seller@fpt.edu.vn</p>
                          <p className="text-xs text-gray-500">Mật khẩu: seller123</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => quickLogin('seller@fpt.edu.vn', 'seller123')}
                          disabled={loading}
                          className="px-3 py-1.5 bg-[#FF6B35] hover:bg-[#FF5722] disabled:bg-gray-400 text-white text-xs rounded-md transition-colors disabled:cursor-not-allowed"
                        >
                          {loading ? '...' : 'Đăng nhập'}
                        </button>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <CheckCircle className="w-3 h-3 text-green-600" />
                        <span>Quản lý sản phẩm + tất cả tính năng</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {loginError && (
                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-3 flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">Email hoặc mật khẩu không đúng. Vui lòng thử lại.</p>
                </div>
              )}

              <div>
                <label className="block text-sm text-gray-700 mb-2 font-medium">Email trường đại học</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={emailValue}
                    onChange={e => setEmailValue(e.target.value)}
                    placeholder="tencuaban@truongdaihoc.edu.vn"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2 font-medium">Mật khẩu</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    value={passwordValue}
                    onChange={e => setPasswordValue(e.target.value)}
                    placeholder="Nhập mật khẩu của bạn"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-gray-300 text-[#FF6B35] focus:ring-[#FF6B35]" />
                  <span className="text-gray-700">Ghi nhớ đăng nhập</span>
                </label>
                <a href="#" className="text-[#FF6B35] hover:text-[#FF5722]">
                  Quên mật khẩu?
                </a>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#FF6B35] hover:bg-[#FF5722] disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors shadow-md disabled:cursor-not-allowed"
              >
                {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </button>

              <div className="flex items-center gap-2 text-xs text-gray-500 bg-blue-50 p-3 rounded-lg">
                <Shield className="w-4 h-4 text-[#0A2647]" />
                <span>Đăng nhập bảo mật với xác thực email trường đại học</span>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Họ và tên</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Nguyễn Văn A"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Email trường đại học (.edu)</label>
                <div className="relative">
                  <GraduationCap
                    className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${emailError ? 'text-red-400' : 'text-gray-400'}`}
                  />
                  <input
                    type="email"
                    value={emailValue}
                    onChange={e => {
                      setEmailValue(e.target.value);
                      setEmailError(!e.target.value.endsWith('.edu') && !e.target.value.endsWith('.edu.vn'));
                    }}
                    placeholder="tencuaban@truongdaihoc.edu.vn"
                    className={`w-full pl-10 pr-10 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                      emailError
                        ? 'border-red-500 focus:ring-2 focus:ring-red-200 bg-red-50/50'
                        : 'border-gray-300 focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent'
                    }`}
                  />
                  {emailError && <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />}
                </div>
                {emailError && (
                  <div className="mt-2 flex items-start gap-2 text-sm text-red-600">
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>
                      <strong>Email không hợp lệ:</strong> Bạn phải sử dụng email trường đại học .edu hoặc .edu.vn đã xác thực để đăng ký.
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Mật khẩu</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    placeholder="Tạo mật khẩu"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                  />
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-orange-50 p-4 rounded-lg border border-[#FF6B35]/20">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-[#FF6B35] mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-[#0A2647] mb-1">Môi trường không lừa đảo</h4>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Đăng ký yêu cầu xác thực email trường đại học. Chỉ sinh viên và giảng viên đã xác thực mới có thể truy cập Unipass,
                      đảm bảo chợ giao dịch an toàn và đáng tin cậy.
                    </p>
                  </div>
                </div>
              </div>

              <button className="w-full py-3 bg-[#FF6B35] hover:bg-[#FF5722] text-white rounded-lg font-medium transition-colors shadow-md">
                Tạo tài khoản
              </button>

              <p className="text-xs text-gray-500 text-center">
                Bằng việc đăng ký, bạn đồng ý với Điều khoản dịch vụ và Chính sách bảo mật của chúng tôi
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

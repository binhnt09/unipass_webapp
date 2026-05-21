import React, { useEffect, useState } from 'react';
import { X, Mail, Lock, User, GraduationCap, Shield, AlertCircle, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { translate } from 'react-jhipster';
import { useAuth } from 'app/contexts/AuthContext';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { login as loginRedux } from 'app/shared/reducers/authentication'; // Action login thật
import { handleRegister, reset as resetRegister } from 'app/modules/account/register/register.reducer';
import PasswordStrengthBar from 'app/shared/layout/password/password-strength-bar';

interface AuthModalProps {
  onClose: () => void;
  onLoginSuccess?: () => void;
  defaultTab?: 'login' | 'register';
}

export function AuthModal({ onClose, onLoginSuccess, defaultTab = 'login' }: AuthModalProps) {
  const navigate = useNavigate();
  const { login: authLogin, isAuthenticated, user } = useAuth();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(defaultTab);
  const [emailError, setEmailError] = useState(false);
  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [showDemoAccounts, setShowDemoAccounts] = useState(true);
  const [loading, setLoading] = useState(false);

  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [registerLoading, setRegisterLoading] = useState(false);

  const [loginErrorMessage, setLoginErrorMessage] = useState<string | null>(null);

  const dispatch = useAppDispatch();
  const isAuthenticatedRedux = useAppSelector(state => state.authentication.isAuthenticated);
  const loginErrorRedux = useAppSelector(state => state.authentication.loginError);
  const loginErrorMessageFromServer = useAppSelector(state => state.authentication.errorMessage);
  const currentLocale = useAppSelector(state => state.locale.currentLocale);
  const { successMessage, registrationFailure, errorMessage } = useAppSelector(state => state.register);

  const account = useAppSelector(state => state.authentication.account);

  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
  // const passwordPattern = /^.*$/;
  const isPasswordValid = (password: string) => passwordPattern.test(password);

  useEffect(() => {
    return () => {
      dispatch(resetRegister());
    };
  }, [dispatch]);

  useEffect(() => {
    setLoginErrorMessage(null);
  }, [activeTab]);

  useEffect(() => {
    if (successMessage) {
      toast.success(translate(successMessage));
      setRegisterName('');
      setRegisterEmail('');
      setRegisterPassword('');
      setRegisterConfirmPassword('');
      setRegisterError(null);
      setRegisterLoading(false);
    }
  }, [successMessage]);

  useEffect(() => {
    if (registrationFailure) {
      setRegisterError(errorMessage || 'Đăng ký thất bại. Vui lòng thử lại.');
      setRegisterLoading(false);
    }
  }, [registrationFailure, errorMessage]);

  useEffect(() => {
    if (loginErrorRedux) {
      setLoading(false);
      if (loginErrorMessageFromServer?.includes('was not found')) {
        setLoginErrorMessage('Tài khoản chưa tồn tại. Vui lòng đăng ký trước.');
      } else if (loginErrorMessageFromServer?.includes('not activated')) {
        setLoginErrorMessage('Tài khoản chưa được kích hoạt. Vui lòng kiểm tra email xác nhận.');
      } else {
        setLoginErrorMessage('Email hoặc mật khẩu không đúng. Vui lòng thử lại.');
      }
    }
  }, [loginErrorRedux, loginErrorMessageFromServer]);

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerName.trim()) {
      setRegisterError('Vui lòng nhập đầy đủ họ và tên.');
      return;
    }
    if (!registerEmail) {
      setRegisterError('Vui lòng nhập email.');
      return;
    }
    if (emailError) {
      setRegisterError('Email phải là .edu hoặc .edu.vn.');
      return;
    }
    if (!registerPassword) {
      setRegisterError('Vui lòng nhập mật khẩu.');
      return;
    }
    if (!isPasswordValid(registerPassword)) {
      setRegisterError('Mật khẩu phải tối thiểu 6 ký tự và gồm chữ hoa, chữ thường, số và ký tự đặc biệt.');
      return;
    }
    if (registerPassword !== registerConfirmPassword) {
      setRegisterError('Mật khẩu xác nhận không khớp.');
      return;
    }
    setRegisterError(null);
    setRegisterLoading(true);
    try {
      await dispatch(
        handleRegister({
          login: registerEmail,
          email: registerEmail,
          password: registerPassword,
          langKey: currentLocale,
        }),
      ).unwrap();
    } catch {
      // Error will be handled by redux slice
    } finally {
      setRegisterLoading(false);
    }
  };

  // Close modal when login successful
  // Close modal and redirect when login successful
  React.useEffect(() => {
    // Điều kiện: Đã login Demo HOẶC đã login Thật và có thông tin account
    if (isAuthenticated || (isAuthenticatedRedux && account)) {
      let targetPath = '';

      // 1. LUỒNG KIỂM TRA QUYỀN CHO BACKEND THẬT (JHIPSTER)
      if (isAuthenticatedRedux && account) {
        const roles = account.authorities || [];
        if (roles.includes('ROLE_ADMIN')) {
          targetPath = '/admin/user-management'; // Vào thẳng quản lý user tạm thời như bạn muốn
        } else {
          targetPath = '/'; // Các quyền khác (User thường) ở lại trang chủ
        }
      }

      // 2. LUỒNG KIỂM TRA QUYỀN CHO DEMO (CONTEXT)
      else if (isAuthenticated && user) {
        if (user.role === 'admin') {
          targetPath = '/admin/user-management'; // Cập nhật luôn cho đồng bộ với bản thật
        } else if (user.role === 'seller') {
          targetPath = '/seller-dashboard';
        } else {
          targetPath = '/';
        }
      }

      // 执行 chuyển hướng (nếu có đường dẫn dịch chuyển)
      if (targetPath) {
        navigate(targetPath);
      }

      // Sau khi điều hướng xong mới tiến hành đóng modal
      if (onLoginSuccess) {
        onLoginSuccess();
      } else {
        onClose();
      }
    }

    if (loginErrorRedux) {
      setLoading(false);
    }
  }, [isAuthenticated, isAuthenticatedRedux, account, loginErrorRedux, onClose, onLoginSuccess, navigate, user]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoginErrorMessage(null);

    if (!emailValue.trim()) {
      setLoginErrorMessage('Vui lòng nhập email hoặc tên đăng nhập.');
      setLoading(false);
      return;
    }
    if (!passwordValue) {
      setLoginErrorMessage('Vui lòng nhập mật khẩu.');
      setLoading(false);
      return;
    }
    if (!isPasswordValid(passwordValue)) {
      setLoginErrorMessage('Mật khẩu phải tối thiểu 6 ký tự và gồm chữ hoa, chữ thường, số và ký tự đặc biệt.');
      setLoading(false);
      return;
    }

    dispatch(loginRedux(emailValue, passwordValue, true));
  };

  const quickLogin = (email: string, password: string) => {
    setLoading(true);
    setLoginErrorMessage(null);

    const success = authLogin(email, password);
    if (success) {
      if (onLoginSuccess) {
        onLoginSuccess();
      } else {
        onClose();
      }
    } else {
      setLoginErrorMessage('Email hoặc mật khẩu không đúng. Vui lòng thử lại.');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-[#0A2647] text-white p-6 sticky top-0 z-10">
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

                    {/* Admin Account */}
                    <div className="bg-white rounded-lg p-3 border border-blue-200">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium text-gray-900 text-sm">⚙️ Quản trị viên</p>
                          <p className="text-xs text-gray-600 mt-1">admin@fpt.edu.vn</p>
                          <p className="text-xs text-gray-500">Mật khẩu: admin123</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => quickLogin('admin@fpt.edu.vn', 'admin123')}
                          disabled={loading}
                          className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white text-xs rounded-md transition-colors disabled:cursor-not-allowed"
                        >
                          {loading ? '...' : 'Đăng nhập'}
                        </button>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <CheckCircle className="w-3 h-3 text-green-600" />
                        <span>Quản lý hệ thống, trang Admin</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {(loginErrorMessage || loginErrorRedux) && (
                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-3 flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{loginErrorMessage || 'Email hoặc mật khẩu không đúng. Vui lòng thử lại.'}</p>
                </div>
              )}

              <div>
                <label className="block text-sm text-gray-700 mb-2 font-medium">Email trường đại học</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
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
                <p className="mt-2 text-xs text-gray-500">Mật khẩu tối thiểu 6 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt.</p>
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
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              {registerError && (
                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-3 flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{registerError}</p>
                </div>
              )}

              <div>
                <label className="block text-sm text-gray-700 mb-2">Họ và tên</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={registerName}
                    onChange={e => setRegisterName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                    required
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
                    value={registerEmail}
                    onChange={e => {
                      setRegisterEmail(e.target.value);
                      setEmailError(!e.target.value.endsWith('.edu') && !e.target.value.endsWith('.edu.vn'));
                    }}
                    placeholder="tencuaban@truongdaihoc.edu.vn"
                    className={`w-full pl-10 pr-10 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                      emailError
                        ? 'border-red-500 focus:ring-2 focus:ring-red-200 bg-red-50/50'
                        : 'border-gray-300 focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent'
                    }`}
                    required
                  />
                  {emailError && <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />}
                </div>
                {emailError && (
                  <div className="mt-2 flex items-start gap-2 text-sm text-red-600">
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>
                      Email phải có đuôi <strong>.edu</strong> hoặc <strong>.edu.vn</strong>.
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
                    value={registerPassword}
                    onChange={e => setRegisterPassword(e.target.value)}
                    placeholder="Tạo mật khẩu"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                    required
                  />
                </div>
                <PasswordStrengthBar password={registerPassword} />
                <p className="mt-2 text-xs text-gray-500">Mật khẩu tối thiểu 6 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt.</p>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Xác nhận mật khẩu</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    value={registerConfirmPassword}
                    onChange={e => setRegisterConfirmPassword(e.target.value)}
                    placeholder="Nhập lại mật khẩu"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                    required
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

              <button
                type="submit"
                disabled={registerLoading}
                className="w-full py-3 bg-[#FF6B35] hover:bg-[#FF5722] disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors shadow-md disabled:cursor-not-allowed"
              >
                {registerLoading ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
              </button>

              <p className="text-xs text-gray-500 text-center">
                Bằng việc đăng ký, bạn đồng ý với Điều khoản dịch vụ và Chính sách bảo mật của chúng tôi
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

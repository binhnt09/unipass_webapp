import React, { useEffect, useState } from 'react';
import { X, Mail, Lock, User, GraduationCap, Shield, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router';
import { toast } from 'react-toastify';
import { Translate, translate, ValidatedField } from 'react-jhipster';
import { useForm } from 'react-hook-form';
import { useAuth } from 'app/contexts/AuthContext';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { login as loginRedux } from 'app/shared/reducers/authentication'; // Action login thật
import { handleRegister, reset as resetRegister } from 'app/modules/account/register/register.reducer';
import { getEntities as getUniversityEntities } from 'app/entities/university/university.reducer';
import PasswordStrengthBar from 'app/shared/layout/password/password-strength-bar';

interface AuthModalProps {
  onClose: () => void;
  onLoginSuccess?: () => void;
  defaultTab?: 'login' | 'register';
  closeOnLocationChange?: boolean;
}

export function AuthModal({ onClose, onLoginSuccess, defaultTab = 'login', closeOnLocationChange = true }: AuthModalProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const isFirstRender = React.useRef(true);

  const { login: authLogin, isAuthenticated, user } = useAuth();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(defaultTab);
  const [emailError, setEmailError] = useState(false);
  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showDemoAccounts, setShowDemoAccounts] = useState(true);
  const [loading, setLoading] = useState(false);

  const [registerFirstName, setRegisterFirstName] = useState('');
  const [registerLastName, setRegisterLastName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerStudentId, setRegisterStudentId] = useState('');
  const [registerUniversityId, setRegisterUniversityId] = useState<number | ''>('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showRegisterConfirmPassword, setShowRegisterConfirmPassword] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerTermsAccepted, setRegisterTermsAccepted] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [loginErrorMessage, setLoginErrorMessage] = useState<string | null>(null);

  const LOGIN_CACHE_KEY = 'authModalLoginCache';

  const dispatch = useAppDispatch();
  const isAuthenticatedRedux = useAppSelector(state => state.authentication.isAuthenticated);
  const loginErrorRedux = useAppSelector(state => state.authentication.loginError);
  const loginErrorMessageFromServer = useAppSelector(state => state.authentication.errorMessage);
  const currentLocale = useAppSelector(state => state.locale.currentLocale);
  const universities = useAppSelector(state => state.university.entities);
  const { successMessage, registrationFailure, errorMessage } = useAppSelector(state => state.register);

  const account = useAppSelector(state => state.authentication.account);

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors, touchedFields, dirtyFields },
    getValues,
    setValue,
    trigger,
    reset,
  } = useForm<any>({ mode: 'onBlur' });
  const formErrors = errors as Record<string, any>;

  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOGIN_CACHE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as {
          username?: string;
          password?: string;
          rememberMe?: boolean;
        };
        if (parsed.rememberMe) {
          setEmailValue(parsed.username || '');
          setPasswordValue(parsed.password || '');
          setRememberMe(true);
        }
      }
    } catch (error) {
      console.error('Failed to restore remembered login', error);
    }
  }, []);

  useEffect(() => {
    if (rememberMe) {
      try {
        localStorage.setItem(LOGIN_CACHE_KEY, JSON.stringify({ username: emailValue, password: passwordValue, rememberMe }));
      } catch (error) {
        console.error('Failed to save remembered login', error);
      }
    } else {
      localStorage.removeItem(LOGIN_CACHE_KEY);
    }
  }, [rememberMe, emailValue, passwordValue]);

  useEffect(() => {
    setLoginErrorMessage(null);
    if (activeTab === 'register') {
      setRegisterFirstName('');
      setRegisterLastName('');
      setRegisterEmail('');
      setRegisterStudentId('');
      setRegisterUniversityId('');
      setRegisterPassword('');
      setRegisterConfirmPassword('');
      setRegisterError(null);
      setEmailError(false);
      reset();
    }
  }, [activeTab, reset]);

  const emailCustomValidate = (v: any) => {
    const rawSid = (getValues && getValues('studentIdNumber')) || registerStudentId || '';
    const normalizedStudentId = (rawSid || '').toString().trim().toUpperCase();

    if (!normalizedStudentId) return true;

    const batchMatch = normalizedStudentId.match(/^[A-Z]{2}(\d{2})/);

    if (!batchMatch) return true;

    const batch = parseInt(batchMatch[1], 10);
    const normalizedEmail = (v || '').toString().trim().toLowerCase();

    if (batch <= 18) {
      if (!normalizedEmail.endsWith('@fpt.edu.vn')) {
        return translate('register.messages.missing.k18_expected_email');
      }
      const expectedSuffix = `${normalizedStudentId.toLowerCase()}@fpt.edu.vn`;
      if (!normalizedEmail.endsWith(expectedSuffix)) {
        return translate('register.messages.missing.k18_expected_email_1', { expected: expectedSuffix });
      }
      return true;
    }
    if (batch >= 19) {
      if (normalizedEmail.endsWith('@fpt.edu.vn')) {
        return translate('register.messages.missing.k19_forbidden_fpt');
      }
    }
    const trashDomains = ['10minutemail', 'tempmail', 'mailinator', 'dispostable'];
    if (trashDomains.some(domain => normalizedEmail.includes(domain))) {
      return translate('register.messages.missing.disposable_email');
    }
    return true;
  };

  // const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
  const passwordPattern = /^.*$/;
  const isPasswordValid = (password: string) => passwordPattern.test(password);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (closeOnLocationChange !== false) {
      onClose();
    }
  }, [location.pathname, onClose, closeOnLocationChange]);

  useEffect(() => {
    dispatch(getUniversityEntities({ page: 0, size: 100, sort: 'id,asc' }));
    // dispatch(fetchUniversities());
    return () => {
      dispatch(resetRegister());
    };
  }, [dispatch]);

  useEffect(() => {
    setLoginErrorMessage(null);
    // Reset register form khi chuyển sang tab register để tránh autofill
    if (activeTab === 'register') {
      setRegisterFirstName('');
      setRegisterLastName('');
      setRegisterEmail('');
      setRegisterStudentId('');
      setRegisterUniversityId('');
      setRegisterPassword('');
      setRegisterConfirmPassword('');
      setRegisterError(null);
      setEmailError(false);
      reset();
    }
  }, [activeTab, reset]);

  useEffect(() => {
    if (successMessage) {
      toast.success(translate(successMessage));
      setRegisterFirstName('');
      setRegisterLastName('');
      setRegisterEmail('');
      setRegisterStudentId('');
      setRegisterUniversityId('');
      setRegisterPassword('');
      setRegisterConfirmPassword('');
      setRegisterTermsAccepted(false);
      setEmailError(false);
      setRegisterError(null);
      setRegisterLoading(false);
      reset();
    }
  }, [successMessage, reset]);

  useEffect(() => {
    if (registrationFailure) {
      setRegisterError(errorMessage || translate('register.messages.error.fail'));
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

  // const renderEmailHelperText = () => {
  //   if (!registerStudentId || registerStudentId.length < 5) return null;

  //   const match = registerStudentId.match(/^[A-Z]{2}(\d{2})/i);
  //   if (match) {
  //     const batch = parseInt(match[1], 10);
  //     if (batch <= 18) {
  //       return (
  //         <div className="mt-2 text-sm text-blue-600 font-medium">
  //           <Translate contentKey="register.messages.missing.k18_expected_email_1">
  //             Hệ thống yêu cầu bạn nhập đúng Email @fpt.edu.vn chính chủ của mã sinh viên này
  //           </Translate>
  //         </div>
  //       );
  //     }
  //     return (
  //       <div className="mt-2 text-sm text-emerald-600 font-medium">
  //         <Translate contentKey="register.messages.missing.k19_forbidden_fpt_1">
  //           Khóa K19 có thể tự do sử dụng Email cá nhân để đăng ký/Email khác (Không sử dụng đuôi @fpt.edu.vn)
  //         </Translate>
  //       </div>
  //     );
  //   }
  //   return null;
  // };

  const handleRegisterSubmit = async () => {
    const normalizedStudentId = registerStudentId.trim().toUpperCase();
    // const normalizedEmail = registerEmail.trim().toLowerCase(); // Khai báo dùng chung cho chuẩn

    // if (!registerFirstName.trim()) {
    //   setRegisterError(translate('register.messages.missing.missingFirstName'));
    //   return;
    // }
    // if (!registerLastName.trim()) {
    //   setRegisterError(translate('register.messages.missing.missingLastName'));
    //   return;
    // }
    // if (!registerUniversityId) {
    //   setRegisterError(translate('register.messages.missing.missingUniversity'));
    //   return;
    // }
    // if (!normalizedStudentId.trim()) {
    //   setRegisterError(translate('register.messages.missing.missingStudentId'));
    //   return;
    // }
    // if (!/^[A-Z]{2}\d{5,6}$/.test(normalizedStudentId)) {
    //   setRegisterError(translate('register.messages.missing.invalidStudentId'));
    //   return;
    // }
    // if (!registerEmail) {
    //   setRegisterError(translate('register.messages.missing.missingEmail'));
    //   return;
    // }

    // if (!registerPassword) {
    //   setRegisterError(translate('register.messages.missing.missingPassword'));
    //   return;
    // }
    // if (!isPasswordValid(registerPassword)) {
    //   setRegisterError(translate('register.messages.missing.invalidPassword'));
    //   return;
    // }
    // if (registerPassword !== registerConfirmPassword) {
    //   setRegisterError(translate('register.messages.missing.passwords_mismatch'));
    //   return;
    // }
    if (!registerTermsAccepted) {
      setRegisterError(translate('register.messages.missing.terms_required'));
      return;
    }

    setRegisterError(null);
    setRegisterLoading(true);
    try {
      await dispatch(
        handleRegister({
          login: registerEmail.trim().toLowerCase(),
          email: registerEmail.trim().toLowerCase(),
          password: registerPassword,
          langKey: currentLocale,
          firstName: registerFirstName,
          lastName: registerLastName,
          studentIdNumber: normalizedStudentId,
          universityId: Number(registerUniversityId),
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
          targetPath = '/admin/health'; // Vào thẳng quản lý user tạm thời như bạn muốn
        } else {
          targetPath = ''; // Các quyền khác (User thường) ở lại trang chủ
        }
      }
      // 2. LUỒNG KIỂM TRA QUYỀN CHO DEMO (CONTEXT)
      else if (isAuthenticated && user) {
        if (user.role === 'admin') {
          targetPath = '/admin/health'; // Cập nhật luôn cho đồng bộ với bản thật
        } else if (user.role === 'seller') {
          targetPath = '/seller-dashboard';
        } else {
          targetPath = '';
        }
      }
      // Chỉ điều hướng nếu có targetPath (như admin, seller)
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

  const loginUsernameValidate = (value: any) => {
    const val = (value || '').toString().trim();
    // Bỏ qua kiểm tra nếu là tài khoản 'admin' hoặc 'user' (bất kỳ tài khoản bypass nào bạn muốn)
    if (val.toLowerCase() === 'admin') return true;

    // Nếu không phải admin, bắt buộc phải đúng định dạng email
    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!emailRegex.test(val)) {
      return translate('register.messages.missing.invalidEmailSuffix', { default: 'Tên đăng nhập phải là một email hợp lệ.' });
    }
    return true;
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-[#0A2647] text-white p-6 sticky top-0 z-10">
          <button onClick={onClose} className="absolute top-4 right-4 p-1 hover:bg-white/10 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 bg-[#FF6B35] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">U</span>
            </div>
            <span className="text-2xl font-bold">
              <Translate contentKey="global.title">UniPass</Translate>
            </span>
          </div>
          <p className="text-white/80 text-sm">
            <Translate contentKey="global.slogan">Chợ trường an toàn của bạn</Translate>
          </p>
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
            <Translate contentKey="global.menu.account.login">Sign in</Translate>
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
            <Translate contentKey="global.menu.account.register">Register</Translate>
            {activeTab === 'register' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF6B35]"></div>}
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <input type="text" name="hidden-username" autoComplete="off" style={{ display: 'none' }} readOnly />
              <input type="password" name="hidden-password" autoComplete="off" style={{ display: 'none' }} readOnly />
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
                    {/* <div className="bg-white rounded-lg p-3 border border-blue-200">
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
                    </div> */}
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
                <div className="relative flex flex-col justify-center">
                  <Mail className="absolute left-0 top-[24px] -translate-y-1/2 w-5 h-5 text-gray-400 z-10 pointer-events-none" />
                  <ValidatedField
                    name="username"
                    type="text"
                    autoComplete="username"
                    placeholder={translate('global.form.username.placeholder')}
                    validate={{
                      required: {
                        value: true,
                        message: translate('register.messages.missing.missingEmail', { default: 'Tên đăng nhập là bắt buộc.' }),
                      },
                      validate: loginUsernameValidate,
                    }}
                    register={formRegister}
                    error={formErrors.username}
                    isTouched={touchedFields.username}
                    isDirty={dirtyFields.username}
                    value={emailValue}
                    onChange={e => {
                      const val = e.target.value;
                      setEmailValue(val);
                      setValue('username', val);
                      trigger('username'); // Chạy báo lỗi real-time
                    }}
                    className="w-full pl-8"
                    inputClass="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2 font-medium">Mật khẩu</label>
                <div className="relative flex flex-col justify-center">
                  <Lock className="absolute left-0 top-[24px] -translate-y-1/2 w-5 h-5 text-gray-400 z-10 pointer-events-none" />{' '}
                  <ValidatedField
                    name="password"
                    type={showLoginPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder={translate('login.form.password.placeholder')}
                    validate={{
                      required: {
                        value: true,
                        message: translate('register.messages.missing.missingPassword', { default: 'Mật khẩu là bắt buộc.' }),
                      },
                    }}
                    register={formRegister}
                    error={formErrors.password}
                    isTouched={touchedFields.password}
                    isDirty={dirtyFields.password}
                    value={passwordValue}
                    onChange={e => {
                      const val = e.target.value;
                      setPasswordValue(val);
                      setValue('password', val);
                      trigger('password'); // Chạy báo lỗi real-time
                    }}
                    className="w-full pl-8"
                    inputClass="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(prev => !prev)}
                    className="absolute right-3 top-[24px] -translate-y-1/2 text-gray-500 hover:text-[#0A2647]"
                    aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                  >
                    {showLoginPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="mt-2 text-xs text-gray-500">Mật khẩu tối thiểu 6 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt.</p>
              </div>

              <div className="flex items-center justify-between text-sm w-full">
                <div className="inline-flex items-center gap-2 cursor-pointer [&_.form-group]:mb-0 [&_.form-check]:mb-0 [&_.form-check]:p-0 [&_.form-check]:inline-flex [&_.form-check]:items-center">
                  <ValidatedField
                    name="rememberMe"
                    type="checkbox"
                    check
                    label=""
                    checked={rememberMe}
                    register={formRegister}
                    onChange={e => {
                      const target = e.target as HTMLInputElement;
                      setRememberMe(target.checked);
                      setValue('rememberMe', target.checked);
                    }}
                    className="h-4 w-4 rounded border-gray-300 text-[#FF6B35] focus:ring-[#FF6B35] cursor-pointer"
                  />
                  <span className="text-gray-700 select-none whitespace-nowrap">{translate('login.form.rememberme')}</span>
                </div>

                <Link
                  to="/account/reset/request"
                  data-cy="forgetYourPasswordSelector"
                  className="text-[#FF6B35] hover:text-[#FF5722] hover:underline whitespace-nowrap"
                >
                  <Translate contentKey="login.password.forgot">Quên mật khẩu?</Translate>
                </Link>
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

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => setActiveTab('register')}
                  className="text-sm text-gray-500 hover:text-[#FF6B35] transition-colors focus:outline-none font-medium hover:underline"
                >
                  <span>
                    <Translate contentKey="global.messages.info.register.noaccount">You don&apos;t have an account yet?</Translate>
                  </span>{' '}
                  <Translate contentKey="global.messages.info.register.link">Register a new account</Translate>
                </button>
              </div>
            </form>
          ) : (
            // register form
            <form onSubmit={handleSubmit(async () => await handleRegisterSubmit())} className="space-y-4">
              {registerError && (
                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-3 flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{registerError}</p>
                </div>
              )}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">{translate('settings.form.firstname')}</label>
                  <div className="relative flex flex-col justify-center">
                    <User className="absolute left-0 top-[24px] -translate-y-1/2 w-5 h-5 text-gray-400 z-10 pointer-events-none" />
                    <ValidatedField
                      name="firstName"
                      type="text"
                      placeholder={translate('settings.form.firstname.placeholder')}
                      validate={{
                        required: { value: true, message: translate('settings.messages.validate.firstname.required') },
                        minLength: { value: 1, message: translate('settings.messages.validate.firstname.minlength') },
                        maxLength: { value: 50, message: translate('settings.messages.validate.firstname.maxlength') },
                      }}
                      data-cy="firstName"
                      register={formRegister}
                      error={formErrors.firstName}
                      isTouched={touchedFields.firstName}
                      isDirty={dirtyFields.firstName}
                      value={registerFirstName}
                      onChange={e => {
                        const val = e.target.value;
                        setRegisterFirstName(val);
                        setValue('firstName', val);
                        trigger('firstName');
                      }}
                      className="w-full pl-8"
                      inputClass="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">{translate('settings.form.lastname')}</label>
                  <div className="relative flex flex-col justify-center">
                    <User className="absolute left-0 top-[24px] -translate-y-1/2 w-5 h-5 text-gray-400 z-10 pointer-events-none" />
                    <ValidatedField
                      name="lastName"
                      type="text"
                      placeholder={translate('settings.form.lastname.placeholder')}
                      validate={{
                        required: { value: true, message: translate('settings.messages.validate.lastname.required') },
                        minLength: { value: 1, message: translate('settings.messages.validate.lastname.minlength') },
                        maxLength: { value: 50, message: translate('settings.messages.validate.lastname.maxlength') },
                      }}
                      data-cy="lastName"
                      register={formRegister}
                      error={formErrors.lastName}
                      isTouched={touchedFields.lastName}
                      isDirty={dirtyFields.lastName}
                      value={registerLastName}
                      onChange={e => {
                        const val = e.target.value;
                        setRegisterLastName(val);
                        setValue('lastName', val);
                        trigger('lastName');
                      }}
                      className="w-full pl-8"
                      inputClass="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Mã sinh viên</label>
                  <div className="relative flex flex-col justify-center">
                    <User className="absolute left-0 top-[24px] -translate-y-1/2 w-5 h-5 text-gray-400 z-10 pointer-events-none" />
                    <ValidatedField
                      name="studentIdNumber"
                      type="text"
                      placeholder="HE180121"
                      validate={{
                        required: { value: true, message: 'Mã sinh viên là bắt buộc' },
                        pattern: {
                          value: /^[A-Z]{2}\d{5,6}$/,
                          message: 'Mã sinh viên không đúng định dạng FPT (VD: HE18012)',
                        },
                      }}
                      data-cy="studentIdNumber"
                      register={formRegister}
                      error={formErrors.studentIdNumber}
                      isTouched={touchedFields.studentIdNumber}
                      isDirty={dirtyFields.studentIdNumber}
                      value={registerStudentId}
                      onChange={e => {
                        const newValue = e.target.value.toUpperCase();
                        setRegisterStudentId(newValue);
                        setValue('studentIdNumber', newValue);
                        trigger('studentIdNumber');
                        trigger('email');
                      }}
                      className="w-full pl-8"
                      inputClass="uppercase w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                      maxLength={8}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Trường đại học</label>
                  <div className="relative flex flex-col justify-center">
                    <ValidatedField
                      name="universityId"
                      type="select"
                      validate={{
                        required: { value: true, message: translate('register.messages.missing.missingUniversity') },
                      }}
                      register={formRegister}
                      error={formErrors.universityId}
                      isTouched={touchedFields.universityId}
                      isDirty={dirtyFields.universityId}
                      value={registerUniversityId}
                      onChange={e => {
                        const val = e.target.value ? Number(e.target.value) : '';
                        setRegisterUniversityId(val);
                        setValue('universityId', val);
                        trigger('universityId');
                      }}
                      inputClass="w-full appearance-none pl-4 pr-10 py-3 bg-white border border-gray-300 rounded-lg shadow-none focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent text-gray-700"
                    >
                      <option value="" className="text-gray-400 bg-white py-2">
                        Chọn trường
                      </option>
                      {universities.map(university => (
                        <option
                          key={university.id}
                          value={university.id}
                          className="text-gray-700 bg-white py-2 font-medium checked:bg-orange-50"
                        >
                          {university.name || university.universityName || university.fullName || `Trường ${university.id}`}
                        </option>
                      ))}
                    </ValidatedField>
                    <svg
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                      className="absolute right-3 top-[24px] -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10"
                    >
                      <path d="M6 8l4 4 4-4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Email trường đại học (.edu)</label>
                <div className="relative">
                  <GraduationCap
                    className={`absolute left-0 top-[24px] -translate-y-1/2 w-5 h-5 ${emailError ? 'text-red-400' : 'text-gray-400'}`}
                  />
                  <ValidatedField
                    name="email"
                    type="text"
                    placeholder="tencuaban@truongdaihoc.edu.vn"
                    validate={{
                      required: { value: true, message: translate('register.messages.missing.missingEmail') },
                      pattern: { value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/, message: translate('register.messages.missing.invalidEmailSuffix') },
                      validate: emailCustomValidate,
                    }}
                    register={formRegister}
                    error={formErrors.email}
                    isTouched={touchedFields.email}
                    isDirty={dirtyFields.email}
                    value={registerEmail}
                    onChange={e => {
                      const value = e.target.value.trim();
                      setRegisterEmail(value);
                      setValue('email', value);
                      setEmailError(!value.endsWith('.edu') && !value.endsWith('.edu.vn'));
                      trigger('email'); // Thực hiện chạy báo lỗi real-time
                    }}
                    autoComplete="off"
                    className="w-full pl-8"
                    inputClass={`w-full pl-10 pr-10 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                      emailError
                        ? 'border-red-500 focus:ring-2 focus:ring-red-200 bg-red-50/50'
                        : 'border-gray-300 focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent'
                    }`}
                  />
                  {/* {emailError && <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />} */}
                </div>
                {/* {emailError && (
                  <div className="mt-2 flex items-start gap-2 text-sm text-red-600">
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>
                      Email phải có đuôi <strong>.edu</strong> hoặc <strong>.edu.vn</strong>.
                    </span>
                  </div>
                )} */}
                {/* {renderEmailHelperText()} */}
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Mật khẩu</label>
                <div className="relative">
                  <Lock className="absolute left-0 top-[24px] -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <ValidatedField
                    name="password"
                    type={showRegisterPassword ? 'text' : 'password'}
                    placeholder="Tạo mật khẩu"
                    validate={{
                      required: { value: true, message: translate('register.messages.missing.missingPassword') },
                      minLength: { value: 6, message: translate('register.messages.missing.invalidPassword') },
                    }}
                    register={formRegister}
                    error={formErrors.password}
                    isTouched={touchedFields.password}
                    isDirty={dirtyFields.password}
                    value={registerPassword}
                    onChange={e => {
                      const newValue = e.target.value;
                      setRegisterPassword(newValue);
                      setValue('password', newValue);
                      if (registerConfirmPassword) {
                        trigger('confirmPassword');
                      }
                    }}
                    autoComplete="new-password"
                    className="w-full pl-8"
                    inputClass="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegisterPassword(prev => !prev)}
                    className="absolute right-3 top-[24px] -translate-y-1/2 text-gray-500 hover:text-[#0A2647]"
                    aria-label={showRegisterPassword ? 'Hide password' : 'Show password'}
                  >
                    {showRegisterPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <PasswordStrengthBar password={registerPassword} />
                <p className="mt-2 text-xs text-gray-500">Mật khẩu tối thiểu 6 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt.</p>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Xác nhận mật khẩu</label>
                <div className="relative">
                  <Lock className="absolute left-0 top-[24px] -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <ValidatedField
                    name="confirmPassword"
                    type={showRegisterConfirmPassword ? 'text' : 'password'}
                    placeholder="Nhập lại mật khẩu"
                    validate={{
                      required: { value: true, message: translate('register.messages.missing.passwords_mismatch') },
                      validate: value => value === registerPassword || translate('register.messages.missing.passwords_mismatch'),
                    }}
                    register={formRegister}
                    error={formErrors.confirmPassword}
                    isTouched={touchedFields.confirmPassword}
                    isDirty={dirtyFields.confirmPassword}
                    value={registerConfirmPassword}
                    onChange={e => {
                      const newValue = e.target.value;
                      setRegisterConfirmPassword(newValue);
                      setValue('confirmPassword', newValue);
                      trigger('confirmPassword');
                    }}
                    autoComplete="new-password"
                    className="w-full pl-8"
                    inputClass="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegisterConfirmPassword(prev => !prev)}
                    className="absolute right-3 top-[24px] -translate-y-1/2 text-gray-500 hover:text-[#0A2647]"
                    aria-label={showRegisterConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                  >
                    {showRegisterConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
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
              <div className="flex items-start gap-3">
                <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={registerTermsAccepted}
                    onChange={e => setRegisterTermsAccepted(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-[#FF6B35] focus:ring-[#FF6B35]"
                  />
                  <span>
                    Tôi đồng ý với <strong>Điều khoản dịch vụ</strong> và <strong>Chính sách bảo mật</strong> của Unipass.
                  </span>
                </label>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

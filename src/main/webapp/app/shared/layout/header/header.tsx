import React, { useState, useEffect } from 'react';
import { Storage } from 'react-jhipster';
import { NavLink as Link, useNavigate, useLocation } from 'react-router';
import { Bell, ShoppingCart, Crown, MessageCircle, Shield, Loader2, Plus, Download, X, Smartphone, Users } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

import LoadingBar from 'react-redux-loading-bar';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { setLocale } from 'app/shared/reducers/locale';
import { getUnreadCount as fetchUnreadNotificationCount } from 'app/entities/notification/notification.reducer';
import { AccountMenu, LocaleMenu, AdminMenu, EntitiesMenu } from '../menus';
import { AuthModal } from 'app/modules/login/AuthModal';
import { SellerRegistrationModal } from 'app/modules/seller/registration/SellerRegistrationModal';

import { Brand, Home } from './header-components';
import { useAuth } from 'app/contexts/AuthContext';
import { AIChatButton } from 'app/modules/chatboxAI/AIChatButton';

export interface IHeaderProps {
  isAuthenticated: boolean;
  isAdmin: boolean;
  ribbonEnv: string;
  isInProduction: boolean;
  isOpenAPIEnabled: boolean;
  currentLocale: string;
}

const IconLink = ({ to, title, badge, children }: { to: string; title: string; badge?: number | null; children: React.ReactNode }) => {
  const location = useLocation();
  const isActive = location.pathname.startsWith(to);
  return (
    <Link
      to={to}
      title={title}
      className="relative p-2 rounded-2xl transition-all flex items-center justify-center"
      style={{
        color: '#075071',
        textDecoration: 'none',
        background: isActive ? 'rgba(0, 245, 255, 0.15)' : 'transparent',
        border: isActive ? '1px solid rgba(0, 245, 255, 0.3)' : '1px solid transparent',
        boxShadow: isActive ? '0 0 10px rgba(0, 245, 255, 0.2)' : 'none',
      }}
    >
      {children}
      {badge != null && badge > 0 && (
        <span
          className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-bold"
          style={{ background: 'linear-gradient(135deg, #FF2D78, #9B4DFF)', color: '#fff' }}
        >
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </Link>
  );
};

const InstallModal = ({ show, onClose, onConfirm }: { show: boolean; onClose: () => void; onConfirm: () => void }) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div
        className="relative w-full max-w-sm rounded-[24px] p-6 shadow-2xl overflow-hidden transform transition-all"
        style={{
          background: 'linear-gradient(160deg, rgba(20,10,40,0.95) 0%, rgba(9,4,24,0.98) 100%)',
          border: '1px solid rgba(0, 245, 255, 0.2)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.05)',
        }}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-[#00F5FF]/20 rounded-full blur-[40px] pointer-events-none"></div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors border-none cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center mt-2">
          <div
            className="w-20 h-20 rounded-[20px] p-1 shadow-lg mb-4 relative"
            style={{ background: 'linear-gradient(135deg, #00F5FF, #9B4DFF)' }}
          >
            <div className="w-full h-full bg-[#090418] rounded-[16px] flex items-center justify-center overflow-hidden">
              <img src="/content/images/Icon_logo_1.png" alt="Uni Pass App" className="w-12 h-12 object-contain" />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-[#FF2D78] text-white p-1.5 rounded-full border-2 border-[#090418]">
              <Smartphone className="w-4 h-4" />
            </div>
          </div>

          <h3 className="text-xl font-bold text-white mb-2 font-space">Cài đặt Uni Pass</h3>
          <p className="text-sm text-gray-300 mb-6 leading-relaxed">
            Trải nghiệm mượt mà hơn, nhanh hơn và tiện lợi hơn với phiên bản ứng dụng Uni Pass trên thiết bị của bạn.
          </p>

          <div className="flex w-full gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl font-medium text-white transition-colors border-none cursor-pointer"
              style={{ background: 'rgba(255,255,255,0.08)' }}
            >
              Để sau
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-3 px-4 rounded-xl font-bold text-[#090418] transition-transform hover:scale-105 border-none cursor-pointer shadow-[0_0_20px_rgba(0,245,255,0.3)]"
              style={{ background: 'linear-gradient(135deg, #00F5FF, #9B4DFF)' }}
            >
              Cài đặt ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const MobileHeaderMenu = ({
  deferredPrompt,
  handleInitialInstallClick,
  isUserLoggedIn,
  unreadNotificationCount,
  openAuthModal,
  openRegisterModal,
}: {
  deferredPrompt: any;
  handleInitialInstallClick: () => void;
  isUserLoggedIn: boolean;
  unreadNotificationCount: number;
  openAuthModal: () => void;
  openRegisterModal: () => void;
}) => {
  return (
    <div className="flex md:hidden items-center justify-between py-2.5" style={{ height: 56 }}>
      <Brand />

      <div className="flex items-center gap-1">
        {deferredPrompt && (
          <button
            type="button"
            onClick={handleInitialInstallClick}
            className="p-2 rounded-2xl transition-colors flex items-center justify-center border-none cursor-pointer"
            style={{ color: '#00F5FF', background: 'rgba(0,245,255,0.1)' }}
            title="Tải App"
          >
            <Download className="w-5 h-5" />
          </button>
        )}

        <IconLink
          to={isUserLoggedIn ? '/notifications' : '/login'}
          title="Thông báo"
          badge={isUserLoggedIn ? unreadNotificationCount : null}
        >
          <Bell className="w-5 h-5" />
        </IconLink>

        {isUserLoggedIn ? (
          <AccountMenu onLoginClick={openAuthModal} onRegisterClick={openRegisterModal} />
        ) : (
          <div className="flex items-center gap-1 ml-1">
            <button
              type="button"
              onClick={openAuthModal}
              className="px-2.5 py-1.5 rounded-2xl text-xs font-medium text-white hover:bg-white/10 transition-colors border-none outline-none cursor-pointer"
              style={{ background: 'transparent' }}
            >
              Đăng nhập
            </button>
            <button
              type="button"
              onClick={openRegisterModal}
              className="px-3 py-1.5 rounded-full text-xs font-bold text-[#090418] transition-all cursor-pointer border-none outline-none"
              style={{
                background: 'linear-gradient(135deg,#00F5FF,#9B4DFF)',
                boxShadow: '0 0 12px rgba(0,245,255,0.3)',
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              Đăng ký
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const Header = (props: IHeaderProps) => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { isAuthenticated: isDemoAuth, isSeller: isDemoSeller, isAdmin: isDemoAdmin } = useAuth();
  // const [searchQuery, setSearchQuery] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSellerRegModal, setShowSellerRegModal] = useState(false);
  const [authModalDefaultTab, setAuthModalDefaultTab] = useState<'login' | 'register'>('login');
  const [cartCount, setCartCount] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const unreadNotificationCount = useAppSelector(state => state.notification.unreadCount);

  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showCustomInstallModal, setShowCustomInstallModal] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInitialInstallClick = () => {
    if (deferredPrompt) {
      setShowCustomInstallModal(true);
    }
  };

  const handleConfirmInstall = async () => {
    setShowCustomInstallModal(false);
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.warn('User accepted the install prompt');
      } else {
        console.warn('User dismissed the install prompt');
      }
      setDeferredPrompt(null);
    }
  };
  // ================================

  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const navigate = useNavigate();

  const handleSellerButtonClick = async () => {
    if (isCheckingStatus) return;
    setIsCheckingStatus(true);
    try {
      const response = await axios.get('/api/seller-requests/my-status');
      const status = response.data?.status || response.data;

      if (status === 'PENDING' || status === 'REJECTED') {
        setShowSellerRegModal(false);
        navigate('/seller-success');
      } else if (status === 'APPROVED') {
        toast.info('Tài khoản của bạn đã được phê duyệt làm Người bán.');
        navigate('/seller-dashboard');
      } else {
        setShowSellerRegModal(true);
      }
    } catch (err: any) {
      if (err.response?.status === 404) {
        setShowSellerRegModal(true);
      } else {
        console.error('Lỗi kiểm tra trạng thái đăng ký:', err);
        const serverMsg = err.response?.data?.title || err.response?.data?.message;
        toast.error(serverMsg || 'Không thể kiểm tra trạng thái đăng ký. Vui lòng thử lại!');
      }
    } finally {
      setIsCheckingStatus(false);
    }
  };

  const realUser = useAppSelector(state => state.authentication.account);
  const authorities = realUser?.authorities || [];

  const isUserLoggedIn = props.isAuthenticated || isDemoAuth;
  const isUserSeller = isDemoAuth ? isDemoSeller : authorities.includes('ROLE_SELLER');
  const isUserAdmin = isDemoAuth ? isDemoAdmin : authorities.includes('ROLE_ADMIN');
  const isAdmin = props.isAdmin || isUserAdmin;

  const handleLocaleChange = langKey => {
    Storage.session.set('locale', langKey);
    dispatch(setLocale(langKey));
  };

  const fetchCartCount = async () => {
    try {
      const res = await axios.get('/api/cart-items/current-user/items');
      const cartItems = res.data || [];
      setCartCount(cartItems.length);
    } catch (error) {
      console.error('Lỗi lấy số lượng giỏ hàng:', error);
    }
  };

  useEffect(() => {
    if (isUserLoggedIn && !isAdmin) {
      fetchCartCount();
      window.addEventListener('cartUpdated', fetchCartCount);
      dispatch(fetchUnreadNotificationCount());
      return () => {
        window.removeEventListener('cartUpdated', fetchCartCount);
      };
    }
  }, [isUserLoggedIn, isAdmin, dispatch]);

  // ====== UNREAD MESSAGE COUNT POLLING ======
  const fetchUnreadCount = async () => {
    try {
      const res = await axios.get('/api/chat-messages/unread-count');
      setUnreadCount(res.data?.count ?? 0);
    } catch {
      // Silently fail
    }
  };

  useEffect(() => {
    if (!isUserLoggedIn) {
      setUnreadCount(0);
      return;
    }
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [isUserLoggedIn]);

  useEffect(() => {
    const onFocus = () => {
      if (isUserLoggedIn) fetchUnreadCount();
    };
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [isUserLoggedIn]);

  useEffect(() => {
    const onMessageRead = () => setUnreadCount(0);
    window.addEventListener('messagesRead', onMessageRead);
    return () => window.removeEventListener('messagesRead', onMessageRead);
  }, []);
  // ==========================================

  const openAuthModal = () => {
    setAuthModalDefaultTab('login');
    setShowAuthModal(true);
  };
  const openRegisterModal = () => {
    setAuthModalDefaultTab('register');
    setShowAuthModal(true);
  };
  const closeAuthModal = () => setShowAuthModal(false);

  return (
    <div id="app-header" className="fixed inset-x-0 top-0 z-50">
      <LoadingBar className="loading-bar" />
      <nav
        className="relative shadow-xl"
        style={{
          background: 'linear-gradient(160deg, #F8FAFC 0%, #F0F9FF 35%, #EDE9FE 70%, #FDF2F8 100%)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderBottom: '1px solid rgba(0, 245, 255, 0.10)',
        }}
      >
        <div className="px-4 sm:px-6 lg:px-8">
          {/* ════════════════════════════════
              MOBILE HEADER  (< 768px)
              Logo + Auth / AccountMenu only
              ════════════════════════════════ */}
          <MobileHeaderMenu
            deferredPrompt={deferredPrompt}
            handleInitialInstallClick={handleInitialInstallClick}
            isUserLoggedIn={isUserLoggedIn}
            unreadNotificationCount={unreadNotificationCount}
            openAuthModal={openAuthModal}
            openRegisterModal={openRegisterModal}
          />

          {/* ════════════════════════════════
              DESKTOP HEADER  (≥ 768px)
              Full nav with search + all icons
              ════════════════════════════════ */}
          <div className="hidden md:flex items-center justify-between gap-3 py-2">
            <div className="flex items-center gap-4 lg:gap-6 flex-1">
              <Brand />
            </div>

            {/* ── Right side actions ── */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {deferredPrompt && (
                <button
                  type="button"
                  onClick={handleInitialInstallClick}
                  className="flex items-center gap-2 px-4 py-2 rounded-2xl transition-all text-sm font-medium border-none cursor-pointer text-[#075071] hover:bg-cyan-900/40"
                  style={{
                    background: 'rgba(0,245,255,0.15)',
                    // border: '1px solid rgba(0,245,255,0.3)',
                    boxShadow: '0 0 10px rgba(0,245,255,0.2)',
                  }}
                  title="Tải Ứng Dụng"
                >
                  <Download className="w-4 h-4" />
                  <span>Tải App</span>
                </button>
              )}
              <Home />

              {/* Forum Link */}
              {isUserLoggedIn && (
                <Link
                  to="/forum"
                  className="flex items-center gap-2 px-4 py-2 rounded-2xl transition-all text-sm font-medium hover:shadow-[0_0_20px_rgba(0,245,255,0.4)] hover:-translate-y-0.5"
                  style={{
                    background: location.pathname.startsWith('/forum') ? 'rgba(0, 245, 255, 0.1)' : 'transparent',
                    color: '#075071',
                    border: location.pathname.startsWith('/forum') ? '1px solid rgba(0, 245, 255, 0.3)' : '1px solid transparent',
                    textDecoration: 'none',
                  }}
                  title="Community Forum"
                >
                  <Users className="w-4 h-4" />
                  <span>Cộng đồng</span>
                </Link>
              )}

              {/* Seller: sell button */}
              {isUserLoggedIn && isUserSeller && (
                <Link
                  to="/create-listing"
                  className="flex items-center gap-2 px-4 py-2 rounded-2xl transition-all text-sm font-medium hover:shadow-[0_0_20px_rgba(0,245,255,0.4)] hover:-translate-y-0.5"
                  style={{
                    background: location.pathname.startsWith('/create-listing') ? 'rgba(0, 245, 255, 0.1)' : 'transparent',
                    color: '#075071',
                    border: location.pathname.startsWith('/create-listing') ? '1px solid rgba(0, 245, 255, 0.3)' : '1px solid transparent',
                    textDecoration: 'none',
                  }}
                >
                  <Plus className="w-4 h-4" />
                  <span>Bán hàng</span>
                </Link>
              )}

              {/* Become Seller button */}
              {isUserLoggedIn && !isUserSeller && !isAdmin && (
                <button
                  type="button"
                  onClick={handleSellerButtonClick}
                  disabled={isCheckingStatus}
                  className="flex items-center gap-2 px-4 py-2 rounded-2xl transition-all text-sm font-bold shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: 'linear-gradient(135deg, #FF2D78 0%, #9B4DFF 100%)',
                    color: '#fff',
                    border: 'none',
                    cursor: isCheckingStatus ? 'not-allowed' : 'pointer',
                    boxShadow: '0 0 20px rgba(255,45,120,0.3)',
                  }}
                >
                  {isCheckingStatus ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Đang kiểm tra...</span>
                    </>
                  ) : (
                    <span>Trở thành Người bán</span>
                  )}
                </button>
              )}

              {/* Admin: approve sellers */}
              {isUserLoggedIn && isAdmin && (
                <Link
                  to="/admin/seller-requests"
                  className="flex items-center gap-2 px-4 py-2 rounded-2xl transition-all text-sm font-medium"
                  style={{
                    background: 'rgba(155,77,255,0.18)',
                    color: '#c49bff',
                    border: '1px solid rgba(155,77,255,0.35)',
                    textDecoration: 'none',
                  }}
                >
                  <Shield className="w-4 h-4" />
                  <span>Duyệt Người bán</span>
                </Link>
              )}

              {props.isAuthenticated && (isAdmin || isUserAdmin) && <EntitiesMenu />}
              {props.isAuthenticated && props.isAdmin && <AdminMenu showOpenAPI={props.isOpenAPIEnabled} />}

              {/* Premium link */}
              {isUserLoggedIn && isUserSeller && (
                <Link
                  to="/premium"
                  className="flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-medium"
                  style={{
                    background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                    color: '#090418',
                    textDecoration: 'none',
                    boxShadow: '0 0 15px rgba(255,215,0,0.25)',
                  }}
                >
                  <Crown className="w-4 h-4" />
                  <span>Premium</span>
                </Link>
              )}

              {/* Messages */}
              {isUserLoggedIn && (
                <IconLink to="/messages" title="Tin nhắn" badge={unreadCount}>
                  <MessageCircle className="w-5 h-5" />
                </IconLink>
              )}

              {/* Cart */}
              {isUserLoggedIn && !isAdmin && (
                <Link
                  to="/cart"
                  className="relative p-2 rounded-2xl transition-all flex items-center justify-center"
                  title="Giỏ hàng"
                  style={{
                    color: '#075071',
                    textDecoration: 'none',
                    background: location.pathname.startsWith('/cart') ? 'rgba(0, 245, 255, 0.15)' : 'transparent',
                    border: location.pathname.startsWith('/cart') ? '1px solid rgba(0, 245, 255, 0.3)' : '1px solid transparent',
                    boxShadow: location.pathname.startsWith('/cart') ? '0 0 10px rgba(0, 245, 255, 0.2)' : 'none',
                  }}
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-bold"
                    style={{ background: 'linear-gradient(135deg, #00F5FF, #9B4DFF)', color: '#090418' }}
                  >
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                </Link>
              )}

              {/* Notifications */}
              {isUserLoggedIn && (
                <IconLink to="/notifications" title="Thông báo" badge={unreadNotificationCount}>
                  <Bell className="w-5 h-5" />
                </IconLink>
              )}

              <LocaleMenu currentLocale={props.currentLocale} onClick={handleLocaleChange} />
              <AccountMenu onLoginClick={openAuthModal} onRegisterClick={openRegisterModal} />
            </div>
          </div>
        </div>
      </nav>

      {showAuthModal && <AuthModal onClose={closeAuthModal} defaultTab={authModalDefaultTab} />}
      <SellerRegistrationModal isOpen={showSellerRegModal} onClose={() => setShowSellerRegModal(false)} />
      <AIChatButton />

      {/* CUSTOM INSTALL MODAL */}
      <InstallModal show={showCustomInstallModal} onClose={() => setShowCustomInstallModal(false)} onConfirm={handleConfirmInstall} />
    </div>
  );
};

export default Header;

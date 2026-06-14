import React, { useState, useEffect } from 'react';
import { Storage } from 'react-jhipster';
import { NavLink as Link, useNavigate } from 'react-router';
import { Bell, ShoppingCart, Crown, MessageCircle, Shield, Loader2, Plus } from 'lucide-react';
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

const Header = (props: IHeaderProps) => {
  const dispatch = useAppDispatch();
  const { isAuthenticated: isDemoAuth, isSeller: isDemoSeller, isAdmin: isDemoAdmin } = useAuth();
  // const [searchQuery, setSearchQuery] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSellerRegModal, setShowSellerRegModal] = useState(false);
  const [authModalDefaultTab, setAuthModalDefaultTab] = useState<'login' | 'register'>('login');
  const [cartCount, setCartCount] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const unreadNotificationCount = useAppSelector(state => state.notification.unreadCount);

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

  /* ─────────────────────────────────────────────────────
     SHARED ICON BUTTON (notifications, cart, messages)
     ───────────────────────────────────────────────────── */
  const IconLink = ({ to, title, badge, children }: { to: string; title: string; badge?: number | null; children: React.ReactNode }) => (
    <Link to={to} title={title} className="relative p-2 rounded-2xl transition-colors" style={{ color: '#fff', textDecoration: 'none' }}>
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

  return (
    <div id="app-header" className="fixed inset-x-0 top-0 z-50">
      <LoadingBar className="loading-bar" />
      <nav
        className="relative shadow-2xl"
        style={{
          background: 'rgba(9, 4, 24, 0.88)',
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
          <div className="flex md:hidden items-center justify-between py-2.5" style={{ height: 56 }}>
            {/* Brand */}
            <Brand />

            {/* Right side */}
            <div className="flex items-center gap-1">
              {/* Notification bell (Always show on mobile as requested) */}
              <IconLink
                to={isUserLoggedIn ? '/notifications' : '/login'}
                title="Thông báo"
                badge={isUserLoggedIn ? unreadNotificationCount : null}
              >
                <Bell className="w-5 h-5" />
              </IconLink>

              {isUserLoggedIn ? (
                /* Logged in: AccountMenu dropdown */
                <AccountMenu onLoginClick={openAuthModal} onRegisterClick={openRegisterModal} />
              ) : (
                /* Not logged in: Login + Register */
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
              <Home />
              {/* Seller: sell button */}
              {isUserLoggedIn && isUserSeller && (
                <Link
                  to="/create-listing"
                  className="flex items-center gap-2 px-4 py-2 rounded-2xl transition-all text-sm font-medium"
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    color: '#fff',
                    border: '1px solid rgba(255,255,255,0.12)',
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
                  className="relative p-2 rounded-2xl transition-colors"
                  title="Giỏ hàng"
                  style={{ color: '#fff', textDecoration: 'none' }}
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
    </div>
  );
};

export default Header;

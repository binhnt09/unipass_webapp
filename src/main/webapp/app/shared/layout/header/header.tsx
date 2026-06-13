import React, { useState, useEffect } from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import { Storage } from 'react-jhipster';
import { NavLink as Link, useNavigate } from 'react-router';
import { Search, Bell, ShoppingCart, Crown, MessageCircle, ChevronDown, Shield, Loader2, Plus, Menu } from 'lucide-react';
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
  const [searchQuery, setSearchQuery] = useState('');
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
      fetchCartCount(); // Lấy lần đầu khi load trang
      window.addEventListener('cartUpdated', fetchCartCount); // Lắng nghe tín hiệu "cartUpdated" từ các trang khác bắn tới
      dispatch(fetchUnreadNotificationCount());
      // Cleanup khi component bị hủy
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
      // Silently fail – không làm ảnh hưởng UX
    }
  };

  useEffect(() => {
    if (!isUserLoggedIn) {
      setUnreadCount(0);
      return;
    }
    fetchUnreadCount(); // Fetch ngay khi load
    const interval = setInterval(fetchUnreadCount, 30000); // Poll mỗi 30 giây
    return () => clearInterval(interval);
  }, [isUserLoggedIn]);

  // Khi cửa sổ lấy lại focus, fetch lại ngay (user vừa switch tab về)
  useEffect(() => {
    const onFocus = () => {
      if (isUserLoggedIn) fetchUnreadCount();
    };
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [isUserLoggedIn]);

  // Lắng nghe event 'messageRead' để reset badge (bắn từ trang /messages)
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

  const [isNavExpanded, setIsNavExpanded] = useState(false);

  return (
    <div id="app-header" className="fixed inset-x-0 top-0 z-50">
      {/* {renderDevRibbon()} */}
      <LoadingBar className="loading-bar" />
      <Navbar
        expanded={isNavExpanded}
        onToggle={expanded => setIsNavExpanded(expanded)}
        expand="md"
        className="relative navbar-dark shadow-2xl"
        collapseOnSelect
        style={{
          background: 'rgba(9, 4, 24, 0.88)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderBottom: '1px solid rgba(0, 245, 255, 0.10)',
        }}
      >
        <div className="container-fluid px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3 py-2">
            <div className="flex items-center gap-6">
              <Brand />
              {/* ── Search bar ── */}
              <div
                id="header-search-bar"
                className="hidden md:flex items-center gap-2 rounded-2xl px-4 py-2 min-w-[420px]"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(0,245,255,0.15)',
                  transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,245,255,0.3)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 0 15px rgba(0,245,255,0.08)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,245,255,0.15)';
                  (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                }}
              >
                <button
                  type="button"
                  className="flex items-center gap-1 text-sm border-r pr-3"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    borderRight: '1px solid rgba(0,245,255,0.18)',
                    color: 'rgba(255,255,255,0.82)',
                    cursor: 'pointer',
                    padding: '0 0.75rem 0 0',
                  }}
                >
                  <span>Tất cả danh mục</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                <div className="flex-1 flex items-center gap-2">
                  <Search className="w-4 h-4" style={{ color: 'rgba(0,245,255,0.6)' }} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Tìm sách giáo khoa, điện tử và nhiều hơn nữa..."
                    className="flex-1 bg-transparent border-none outline-none text-sm"
                    style={{ color: '#fff' }}
                  />
                </div>
              </div>
            </div>

            <Navbar.Toggle
              aria-controls="header-tabs"
              aria-label="Menu"
              className="md:hidden border-0 p-1"
              onClick={() => setIsNavExpanded(!isNavExpanded)}
            >
              <Menu className="w-6 h-6 text-white" />
            </Navbar.Toggle>

            <Navbar.Collapse
              id="header-tabs"
              className={`${
                isNavExpanded ? 'block' : 'hidden'
              } md:block w-full md:w-auto absolute md:relative top-full left-0 md:bg-transparent shadow-2xl md:shadow-none px-4 pb-4 md:p-0 border-t md:border-t-0 z-50`}
              style={{
                background: isNavExpanded ? 'rgba(9,4,24,0.97)' : undefined,
                borderColor: 'rgba(0,245,255,0.1)',
              }}
            >
              <Nav className="flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-3 mt-3 md:mt-0 w-full">
                <Home />
                {/* <MarketplaceLink /> */}

                {/* ── Seller: sell button ── */}
                {isUserLoggedIn && isUserSeller && (
                  <>
                    <Link
                      to="/create-listing"
                      className="flex sm:inline-flex items-center gap-2 px-4 py-2 rounded-2xl transition-all text-sm font-medium"
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
                  </>
                )}

                {/* ── Become Seller button ── */}
                {isUserLoggedIn && !isUserSeller && (
                  <button
                    type="button"
                    onClick={handleSellerButtonClick}
                    disabled={isCheckingStatus}
                    className="flex sm:inline-flex items-center gap-2 px-4 py-2 rounded-2xl transition-all text-sm font-bold shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
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

                {/* ── Admin: approve sellers ── */}
                {isUserLoggedIn && isAdmin && (
                  <Link
                    to="/admin/seller-requests"
                    className="flex sm:inline-flex items-center gap-2 px-4 py-2 rounded-2xl transition-all text-sm font-medium"
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

                {/* ── Premium link (keep gold) ── */}
                <Link
                  to="/premium"
                  className="flex sm:inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-medium"
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

                {/* ── Messages ── */}
                {isUserLoggedIn && (
                  <Link
                    to="/messages"
                    className="relative p-2 rounded-2xl transition-colors"
                    title="Tin nhắn"
                    style={{ color: '#fff', textDecoration: 'none' }}
                  >
                    <MessageCircle className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span
                        className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-bold animate-pulse"
                        style={{ background: 'linear-gradient(135deg, #FF2D78, #9B4DFF)', color: '#fff' }}
                      >
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </span>
                    )}
                  </Link>
                )}

                {/* ── Cart ── */}
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

                {/* ── Notifications ── */}
                {isUserLoggedIn && (
                  <Link
                    to="/notifications"
                    className="relative p-2 rounded-2xl transition-colors"
                    title="Thông báo"
                    style={{ color: '#fff', textDecoration: 'none' }}
                  >
                    <Bell className="w-5 h-5" />
                    {unreadNotificationCount > 0 && (
                      <span
                        className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-bold"
                        style={{ background: 'linear-gradient(135deg, #FF2D78, #9B4DFF)', color: '#fff' }}
                      >
                        {unreadNotificationCount > 99 ? '99+' : unreadNotificationCount}
                      </span>
                    )}
                  </Link>
                )}

                <LocaleMenu currentLocale={props.currentLocale} onClick={handleLocaleChange} />
                <AccountMenu onLoginClick={openAuthModal} onRegisterClick={openRegisterModal} />
              </Nav>
            </Navbar.Collapse>
          </div>
        </div>
      </Navbar>
      {showAuthModal && <AuthModal onClose={closeAuthModal} defaultTab={authModalDefaultTab} />}
      <SellerRegistrationModal isOpen={showSellerRegModal} onClose={() => setShowSellerRegModal(false)} />
      <AIChatButton />
    </div>
  );
};

export default Header;

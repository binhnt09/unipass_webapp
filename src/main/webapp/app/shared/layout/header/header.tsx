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

  // const renderDevRibbon = () =>
  //   !props.isInProduction && (
  //     <div className="ribbon dev">
  //       <a href="">
  //         <Translate contentKey={`global.ribbon.${props.ribbonEnv}`} />
  //       </a>
  //     </div>
  //   );

  const fetchCartCount = async () => {
    try {
      const res = await axios.get('/api/cart-items/current-user/items');
      const cartItems = res.data || [];

      setCartCount(cartItems.length);
      // const totalQuantity = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
      // setCartCount(totalQuantity);
    } catch (error) {
      console.error('Lỗi lấy số lượng giỏ hàng:', error);
    }
  };

  useEffect(() => {
    if (isUserLoggedIn && !isAdmin) {
      fetchCartCount(); // Lấy lần đầu khi load trang
      window.addEventListener('cartUpdated', fetchCartCount); // Lắng nghe tín hiệu "cartUpdated" từ các trang khác bắn tới
      // Cleanup khi component bị hủy
      return () => {
        window.removeEventListener('cartUpdated', fetchCartCount);
      };
    }
  }, [isUserLoggedIn, isAdmin]);

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
        className="relative navbar-dark bg-[#0A2647] text-white shadow-lg"
        collapseOnSelect
      >
        <div className="container-fluid px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3 py-2">
            <div className="flex items-center gap-6">
              <Brand />
              <div className="hidden md:flex items-center gap-2 bg-white/10 rounded-2xl px-4 py-2 min-w-[420px]">
                <button
                  type="button"
                  className="flex items-center gap-1 text-sm text-white/90 hover:text-white border-r border-white/20 pr-3"
                >
                  <span>Tất cả danh mục</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                <div className="flex-1 flex items-center gap-2">
                  <Search className="w-4 h-4 text-white/60" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Tìm sách giáo khoa, điện tử và nhiều hơn nữa..."
                    className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-white/60 text-sm"
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
              } md:block w-full md:w-auto absolute md:relative top-full left-0 bg-[#0A2647] md:bg-transparent shadow-2xl md:shadow-none px-4 pb-4 md:p-0 border-t border-white/10 md:border-t-0 z-50`}
            >
              <Nav className="flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-3 mt-3 md:mt-0 w-full">
                <Home />
                {isUserLoggedIn && isUserSeller && (
                  <>
                    {/* <Link
                      to="/seller-dashboard"
                      className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors text-sm font-medium"
                    >
                      <span>Kênh Người bán</span>
                    </Link> */}
                    <Link
                      to="/create-listing"
                      className="flex sm:inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors text-sm font-medium"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Bán hàng</span>
                    </Link>
                  </>
                )}
                {isUserLoggedIn && !isUserSeller && (
                  <button
                    type="button"
                    onClick={handleSellerButtonClick}
                    disabled={isCheckingStatus}
                    className="flex sm:inline-flex items-center gap-2 px-4 py-2 bg-[#FF6B35] hover:bg-[#FF5722] text-[#0A2647] rounded-2xl transition-colors text-sm font-bold shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isCheckingStatus ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-[#0A2647]" />
                        <span>Đang kiểm tra...</span>
                      </>
                    ) : (
                      <span>Trở thành Người bán</span>
                    )}
                  </button>
                )}
                {isUserLoggedIn && isAdmin && (
                  <Link
                    to="/admin/seller-requests"
                    className="flex sm:inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl transition-colors text-sm font-medium"
                  >
                    <Shield className="w-4 h-4" />
                    <span>Duyệt Người bán</span>
                  </Link>
                )}
                {props.isAuthenticated && (isAdmin || isUserAdmin) && <EntitiesMenu />}
                {props.isAuthenticated && props.isAdmin && <AdminMenu showOpenAPI={props.isOpenAPIEnabled} />}
                <Link
                  to="/premium"
                  className="flex sm:inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-[#0A2647] transition-colors text-sm font-medium"
                >
                  <Crown className="w-4 h-4" />
                  <span>Premium</span>
                </Link>
                <div className="flex flex-row items-center gap-3 w-full md:w-auto">
                  {isUserLoggedIn && (
                    <Link to="/messages" className="relative p-2 hover:bg-white/10 rounded-2xl transition-colors" title="Tin nhắn">
                      <MessageCircle className="w-5 h-5" />
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#FF6B35] rounded-full text-[10px] flex items-center justify-center text-white">
                        2
                      </span>
                    </Link>
                  )}
                  {isUserLoggedIn && !isAdmin && (
                    <Link to="/cart" className="relative p-2 hover:bg-white/10 rounded-2xl transition-colors" title="Giỏ hàng">
                      <ShoppingCart className="w-5 h-5" />
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#FF6B35] rounded-full text-[10px] flex items-center justify-center text-white">
                        {cartCount > 99 ? '99+' : cartCount}
                      </span>
                    </Link>
                  )}
                  {isUserLoggedIn && (
                    <Link to="/notifications" className="relative p-2 hover:bg-white/10 rounded-2xl transition-colors" title="Thông báo">
                      <Bell className="w-5 h-5" />
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#FF6B35] rounded-full text-[10px] flex items-center justify-center text-white">
                        3
                      </span>
                    </Link>
                  )}
                </div>
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

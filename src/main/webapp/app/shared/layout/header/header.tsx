import React, { useState } from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import { Storage } from 'react-jhipster';
import { NavLink as Link } from 'react-router';
import { Search, Bell, ShoppingCart, Plus, Crown, MessageCircle, ChevronDown } from 'lucide-react';

import LoadingBar from 'react-redux-loading-bar';

import { useAppDispatch } from 'app/config/store';
import { setLocale } from 'app/shared/reducers/locale';
import { AccountMenu, LocaleMenu, AdminMenu, EntitiesMenu } from '../menus';
import { AuthModal } from 'app/modules/login/AuthModal';

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
  const [authModalDefaultTab, setAuthModalDefaultTab] = useState<'login' | 'register'>('login');

  const isUserLoggedIn = props.isAuthenticated || isDemoAuth;
  const isUserSeller = isDemoSeller;
  const isUserAdmin = isDemoAdmin;
  const isAdmin = props.isAdmin;

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
      {/* {renderDevRibbon()} */}
      <LoadingBar className="loading-bar" />
      <Navbar expand="md" className="relative bg-[#0A2647] text-white shadow-lg" collapseOnSelect>
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

            <Navbar.Toggle aria-controls="header-tabs" aria-label="Menu" className="border border-white/20" />
            <Navbar.Collapse id="header-tabs" className="w-full md:w-auto">
              <Nav className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-3 mt-3 md:mt-0">
                <Home />
                {isUserSeller && (
                  <Link
                    to="/create-listing"
                    className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors text-sm font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Bán hàng</span>
                  </Link>
                )}
                {/* {isUserAdmin ||
                  (isAdmin && (
                    <Link
                      to="/admin"
                      className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-2xl transition-colors text-sm font-medium"
                    >
                      <Shield className="w-4 h-4" />
                      <span>Quản trị</span>
                    </Link>
                  ))} */}
                {props.isAuthenticated && (isAdmin || isUserAdmin) && <EntitiesMenu />}
                {props.isAuthenticated && props.isAdmin && <AdminMenu showOpenAPI={props.isOpenAPIEnabled} />}
                <Link
                  to="/premium"
                  className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-[#0A2647] transition-colors text-sm font-medium"
                >
                  <Crown className="w-4 h-4" />
                  <span>Premium</span>
                </Link>
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
                      3
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
                <LocaleMenu currentLocale={props.currentLocale} onClick={handleLocaleChange} />
                <AccountMenu onLoginClick={openAuthModal} onRegisterClick={openRegisterModal} />
              </Nav>
            </Navbar.Collapse>
          </div>
        </div>
      </Navbar>
      {showAuthModal && <AuthModal onClose={closeAuthModal} defaultTab={authModalDefaultTab} />}
      <AIChatButton />
    </div>
  );
};

export default Header;

import React, { useState } from 'react';
import { Translate } from 'react-jhipster';
import { NavLink as Link } from 'react-router';
import {
  User,
  Settings,
  LogOut,
  Package,
  ShoppingBag,
  Lock,
  MessageCircle,
  Crown,
  ChevronDown,
  Repeat,
  LayoutDashboard,
} from 'lucide-react';
import { logout as logoutRedux } from 'app/shared/reducers/authentication'; // Action logout thật của JHipster
// import MenuItem from 'app/shared/layout/menus/menu-item';

// import { NavDropdown } from './menu-components';
import { useAuth } from 'app/contexts/AuthContext';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { useNavigate } from 'react-router-dom';

// const accountMenuItemsAuthenticated = () => (
//   <>
//     <MenuItem icon="wrench" to="/account/settings" data-cy="settings">
//       <Translate contentKey="global.menu.account.settings">Settings</Translate>
//     </MenuItem>
//     <MenuItem icon="lock" to="/account/password" data-cy="passwordItem">
//       <Translate contentKey="global.menu.account.password">Password</Translate>
//     </MenuItem>
//     <MenuItem icon="sign-out-alt" to="/logout" data-cy="logout">
//       <Translate contentKey="global.menu.account.logout">Sign out</Translate>
//     </MenuItem>
//   </>
// );

// const accountMenuItems = () => (
//   <>
//     <MenuItem id="login-item" icon="sign-in-alt" to="/login" data-cy="login">
//       <Translate contentKey="global.menu.account.login">Sign in</Translate>
//     </MenuItem>
//     <MenuItem icon="user-plus" to="/account/register" data-cy="register">
//       <Translate contentKey="global.menu.account.register">Register</Translate>
//     </MenuItem>
//   </>
// );

export const AccountMenu = ({
  onLoginClick,
  onRegisterClick,
  isAuthenticated: propIsAuthenticated,
}: {
  onLoginClick?: () => void;
  onRegisterClick?: () => void;
  isAuthenticated?: boolean;
}) => {
  // 1. Lấy trạng thái từ Context (Demo)
  const { user: demoUser, logout: logoutDemo, isAuthenticated: isDemoAuth, isSeller: isDemoSeller, isAdmin: isDemoAdmin } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  // 2. Lấy trạng thái từ Redux (Thật)
  const isRealAuth = useAppSelector(state => state.authentication.isAuthenticated);
  const realUser = useAppSelector(state => state.authentication.account);

  // 3. Hợp nhất trạng thái
  const isAuthenticated = propIsAuthenticated || isDemoAuth || isRealAuth;
  const currentUser = isDemoAuth
    ? demoUser
    : {
        name: realUser.firstName && realUser.lastName ? `${realUser.lastName} ${realUser.firstName}` : realUser.login,
        email: realUser.email,
      };
  const authorities = realUser?.authorities || [];
  const isSeller = isDemoAuth ? !!isDemoSeller : authorities.includes('ROLE_SELLER');
  // const isUser = authorities.includes('ROLE_USER');
  const isBuyer = isAuthenticated || isDemoAuth;
  const isAdmin = isDemoAuth ? !!isDemoAdmin : authorities.includes('ROLE_ADMIN');
  const isManager = authorities.includes('ROLE_MANAGER');

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    // 1. Xóa dữ liệu Demo (Context)
    logoutDemo();

    // 2. Xóa dữ liệu Thật (Redux/JHipster)
    dispatch(logoutRedux());

    // 3. Đưa người dùng về trang chủ và đóng menu
    setShowUserMenu(false);
    navigate('/');
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onLoginClick}
          className="px-4 py-2 rounded-2xl text-sm font-medium text-[#075071] hover:bg-[#075071]/10 transition-colors"
        >
          <Translate contentKey="global.menu.account.login">Sign in</Translate>
        </button>
        <button
          type="button"
          onClick={onRegisterClick ?? onLoginClick}
          className="px-5 py-2.5 rounded-full text-sm font-bold text-[#090418] transition-all duration-300 hover:scale-105 cursor-pointer"
          style={{
            background: 'linear-gradient(135deg,#00F5FF,#9B4DFF)',
            boxShadow: '0 0 15px rgba(0,245,255,0.3)',
            fontFamily: "'Space Grotesk', sans-serif",
          }}
        >
          <Translate contentKey="global.menu.account.register">Register</Translate>
        </button>
        {/* <Link
          to="/account/register"
          className="px-5 py-2 rounded-2xl text-sm font-medium bg-[#FF6B35] text-[#0A2647] hover:bg-[#FF5722] transition-colors"
        >
          <Translate contentKey="global.menu.account.register">Register</Translate>
        </Link> */}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {/* User Dropdown Menu */}
      <div className="relative group">
        <button
          onClick={() => setShowUserMenu(!showUserMenu)}
          className="flex items-center gap-2 px-3 py-2 rounded-2xl text-sm font-medium text-[#075071] hover:bg-[#075071]/10 transition-colors"
          style={{ border: '3px solid rgba(0,245,255,0.7)' }}
        >
          <User size={16} />
          <span>{currentUser?.name || 'User'}</span>
          <ChevronDown size={14} />
        </button>

        <div
          className={`absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 transition-all duration-200 z-50 ${
            showUserMenu ? 'opacity-100 visible' : 'opacity-0 invisible md:group-hover:opacity-100 md:group-hover:visible'
          }`}
        >
          <div className="p-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#0A2647] rounded-full flex items-center justify-center">
                <User size={20} className="text-white" />
              </div>
              <div>
                <div className="font-medium text-gray-900">{currentUser?.name}</div>
                <div className="text-sm text-gray-500">{currentUser?.email}</div>
                <div className="text-xs text-[#FF6B35] font-medium mt-2">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      isAdmin
                        ? 'bg-purple-100 text-purple-700'
                        : isManager
                          ? 'bg-indigo-100 text-indigo-700'
                          : isSeller
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {isAdmin ? '🛡️ Admin' : isManager ? '💼 Manager' : isSeller ? '🏪 Seller' : '👤 Buyer'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="py-1" onClick={() => setShowUserMenu(false)}>
            <Link to="/profile" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:text-[#FF6B35] transition-colors">
              <User size={16} />
              Trang cá nhân
            </Link>

            {isSeller && (
              <>
                <Link
                  to="seller-dashboard"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:text-[#FF6B35] transition-colors"
                >
                  <Package size={16} />
                  Quản lý bán hàng
                </Link>
                <Link
                  to="/seller/orders"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:text-[#FF6B35] transition-colors"
                >
                  <LayoutDashboard size={16} />
                  Quản lý orders
                </Link>
              </>
            )}

            {isBuyer && (
              <Link
                to="/orders"
                onClick={() => setShowUserMenu(false)}
                className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:text-[#FF6B35] transition-colors"
              >
                <ShoppingBag size={16} />
                Đơn mua của tôi
              </Link>
            )}
            <Link
              to="/trades/mine"
              onClick={() => setShowUserMenu(false)}
              className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50 text-gray-700 hover:text-[#FF6B35] transition-colors"
            >
              <Repeat size={16} />
              Đồ yêu cầu đổi của tôi
            </Link>
            <Link
              to="/messages"
              onClick={() => setShowUserMenu(false)}
              className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:text-[#FF6B35] transition-colors"
            >
              <MessageCircle size={16} />
              Tin nhắn
            </Link>

            <Link to="/premium" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:text-[#FF6B35] transition-colors">
              <Crown size={16} />
              Premium
            </Link>

            <div className="border-t border-gray-100 my-1"></div>

            <Link
              to="/account/settings"
              data-cy="settings"
              className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:text-[#FF6B35] transition-colors"
            >
              <Settings size={16} />
              <Translate contentKey="global.menu.account.settings">Cài đặt</Translate>
            </Link>
            <Link
              to="/account/password"
              data-cy="passwordItem"
              className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:text-[#FF6B35] transition-colors"
            >
              <Lock size={16} />
              <Translate contentKey="global.menu.account.password">Mật khẩu</Translate>
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:text-[#FF6B35] transition-colors w-full text-left"
            >
              <LogOut size={16} />
              <Translate contentKey="global.menu.account.logout">Đăng xuất</Translate>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

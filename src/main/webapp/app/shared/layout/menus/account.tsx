import React, { useState } from 'react';
import { Translate } from 'react-jhipster';
import { NavLink as Link } from 'react-router';
import { User, Settings, LogOut, Package, ShoppingBag, Lock, MessageCircle, Crown, ChevronDown } from 'lucide-react';

// import MenuItem from 'app/shared/layout/menus/menu-item';

// import { NavDropdown } from './menu-components';
import { useAuth } from 'app/contexts/AuthContext';

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

export const AccountMenu = ({ onLoginClick }: { onLoginClick?: () => void }) => {
  const { user, logout, isAuthenticated, isSeller } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onLoginClick}
          className="px-4 py-2 rounded-2xl text-sm font-medium text-white hover:bg-white/10 transition-colors"
        >
          <Translate contentKey="global.menu.account.login">Sign in</Translate>
        </button>
        <Link
          to="/account/register"
          className="px-5 py-2 rounded-2xl text-sm font-medium bg-[#FF6B35] text-[#0A2647] hover:bg-[#FF5722] transition-colors"
        >
          <Translate contentKey="global.menu.account.register">Register</Translate>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {/* User Dropdown Menu */}
      <div className="relative group">
        <button
          onClick={() => setShowUserMenu(!showUserMenu)}
          className="flex items-center gap-2 px-3 py-2 rounded-2xl text-sm font-medium text-white hover:bg-white/10 transition-colors"
        >
          <User size={16} />
          <span>{user?.name || 'User'}</span>
          <ChevronDown size={14} />
        </button>

        <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
          <div className="p-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#0A2647] rounded-full flex items-center justify-center">
                <User size={20} className="text-white" />
              </div>
              <div>
                <div className="font-medium text-gray-900">{user?.name}</div>
                <div className="text-sm text-gray-500">{user?.email}</div>
                <div className="text-xs text-[#FF6B35] font-medium mt-2">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      isSeller ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {isSeller ? '🏪 Seller' : '👤 Buyer'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="py-1" onClick={() => setShowUserMenu(false)}>
            <Link to="/profile" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:text-[#FF6B35] transition-colors">
              <User size={16} />
              Profile
            </Link>

            {isSeller && (
              <Link
                to="seller-dashboard"
                onClick={() => setShowUserMenu(false)}
                className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:text-[#FF6B35] transition-colors"
              >
                <Package size={16} />
                Seller Dashboard
              </Link>
            )}

            <Link
              to="/orders"
              onClick={() => setShowUserMenu(false)}
              className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:text-[#FF6B35] transition-colors"
            >
              <ShoppingBag size={16} />
              Purchase Order
            </Link>

            <Link
              to="/messages"
              onClick={() => setShowUserMenu(false)}
              className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:text-[#FF6B35] transition-colors"
            >
              <MessageCircle size={16} />
              Messages
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
              <Translate contentKey="global.menu.account.settings">Settings</Translate>
            </Link>
            <Link
              to="/account/password"
              data-cy="passwordItem"
              className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:text-[#FF6B35] transition-colors"
            >
              <Lock size={16} />
              <Translate contentKey="global.menu.account.password">Password</Translate>
            </Link>

            <button
              onClick={logout}
              className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:text-[#FF6B35] transition-colors w-full text-left"
            >
              <LogOut size={16} />
              Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

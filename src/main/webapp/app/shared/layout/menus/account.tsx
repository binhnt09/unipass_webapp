import React from 'react';
import { Translate, translate } from 'react-jhipster';
import { NavLink as Link } from 'react-router';

import MenuItem from 'app/shared/layout/menus/menu-item';

import { NavDropdown } from './menu-components';

const accountMenuItemsAuthenticated = () => (
  <>
    <MenuItem icon="wrench" to="/account/settings" data-cy="settings">
      <Translate contentKey="global.menu.account.settings">Settings</Translate>
    </MenuItem>
    <MenuItem icon="lock" to="/account/password" data-cy="passwordItem">
      <Translate contentKey="global.menu.account.password">Password</Translate>
    </MenuItem>
    <MenuItem icon="sign-out-alt" to="/logout" data-cy="logout">
      <Translate contentKey="global.menu.account.logout">Sign out</Translate>
    </MenuItem>
  </>
);

const accountMenuItems = () => (
  <>
    <MenuItem id="login-item" icon="sign-in-alt" to="/login" data-cy="login">
      <Translate contentKey="global.menu.account.login">Sign in</Translate>
    </MenuItem>
    <MenuItem icon="user-plus" to="/account/register" data-cy="register">
      <Translate contentKey="global.menu.account.register">Register</Translate>
    </MenuItem>
  </>
);

export const AccountMenu = ({ isAuthenticated = false, onLoginClick }: { isAuthenticated?: boolean; onLoginClick?: () => void }) => {
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
    <NavDropdown
      icon="user"
      name={translate('global.menu.account.main')}
      id="account-menu"
      data-cy="accountMenu"
      toggleClassName="text-white hover:bg-white/10"
      menuClassName="min-w-[220px]"
    >
      {accountMenuItemsAuthenticated()}
      {!isAuthenticated && accountMenuItems()}
    </NavDropdown>
  );
};

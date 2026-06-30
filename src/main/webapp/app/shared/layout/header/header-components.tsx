import React from 'react';
import { NavItem, NavLink, NavbarBrand } from 'react-bootstrap';
import { Translate } from 'react-jhipster';
import { NavLink as Link, useLocation } from 'react-router';

import { faStore } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import logoImg from '../../../../content/images/Icon_logo.png';

export const BrandIcon = props => (
  <div {...props} className="w-10 h-10 rounded-2xl flex items-center justify-center bg-white shadow-sm overflow-hidden p-1">
    <img src={logoImg} alt="Logo" className="w-full h-full object-contain" />
  </div>
);

export const Brand = () => (
  <NavbarBrand as={Link as any} to="/" className="flex items-center gap-3 text-white no-underline">
    <BrandIcon />
    <div className="flex flex-col leading-tight">
      <span className="text-xl font-bold text-[#075071]">UniPass</span>
      <span className="text-xs text-[#075071]">Marketplace</span>
    </div>
  </NavbarBrand>
);

/* Home icon → back to Landing page */
export const Home = () => {
  const location = useLocation();
  const isActive = location.pathname === '/market';
  return (
    <NavItem>
      <NavLink
        as={Link as any}
        to="/market"
        className="flex items-center gap-2 px-4 py-2 rounded-2xl transition-all text-sm font-bold hover:shadow-[0_0_20px_rgba(0,245,255,0.4)] hover:-translate-y-0.5 nav-link"
        // style={{
        //   background: location.pathname === '/market' ? 'rgba(0, 245, 255, 0.1)' : 'transparent',
        //   color: '#075071',
        //   border: location.pathname === '/market' ? '1px solid rgba(0, 245, 255, 0.3)' : '1px solid transparent',
        //   textDecoration: 'none',
        // }}
        // className="flex items-center gap-2 px-3 py-2 font-bold rounded-2xl text-[#075071] hover:bg-white/10 hover:text-[#022434] hover:shadow-[0_0_20px_rgba(0,245,255,0.4)] hover:-translate-y-0.5"
        style={{
          border: isActive ? '1px solid rgba(0, 245, 255, 0.3)' : '1px solid transparent',
          background: isActive ? 'rgba(0, 245, 255, 0.1)' : 'transparent',
          textDecoration: 'none',
        }}
      >
        <FontAwesomeIcon icon={faStore} />
        <span>
          <Translate contentKey="global.menu.home.title_home">Home</Translate>
        </span>
      </NavLink>
    </NavItem>
  );
};

/* Marketplace icon → product marketplace at /market */
export const MarketplaceLink = () => (
  <NavItem>
    <NavLink
      as={Link as any}
      to="/market"
      className="flex items-center gap-2 px-3 py-2 rounded-2xl hover:bg-white/10"
      style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}
    >
      <FontAwesomeIcon icon={faStore} />
      <span>Marketplace</span>
    </NavLink>
  </NavItem>
);

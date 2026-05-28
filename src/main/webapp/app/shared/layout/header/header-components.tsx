import React from 'react';
import { NavItem, NavLink, NavbarBrand } from 'react-bootstrap';
import { Translate } from 'react-jhipster';
import { NavLink as Link } from 'react-router';

import { faHome } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const BrandIcon = props => (
  <div {...props} className="w-10 h-10 rounded-2xl bg-[#FF6B35] flex items-center justify-center text-white font-bold text-lg">
    U
  </div>
);

export const Brand = () => (
  <NavbarBrand as={Link as any} to="/" className="flex items-center gap-3 text-white no-underline">
    <BrandIcon />
    <div className="flex flex-col leading-tight">
      <span className="text-xl font-bold">Unipass</span>
      <span className="text-xs text-white/70">Maketplace</span>
    </div>
  </NavbarBrand>
);

export const Home = () => (
  <NavItem>
    <NavLink
      as={Link as any}
      to="/"
      className="flex items-center gap-2 px-3 py-2 rounded-2xl text-white hover:bg-white/10 hover:text-white"
    >
      <FontAwesomeIcon icon={faHome} />
      <span>
        <Translate contentKey="global.menu.home.title_home">Home</Translate>
      </span>
    </NavLink>
  </NavItem>
);

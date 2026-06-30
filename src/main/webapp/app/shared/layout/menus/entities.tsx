import React from 'react';
import { translate } from 'react-jhipster';
import { useLocation } from 'react-router';

import EntitiesMenuItems from 'app/entities/menu';

import { NavDropdown } from './menu-components';

const ENTITY_PATHS = [
  'category',
  'product',

  'cart-item',
  'item-request',
  'request-offer',
  'admin-orders',

  'review',
  'report-admin',
  'user-wallet',
  'wallet-transaction',
  'user-bank-account',
  'premium-package',
  'user-premium',
  'system-payment-transaction',
  'premium-history',
  'invoice',
  'chat-room',

  'ai-chat-session',
  'user-search-history',
  'notification',
  'status-history',
  'seller-request',
  'trade-request',

  'user-address',
  'post-category',
  'community-post',
  'post-reaction',
  'comment-reaction',
  'university',
  'user-profile',
];

export const EntitiesMenu = () => {
  const location = useLocation();
  const firstSegment = location.pathname.split('/')[1];
  const isActive = ENTITY_PATHS.includes(firstSegment);

  return (
    <NavDropdown
      icon="th-list"
      name={translate('global.menu.entities.main')}
      id="entity-menu"
      data-cy="entity"
      isActive={isActive}
      style={{ maxHeight: '80vh', overflow: 'auto' }}
    >
      <EntitiesMenuItems />
    </NavDropdown>
  );
};

import React from 'react';
import { Translate } from 'react-jhipster';

import MenuItem from 'app/shared/layout/menus/menu-item';

const EntitiesMenu = () => {
  return (
    <>
      {/* prettier-ignore */}
      <MenuItem icon="users" to="/user-management">
        <Translate contentKey="global.menu.admin.userManagement">User management</Translate>
      </MenuItem>
      <MenuItem icon="graduation-cap" to="/university">
        <Translate contentKey="global.menu.entities.university" />
      </MenuItem>

      <MenuItem icon="user" to="/user-profile">
        <Translate contentKey="global.menu.entities.userProfile" />
      </MenuItem>
      <MenuItem icon="th-list" to="/category">
        <Translate contentKey="global.menu.entities.category" />
      </MenuItem>
      <MenuItem icon="box" to="/product">
        <Translate contentKey="global.menu.entities.product" />
      </MenuItem>

      <MenuItem icon="shopping-cart" to="/cart-item">
        <Translate contentKey="global.menu.entities.cartItem" />
      </MenuItem>
      <MenuItem icon="file-alt" to="/item-request">
        <Translate contentKey="global.menu.entities.itemRequest" />
      </MenuItem>
      <MenuItem icon="handshake" to="/request-offer">
        <Translate contentKey="global.menu.entities.requestOffer" />
      </MenuItem>
      <MenuItem icon="receipt" to="/admin-orders">
        <Translate contentKey="global.menu.entities.orders" />
      </MenuItem>

      <MenuItem icon="star" to="/review">
        <Translate contentKey="global.menu.entities.review" />
      </MenuItem>
      <MenuItem icon="flag" to="/report-admin">
        <Translate contentKey="global.menu.entities.report" />
      </MenuItem>
      <MenuItem icon="wallet" to="/user-wallet">
        <Translate contentKey="global.menu.entities.userWallet" />
      </MenuItem>
      <MenuItem icon="exchange-alt" to="/wallet-transaction">
        <Translate contentKey="global.menu.entities.walletTransaction" />
      </MenuItem>
      <MenuItem icon="credit-card" to="/user-bank-account">
        <Translate contentKey="global.menu.entities.userBankAccount" />
      </MenuItem>
      <MenuItem icon="crown" to="/premium-package">
        <Translate contentKey="global.menu.entities.premiumPackage" />
      </MenuItem>
      <MenuItem icon="award" to="/user-premium">
        <Translate contentKey="global.menu.entities.userPremium" />
      </MenuItem>
      <MenuItem icon="coins" to="/system-payment-transaction">
        <Translate contentKey="global.menu.entities.systemPaymentTransaction" />
      </MenuItem>
      <MenuItem icon="history" to="/premium-history">
        <Translate contentKey="global.menu.entities.premiumHistory" />
      </MenuItem>
      <MenuItem icon="file-invoice-dollar" to="/invoice">
        <Translate contentKey="global.menu.entities.invoice" />
      </MenuItem>
      <MenuItem icon="comments" to="/chat-room">
        <Translate contentKey="global.menu.entities.chatRoom" />
      </MenuItem>

      <MenuItem icon="robot" to="/ai-chat-session">
        <Translate contentKey="global.menu.entities.aiChatSession" />
      </MenuItem>

      <MenuItem icon="search" to="/user-search-history">
        <Translate contentKey="global.menu.entities.userSearchHistory" />
      </MenuItem>
      <MenuItem icon="bell" to="/notification">
        <Translate contentKey="global.menu.entities.notification" />
      </MenuItem>
      <MenuItem icon="store" to="/seller-request">
        <Translate contentKey="global.menu.entities.sellerRequest" />
      </MenuItem>
      <MenuItem icon="history" to="/status-history">
        <Translate contentKey="global.menu.entities.statusHistory" />
      </MenuItem>
      <MenuItem icon="exchange-alt" to="/trade-request">
        <Translate contentKey="global.menu.entities.tradeRequest" />
      </MenuItem>

      <MenuItem icon="map-marked-alt" to="/user-address">
        <Translate contentKey="global.menu.entities.userAddress" />
      </MenuItem>
      <MenuItem icon="folder-open" to="/post-category">
        <Translate contentKey="global.menu.entities.postCategory" />
      </MenuItem>
      <MenuItem icon="newspaper" to="/community-post">
        <Translate contentKey="global.menu.entities.communityPost" />
      </MenuItem>

      <MenuItem icon="thumbs-up" to="/post-reaction">
        <Translate contentKey="global.menu.entities.postReaction" />
      </MenuItem>
      <MenuItem icon="heart" to="/comment-reaction">
        <Translate contentKey="global.menu.entities.commentReaction" />
      </MenuItem>
      {/* jhipster-needle-add-entity-to-menu - JHipster will add entities to the menu here */}
    </>
  );
};

export default EntitiesMenu;

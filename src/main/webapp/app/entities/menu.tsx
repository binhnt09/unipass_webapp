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
      <MenuItem icon="asterisk" to="/university">
        <Translate contentKey="global.menu.entities.university" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/campus">
        <Translate contentKey="global.menu.entities.campus" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/user-profile">
        <Translate contentKey="global.menu.entities.userProfile" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/category">
        <Translate contentKey="global.menu.entities.category" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/product">
        <Translate contentKey="global.menu.entities.product" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/product-image">
        <Translate contentKey="global.menu.entities.productImage" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/cart-item">
        <Translate contentKey="global.menu.entities.cartItem" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/item-request">
        <Translate contentKey="global.menu.entities.itemRequest" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/request-offer">
        <Translate contentKey="global.menu.entities.requestOffer" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/admin-orders">
        <Translate contentKey="global.menu.entities.orders" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/order-item">
        <Translate contentKey="global.menu.entities.orderItem" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/review">
        <Translate contentKey="global.menu.entities.review" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/report">
        <Translate contentKey="global.menu.entities.report" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/user-wallet">
        <Translate contentKey="global.menu.entities.userWallet" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/wallet-transaction">
        <Translate contentKey="global.menu.entities.walletTransaction" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/user-bank-account">
        <Translate contentKey="global.menu.entities.userBankAccount" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/premium-package">
        <Translate contentKey="global.menu.entities.premiumPackage" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/user-premium">
        <Translate contentKey="global.menu.entities.userPremium" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/system-payment-transaction">
        <Translate contentKey="global.menu.entities.systemPaymentTransaction" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/premium-history">
        <Translate contentKey="global.menu.entities.premiumHistory" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/invoice">
        <Translate contentKey="global.menu.entities.invoice" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/chat-room">
        <Translate contentKey="global.menu.entities.chatRoom" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/chat-message">
        <Translate contentKey="global.menu.entities.chatMessage" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/ai-chat-session">
        <Translate contentKey="global.menu.entities.aiChatSession" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/ai-chat-message">
        <Translate contentKey="global.menu.entities.aiChatMessage" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/user-search-history">
        <Translate contentKey="global.menu.entities.userSearchHistory" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/notification">
        <Translate contentKey="global.menu.entities.notification" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/seller-request">
        <Translate contentKey="global.menu.entities.sellerRequest" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/status-history">
        <Translate contentKey="global.menu.entities.statusHistory" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/trade-request">
        <Translate contentKey="global.menu.entities.tradeRequest" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/trade-offered-item">
        <Translate contentKey="global.menu.entities.tradeOfferedItem" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/user-address">
        <Translate contentKey="global.menu.entities.userAddress" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/post-category">
        <Translate contentKey="global.menu.entities.postCategory" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/community-post">
        <Translate contentKey="global.menu.entities.communityPost" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/post-comment">
        <Translate contentKey="global.menu.entities.postComment" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/post-reaction">
        <Translate contentKey="global.menu.entities.postReaction" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/comment-reaction">
        <Translate contentKey="global.menu.entities.commentReaction" />
      </MenuItem>
      {/* jhipster-needle-add-entity-to-menu - JHipster will add entities to the menu here */}
    </>
  );
};

export default EntitiesMenu;

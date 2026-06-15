import aiChatMessage from 'app/entities/ai-chat-message/ai-chat-message.reducer';
import aiChatSession from 'app/entities/ai-chat-session/ai-chat-session.reducer';
import campus from 'app/entities/campus/campus.reducer';
import cartItem from 'app/entities/cart-item/cart-item.reducer';
import category from 'app/entities/category/category.reducer';
import chatMessage from 'app/entities/chat-message/chat-message.reducer';
import chatRoom from 'app/entities/chat-room/chat-room.reducer';
import commentReaction from 'app/entities/comment-reaction/comment-reaction.reducer';
import communityPost from 'app/entities/community-post/community-post.reducer';
import invoice from 'app/entities/invoice/invoice.reducer';
import itemRequest from 'app/entities/item-request/item-request.reducer';
import notification from 'app/entities/notification/notification.reducer';
import orderItem from 'app/entities/order-item/order-item.reducer';
import orders from 'app/entities/orders/orders.reducer';
import postCategory from 'app/entities/post-category/post-category.reducer';
import postComment from 'app/entities/post-comment/post-comment.reducer';
import postReaction from 'app/entities/post-reaction/post-reaction.reducer';
import premiumHistory from 'app/entities/premium-history/premium-history.reducer';
import premiumPackage from 'app/entities/premium-package/premium-package.reducer';
import product from 'app/entities/product/product.reducer';
import productImage from 'app/entities/product-image/product-image.reducer';
import report from 'app/entities/report/report.reducer';
import requestOffer from 'app/entities/request-offer/request-offer.reducer';
import review from 'app/entities/review/review.reducer';
import sellerRequest from 'app/entities/seller-request/seller-request.reducer';
import statusHistory from 'app/entities/status-history/status-history.reducer';
import systemPaymentTransaction from 'app/entities/system-payment-transaction/system-payment-transaction.reducer';
import tradeOfferedItem from 'app/entities/trade-offered-item/trade-offered-item.reducer';
import tradeRequest from 'app/entities/trade-request/trade-request.reducer';
import university from 'app/entities/university/university.reducer';
import userAddress from 'app/entities/user-address/user-address.reducer';
import userBankAccount from 'app/entities/user-bank-account/user-bank-account.reducer';
import userPremium from 'app/entities/user-premium/user-premium.reducer';
import userProfile from 'app/entities/user-profile/user-profile.reducer';
import userSearchHistory from 'app/entities/user-search-history/user-search-history.reducer';
import userWallet from 'app/entities/user-wallet/user-wallet.reducer';
import walletTransaction from 'app/entities/wallet-transaction/wallet-transaction.reducer';
/* jhipster-needle-add-reducer-import - JHipster will add reducer here */

const entitiesReducers = {
  university,
  campus,
  userProfile,
  category,
  product,
  productImage,
  cartItem,
  itemRequest,
  requestOffer,
  orders,
  orderItem,
  review,
  report,
  userWallet,
  walletTransaction,
  userBankAccount,
  premiumPackage,
  userPremium,
  systemPaymentTransaction,
  premiumHistory,
  invoice,
  chatRoom,
  chatMessage,
  aiChatSession,
  aiChatMessage,
  userSearchHistory,
  notification,
  sellerRequest,
  statusHistory,
  tradeRequest,
  tradeOfferedItem,
  userAddress,
  postCategory,
  communityPost,
  postComment,
  postReaction,
  commentReaction,
  /* jhipster-needle-add-reducer-combine - JHipster will add reducer here */
};

export default entitiesReducers;

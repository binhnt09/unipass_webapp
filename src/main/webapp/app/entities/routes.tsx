// import React from 'react';
// import { Route } from 'react-router';

// import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

// import AiChatMessage from './ai-chat-message';
// import AiChatSession from './ai-chat-session';
// import CartItem from './cart-item';
// import Category from './category';
// import ChatMessage from './chat-message';
// import ChatRoom from './chat-room';
// import CommentReaction from './comment-reaction';
// import CommunityPost from './community-post';
// import Invoice from './invoice';
// import ItemRequest from './item-request';
// import { EntitiesLayout } from './layout/entities-layout';
// import Notification from './notification';
// import OrderItem from './order-item';
// import Orders from './orders';
// import PostCategory from './post-category';
// import PostComment from './post-comment';
// import PremiumHistory from './premium-history';
// import PremiumPackage from './premium-package';
// import Product from './product';
// import ProductImage from './product-image';
// import RequestOffer from './request-offer';
// import Review from './review';
// import Report from './report';
// import UserSearchHistory from './user-search-history';
// import UserWallet from './user-wallet';
// import WalletTransaction from './wallet-transaction';
// import UserBankAccount from './user-bank-account';
// import UserPremium from './user-premium';
// import SystemPaymentTransaction from './system-payment-transaction';
// import SellerRequest from './seller-request';
// import StatusHistory from './status-history';
// import TradeRequest from './trade-request';
// import TradeOfferedItem from './trade-offered-item';
// import UserAddress from './user-address';
// import PostReaction from './post-reaction';
// /* jhipster-needle-add-route-import - JHipster will add routes here */

// export default () => {
//   return (
//     <div>
//       <ErrorBoundaryRoutes>
//         <Route element={<EntitiesLayout />}>
//           {/* prettier-ignore */}
//           {/* <Route path="/university/*" element={<University />} />
//          <Route path="/campus/*" element={<Campus />} /> */}
//           {/* <Route path="/user-profile/*" element={<UserProfile />} /> */}
//           <Route path="/category/*" element={<Category />} />
//           <Route path="/product/*" element={<Product />} />
//           <Route path="/product-image/*" element={<ProductImage />} />
//           <Route path="/cart-item/*" element={<CartItem />} />
//           <Route path="/item-request/*" element={<ItemRequest />} />
//           <Route path="/request-offer/*" element={<RequestOffer />} />
//           <Route path="/admin-orders/*" element={<Orders />} />
//           <Route path="/order-item/*" element={<OrderItem />} />
//           <Route path="/review/*" element={<Review />} />
//           <Route path="/report/*" element={<Report />} />
//           <Route path="/user-wallet/*" element={<UserWallet />} />
//           <Route path="/wallet-transaction/*" element={<WalletTransaction />} />
//           <Route path="/user-bank-account/*" element={<UserBankAccount />} />
//           <Route path="/premium-package/*" element={<PremiumPackage />} />
//           <Route path="/user-premium/*" element={<UserPremium />} />
//           <Route path="/system-payment-transaction/*" element={<SystemPaymentTransaction />} />
//           <Route path="/premium-history/*" element={<PremiumHistory />} />
//           <Route path="/invoice/*" element={<Invoice />} />
//           <Route path="/chat-room/*" element={<ChatRoom />} />
//           <Route path="/chat-message/*" element={<ChatMessage />} />
//           <Route path="/ai-chat-session/*" element={<AiChatSession />} />
//           <Route path="/ai-chat-message/*" element={<AiChatMessage />} />
//           <Route path="/user-search-history/*" element={<UserSearchHistory />} />
//           <Route path="/notification/*" element={<Notification />} />
//           <Route path="/seller-request/*" element={<SellerRequest />} />
//           <Route path="/status-history/*" element={<StatusHistory />} />
//           <Route path="/trade-request/*" element={<TradeRequest />} />
//           <Route path="/trade-offered-item/*" element={<TradeOfferedItem />} />
//           <Route path="/user-address/*" element={<UserAddress />} />
//           <Route path="/post-category/*" element={<PostCategory />} />
//           <Route path="/community-post/*" element={<CommunityPost />} />
//           <Route path="/post-comment/*" element={<PostComment />} />
//           <Route path="/post-reaction/*" element={<PostReaction />} />
//           <Route path="/comment-reaction/*" element={<CommentReaction />} />
//           {/* jhipster-needle-add-route-path - JHipster will add routes here */}
//         </Route>
//       </ErrorBoundaryRoutes>
//     </div>
//   );
// };

import React, { Suspense } from 'react';
import { createBrowserRouter, Navigate, Outlet, useLocation, useNavigate } from 'react-router';

import { sendActivity } from 'app/config/websocket-middleware';
import { initGA, logPageView } from 'app/config/analytics';
// import EntitiesRoutes from 'app/entities/routes';
import Activate from 'app/modules/account/activate/activate';
import PasswordResetFinish from 'app/modules/account/password-reset/finish/password-reset-finish';
import PasswordResetInit from 'app/modules/account/password-reset/init/password-reset-init';
import Register from 'app/modules/account/register/register';
import Home from 'app/modules/home/home';
import Welcome3D from 'app/modules/home/components/Welcome3D';
import Login from 'app/modules/login/login';
import Logout from 'app/modules/login/logout';
import PrivateRoute from 'app/shared/auth/private-route';
import ErrorBoundary from 'app/shared/error/error-boundary';
import PageNotFound from 'app/shared/error/page-not-found';
import { Authority } from 'app/shared/jhipster/constants';
import Footer from 'app/shared/layout/footer/footer';
import Header from 'app/shared/layout/header/header';
import { MobileBottomNav } from 'app/shared/layout/header/MobileBottomNav';
import { useAuth } from 'app/contexts/AuthContext';
import { AuthModal } from 'app/modules/login/AuthModal';
import { useAppSelector, useAppDispatch } from 'app/config/store';
import { hasAnyAuthority } from 'app/shared/auth/private-route';
import { getProfile } from 'app/shared/reducers/application-profile';
import { getSession } from 'app/shared/reducers/authentication';

import PremiumPlansPage from 'app/modules/premium-plans/premiumPlansPage';
import { ForumRoutes } from 'app/modules/forum/ForumRoutes';
import { CreateListingPage } from './modules/listing/create-listing/createListingPage';
import { LoginInfoPage } from './modules/login/LoginInfoPage';
import { ChatPage } from './modules/chat/chatPage';
import { SellerDashboardPage } from './modules/seller/dashboard/sellerDashboardPage';
import { SellerRegistrationSuccessPage } from './modules/seller/registration/SellerRegistrationSuccessPage';
import { SellerRequestsAdminPage } from './modules/seller/admin/SellerRequestsAdminPage';
import { MyOrdersPage } from './modules/order/pages/myOrdersPage';
import { ShoppingCartPage } from './modules/cart/shoppingCartPage';
import { NotificationsPage } from './modules/notifications/notificationsPage';
import { OrderDetailPage } from './modules/order/pages/orderDetailPage';
import { CheckoutPage } from './modules/checkout/checkoutPage';
import { PurchaseSuccessPage } from './modules/checkout/purchaseSuccessPage';
import { PremiumSuccessPage } from './modules/premium-plans/premiumSuccessPage';
import { PaymentPage } from './modules/checkout/payment/payment-selection';
import { MoMoQRPage } from './modules/checkout/payment/momo-qr';
import { VNPayQRPage } from './modules/checkout/payment/vnpay-qr';
import { BankTransferQRPage } from './modules/checkout/payment/bank-transfer-qr';
import { ProductDetailPage } from './modules/listing/components/productDetailPage';
import SettingsPage from './modules/account/settings/settings';
import PasswordPage from './modules/account/password/password';
import { ProfilePage } from './modules/account/profile/ProfilePage';
import University from './entities/university';

import EntitiesLayout from './entities/layout/entities-layout';
import UserProfile from './entities/user-profile';
import Category from './entities/category';
import Product from './entities/product';

import CartItem from './entities/cart-item';
import ItemRequest from './entities/item-request';
import RequestOffer from './entities/request-offer';
import Orders from './entities/orders';

import Review from './entities/review';
import Report from './entities/report';
import UserWallet from './entities/user-wallet';
import WalletTransaction from './entities/wallet-transaction';
import UserBankAccount from './entities/user-bank-account';
import PremiumPackage from './entities/premium-package';
import SystemPaymentTransaction from './entities/system-payment-transaction';
import UserPremium from './entities/user-premium';
import PremiumHistory from './entities/premium-history';
import Invoice from './entities/invoice';
import ChatRoom from './entities/chat-room';

import AiChatSession from './entities/ai-chat-session';

import UserSearchHistory from './entities/user-search-history';
import Notification from './entities/notification';
import UserManagementRoutes from './modules/administration/user-management';
import { ProductOrderManagementPage } from './modules/seller/dashboard/components/productOrderManagement';
import { SellerOrderDetailPage } from './modules/seller/dashboard/components/sellerOrderDetail';
import { SellerOrderManagementPage } from './modules/seller/dashboard/components/sellerOrderManagementPage';
import { MyTradesPage } from './modules/trade/myTrades';
import { AiChatPage } from './modules/ai-chat/AiChatPage';
import { PolicyPage } from './modules/policy/policy';
import { FAQPage } from './modules/support/faq';
import { ReportViolationPage } from './modules/support/report-violation';
import { GuidePage } from './modules/support/guide';
import { TradeDetailPage } from './modules/trade/components/tradeDetail';
import { TradeRequestsPage } from './modules/trade/tradeRequests';
import StatusHistory from './entities/status-history';
import SellerRequest from './entities/seller-request';
import TradeRequest from './entities/trade-request';

import UserAddress from './entities/user-address';
import PostCategory from './entities/post-category';
import CommunityPost from './entities/community-post';

import PostReaction from './entities/post-reaction';
import CommentReaction from './entities/comment-reaction';

const loading = <div>loading ...</div>;

const Account = React.lazy(() => import(/* webpackChunkName: "account" */ 'app/modules/account'));

const Admin = React.lazy(() => import(/* webpackChunkName: "administration" */ 'app/modules/administration'));

const RootLayout = () => {
  const dispatch = useAppDispatch();
  const pageLocation = useLocation();

  React.useEffect(() => {
    dispatch(getSession());
    dispatch(getProfile());
    initGA();
  }, []);

  React.useEffect(() => {
    sendActivity(pageLocation.pathname);
    logPageView(pageLocation.pathname, pageLocation.search);
  }, [pageLocation]);

  const currentLocale = useAppSelector(state => state.locale.currentLocale);
  const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated);
  const isAdmin = useAppSelector(state => hasAnyAuthority(state.authentication.account.authorities, [Authority.ADMIN]));
  const ribbonEnv = useAppSelector(state => state.applicationProfile.ribbonEnv);
  const isInProduction = useAppSelector(state => state.applicationProfile.inProduction);
  const isOpenAPIEnabled = useAppSelector(state => state.applicationProfile.isOpenAPIEnabled);
  const navigate = useNavigate();
  const { authModalOpen, authModalOpenedByPrivateRoute, authModalNavigateBackOnClose, closeAuthModal } = useAuth();

  // Landing page gets its own floating navbar — suppress the global chrome
  const isLandingPage = pageLocation.pathname === '/';
  const paddingTop = isLandingPage ? '0' : '60px';

  return (
    <div className="app-container" style={{ paddingTop }}>
      {/* Global header: hidden on landing page (Welcome3D has its own floating navbar) */}
      {!isLandingPage && (
        <ErrorBoundary>
          <Header
            isAuthenticated={isAuthenticated}
            isAdmin={isAdmin}
            currentLocale={currentLocale}
            ribbonEnv={ribbonEnv}
            isInProduction={isInProduction}
            isOpenAPIEnabled={isOpenAPIEnabled}
          />
        </ErrorBoundary>
      )}

      {/*
        Landing page: no container padding, no Bootstrap container-fluid class.
        Other pages: keep container-fluid + view-container for existing layouts.
      */}
      <div
        className={isLandingPage ? '' : 'container-fluid view-container'}
        id="app-view-container"
        style={{
          ...(isLandingPage ? { padding: 0, margin: 0 } : {}),
          // Extra bottom padding on mobile so content is not hidden behind bottom nav
        }}
      >
        <ErrorBoundary>
          <Suspense fallback={loading}>
            <Outlet />
          </Suspense>
        </ErrorBoundary>

        {/* Global footer: hidden on landing page (Welcome3D has its own minimal footer) */}
        {!isLandingPage && <Footer />}

        {/* AuthModal: always available regardless of page */}
        {authModalOpen ? (
          <AuthModal
            onClose={() => {
              if (authModalNavigateBackOnClose) {
                if (window.history.length > 1) {
                  navigate(-1);
                } else {
                  navigate('/', { replace: true });
                }
              }
              closeAuthModal();
            }}
            onLoginSuccess={closeAuthModal}
            closeOnLocationChange={!authModalOpenedByPrivateRoute}
          />
        ) : null}
      </div>

      {/* Mobile Bottom Navigation — only visible on small screens (< 768px) */}
      <MobileBottomNav isAuthenticated={isAuthenticated} />
    </div>
  );
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Welcome3D /> },
      { path: 'market', element: <Home /> },
      { path: 'login', element: <Login /> },
      { path: 'logout', element: <Logout /> },
      { path: 'product/:id', element: <ProductDetailPage /> },
      { path: 'premium', element: <PremiumPlansPage /> },
      { path: 'policy', element: <PolicyPage /> },
      { path: 'faq', element: <FAQPage /> },
      { path: 'report', element: <ReportViolationPage /> },
      { path: 'guide', element: <GuidePage /> },
      {
        path: 'entities',
        element: (
          <PrivateRoute hasAnyAuthorities={[Authority.USER, Authority.SELLER, Authority.ADMIN, Authority.MANAGER, Authority.BUYER]}>
            <Navigate to="/university" replace />
          </PrivateRoute>
        ),
      },
      {
        element: (
          <PrivateRoute hasAnyAuthorities={[Authority.USER, Authority.SELLER, Authority.ADMIN, Authority.MANAGER, Authority.BUYER]}>
            <Outlet />
          </PrivateRoute>
        ),
        children: [
          { path: 'forum/*', element: <ForumRoutes /> },
          { path: 'cart', element: <ShoppingCartPage /> },
          { path: 'checkout', element: <CheckoutPage /> },
          { path: 'purchase-success', element: <PurchaseSuccessPage /> },
          { path: 'messages', element: <ChatPage /> },
          { path: 'notifications', element: <NotificationsPage /> },
          { path: 'orders', element: <MyOrdersPage /> },
          { path: 'order/:id', element: <OrderDetailPage /> },
          { path: 'login-info', element: <LoginInfoPage /> },
          { path: 'payment', element: <PaymentPage /> },
          { path: 'payment/momo', element: <MoMoQRPage /> },
          { path: 'payment/vnpay', element: <VNPayQRPage /> },
          { path: 'payment/bank-transfer', element: <BankTransferQRPage /> },
          { path: 'seller-success', element: <SellerRegistrationSuccessPage /> },
          { path: 'profile', element: <ProfilePage /> },
          { path: 'profile/:username', element: <ProfilePage /> },
          { path: 'trades/mine', element: <MyTradesPage /> },
          { path: 'ai-chat', element: <AiChatPage /> },
        ],
      },
      {
        element: (
          <PrivateRoute hasAnyAuthorities={[Authority.SELLER, Authority.MANAGER, Authority.ADMIN]}>
            <Outlet />
          </PrivateRoute>
        ),
        children: [
          { path: 'create-listing', element: <CreateListingPage /> },
          { path: 'listings/edit/:id', element: <CreateListingPage /> },
          { path: 'seller-dashboard', element: <SellerDashboardPage /> },
          { path: 'seller/orders/:id', element: <SellerOrderDetailPage /> },
          { path: 'seller/products/:productId/orders', element: <ProductOrderManagementPage /> },
          { path: 'seller/orders', element: <SellerOrderManagementPage /> },
          { path: 'seller/products/:productId/trades', element: <TradeRequestsPage /> },
          { path: 'seller/trades/:tradeId', element: <TradeDetailPage /> },
          { path: 'premium', element: <PremiumPlansPage /> },
          { path: 'premium-success', element: <PremiumSuccessPage /> },
        ],
      },
      {
        element: (
          <PrivateRoute hasAnyAuthorities={[Authority.USER, Authority.SELLER, Authority.ADMIN, Authority.MANAGER, Authority.BUYER]}>
            <EntitiesLayout />
          </PrivateRoute>
        ),
        children: [
          { path: 'user-management/*', element: <UserManagementRoutes /> },
          { path: 'university/*', element: <University /> },

          { path: 'user-profile/*', element: <UserProfile /> },
          { path: 'category/*', element: <Category /> },
          { path: 'product/*', element: <Product /> },

          { path: 'cart-item/*', element: <CartItem /> },
          { path: 'item-request/*', element: <ItemRequest /> },
          { path: 'request-offer/*', element: <RequestOffer /> },
          { path: 'admin-orders/*', element: <Orders /> },

          { path: 'review/*', element: <Review /> },
          { path: 'report-admin/*', element: <Report /> },
          { path: 'user-wallet/*', element: <UserWallet /> },
          { path: 'wallet-transaction/*', element: <WalletTransaction /> },
          { path: 'user-bank-account/*', element: <UserBankAccount /> },
          { path: 'premium-package/*', element: <PremiumPackage /> },
          { path: 'user-premium/*', element: <UserPremium /> },
          { path: 'system-payment-transaction/*', element: <SystemPaymentTransaction /> },
          { path: 'premium-history/*', element: <PremiumHistory /> },
          { path: 'invoice/*', element: <Invoice /> },
          { path: 'chat-room/*', element: <ChatRoom /> },

          { path: 'ai-chat-session/*', element: <AiChatSession /> },
          { path: 'user-search-history/*', element: <UserSearchHistory /> },
          { path: 'notification/*', element: <Notification /> },
          { path: 'status-history/*', element: <StatusHistory /> },
          { path: 'seller-request/*', element: <SellerRequest /> },
          { path: 'trade-request/*', element: <TradeRequest /> },

          { path: 'user-address/*', element: <UserAddress /> },
          { path: 'post-category/*', element: <PostCategory /> },
          { path: 'community-post/*', element: <CommunityPost /> },

          { path: 'post-reaction/*', element: <PostReaction /> },
          { path: 'comment-reaction/*', element: <CommentReaction /> },
        ],
      },
      {
        path: 'account',
        children: [
          { path: 'register', element: <Register /> },
          { path: 'activate', element: <Activate /> },
          {
            path: 'settings',
            element: (
              <PrivateRoute hasAnyAuthorities={[Authority.USER, Authority.SELLER, Authority.ADMIN, Authority.MANAGER, Authority.BUYER]}>
                <SettingsPage /> {/* Import trực tiếp Settings từ account module */}
              </PrivateRoute>
            ),
          },
          {
            path: 'password',
            element: (
              <PrivateRoute hasAnyAuthorities={[Authority.USER]}>
                <PasswordPage />
              </PrivateRoute>
            ),
          },
          {
            path: 'reset',
            children: [
              { path: 'request', element: <PasswordResetInit /> },
              { path: 'finish', element: <PasswordResetFinish /> },
            ],
          },
          {
            path: '*',
            element: (
              <PrivateRoute hasAnyAuthorities={[Authority.ADMIN, Authority.USER]}>
                <Account />
              </PrivateRoute>
            ),
          },
        ],
      },
      {
        element: (
          <PrivateRoute hasAnyAuthorities={[Authority.ADMIN]}>
            <Outlet />
          </PrivateRoute>
        ),
        children: [{ path: 'admin/seller-requests', element: <SellerRequestsAdminPage /> }],
      },
      {
        path: 'admin/*',
        element: (
          <PrivateRoute hasAnyAuthorities={[Authority.ADMIN]}>
            <Admin />
          </PrivateRoute>
        ),
      },
      {
        path: '*',
        element: <PageNotFound />,
      },
    ],
  },
]);

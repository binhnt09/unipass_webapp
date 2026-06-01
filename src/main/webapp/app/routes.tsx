import React, { Suspense } from 'react';
import { createBrowserRouter, Navigate, Outlet, useLocation } from 'react-router';

import { sendActivity } from 'app/config/websocket-middleware';
// import EntitiesRoutes from 'app/entities/routes';
import Activate from 'app/modules/account/activate/activate';
import PasswordResetFinish from 'app/modules/account/password-reset/finish/password-reset-finish';
import PasswordResetInit from 'app/modules/account/password-reset/init/password-reset-init';
import Register from 'app/modules/account/register/register';
import Home from 'app/modules/home/home';
import Login from 'app/modules/login/login';
import Logout from 'app/modules/login/logout';
import PrivateRoute from 'app/shared/auth/private-route';
import ErrorBoundary from 'app/shared/error/error-boundary';
import PageNotFound from 'app/shared/error/page-not-found';
import { Authority } from 'app/shared/jhipster/constants';
import Footer from 'app/shared/layout/footer/footer';
import Header from 'app/shared/layout/header/header';
import { useAppSelector, useAppDispatch } from 'app/config/store';
import { hasAnyAuthority } from 'app/shared/auth/private-route';
import { getProfile } from 'app/shared/reducers/application-profile';
import { getSession } from 'app/shared/reducers/authentication';

import PremiumPlansPage from 'app/modules/premium-plans/premiumPlansPage';
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
import { PaymentPage } from './modules/checkout/payment/payment-selection';
import { MoMoQRPage } from './modules/checkout/payment/momo-qr';
import { VNPayQRPage } from './modules/checkout/payment/vnpay-qr';
import { BankTransferQRPage } from './modules/checkout/payment/bank-transfer-qr';
import { ProductDetailPage } from './modules/listing/components/productDetailPage';
import SettingsPage from './modules/account/settings/settings';
import PasswordPage from './modules/account/password/password';
import University from './entities/university/university';
import Campus from './entities/campus/campus';
import EntitiesLayout from './entities/layout/entities-layout';
import UserProfile from './entities/user-profile/user-profile';
import Category from './entities/category/category';
import Product from './entities/product/product';
import ProductImage from './entities/product-image/product-image';
import CartItem from './entities/cart-item/cart-item';
import ItemRequest from './entities/item-request/item-request';
import RequestOffer from './entities/request-offer/request-offer';
import Orders from './entities/orders/orders';
import OrderItem from './entities/order-item/order-item';
import Review from './entities/review/review';
import Report from './entities/report/report';
import UserWallet from './entities/user-wallet/user-wallet';
import WalletTransaction from './entities/wallet-transaction/wallet-transaction';
import UserBankAccount from './entities/user-bank-account/user-bank-account';
import PremiumPackage from './entities/premium-package/premium-package';
import SystemPaymentTransaction from './entities/system-payment-transaction/system-payment-transaction';
import UserPremium from './entities/user-premium/user-premium';
import PremiumHistory from './entities/premium-history/premium-history';
import Invoice from './entities/invoice/invoice';
import ChatRoom from './entities/chat-room/chat-room';
import ChatMessage from './entities/chat-message/chat-message';
import AiChatSession from './entities/ai-chat-session/ai-chat-session';
import AiChatMessage from './entities/ai-chat-message/ai-chat-message';
import UserSearchHistory from './entities/user-search-history/user-search-history';
import Notification from './entities/notification/notification';
import UserManagement from './modules/administration/user-management/user-management';

const loading = <div>loading ...</div>;

const Account = React.lazy(() => import(/* webpackChunkName: "account" */ 'app/modules/account'));

const Admin = React.lazy(() => import(/* webpackChunkName: "administration" */ 'app/modules/administration'));

const RootLayout = () => {
  const dispatch = useAppDispatch();
  const pageLocation = useLocation();

  React.useEffect(() => {
    dispatch(getSession());
    dispatch(getProfile());
  }, []);

  React.useEffect(() => {
    sendActivity(pageLocation.pathname);
  }, [pageLocation]);

  const currentLocale = useAppSelector(state => state.locale.currentLocale);
  const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated);
  const isAdmin = useAppSelector(state => hasAnyAuthority(state.authentication.account.authorities, [Authority.ADMIN]));
  const ribbonEnv = useAppSelector(state => state.applicationProfile.ribbonEnv);
  const isInProduction = useAppSelector(state => state.applicationProfile.inProduction);
  const isOpenAPIEnabled = useAppSelector(state => state.applicationProfile.isOpenAPIEnabled);

  const paddingTop = '60px';
  return (
    <div className="app-container" style={{ paddingTop }}>
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
      <div className="container-fluid view-container" id="app-view-container">
        <ErrorBoundary>
          <Suspense fallback={loading}>
            <Outlet />
          </Suspense>
        </ErrorBoundary>
        <Footer />
      </div>
    </div>
  );
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'login', element: <Login /> },
      { path: 'logout', element: <Logout /> },
      { path: 'product/:id', element: <ProductDetailPage /> },
      { path: 'premium', element: <PremiumPlansPage /> },
      {
        path: 'entities',
        element: (
          <PrivateRoute hasAnyAuthorities={[Authority.USER]}>
            <Navigate to="/university" replace />
          </PrivateRoute>
        ),
      },
      {
        element: (
          <PrivateRoute hasAnyAuthorities={[Authority.USER]}>
            <Outlet />
          </PrivateRoute>
        ),
        children: [
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
        ],
      },
      {
        element: (
          <PrivateRoute hasAnyAuthorities={[Authority.SELLER]}>
            <Outlet />
          </PrivateRoute>
        ),
        children: [
          { path: 'create-listing', element: <CreateListingPage /> },
          { path: 'listings/edit/:id', element: <CreateListingPage /> },
          { path: 'seller-dashboard', element: <SellerDashboardPage /> },
        ],
      },
      {
        element: (
          <PrivateRoute hasAnyAuthorities={[Authority.USER]}>
            <EntitiesLayout />
          </PrivateRoute>
        ),
        children: [
          { path: 'user-management/*', element: <UserManagement /> },
          { path: 'university/*', element: <University /> },
          { path: 'campus/*', element: <Campus /> },
          { path: 'user-profile/*', element: <UserProfile /> },
          { path: 'category/*', element: <Category /> },
          { path: 'product/*', element: <Product /> },
          { path: 'product-image/*', element: <ProductImage /> },
          { path: 'cart-item/*', element: <CartItem /> },
          { path: 'item-request/*', element: <ItemRequest /> },
          { path: 'request-offer/*', element: <RequestOffer /> },
          { path: 'orders/*', element: <Orders /> },
          { path: 'order-item/*', element: <OrderItem /> },
          { path: 'review/*', element: <Review /> },
          { path: 'report/*', element: <Report /> },
          { path: 'user-wallet/*', element: <UserWallet /> },
          { path: 'wallet-transaction/*', element: <WalletTransaction /> },
          { path: 'user-bank-account/*', element: <UserBankAccount /> },
          { path: 'premium-package/*', element: <PremiumPackage /> },
          { path: 'user-premium/*', element: <UserPremium /> },
          { path: 'system-payment-transaction/*', element: <SystemPaymentTransaction /> },
          { path: 'premium-history/*', element: <PremiumHistory /> },
          { path: 'invoice/*', element: <Invoice /> },
          { path: 'chat-room/*', element: <ChatRoom /> },
          { path: 'chat-message/*', element: <ChatMessage /> },
          { path: 'ai-chat-session/*', element: <AiChatSession /> },
          { path: 'ai-chat-message/*', element: <AiChatMessage /> },
          { path: 'user-search-history/*', element: <UserSearchHistory /> },
          { path: 'notification/*', element: <Notification /> },
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
              <PrivateRoute hasAnyAuthorities={[Authority.USER]}>
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

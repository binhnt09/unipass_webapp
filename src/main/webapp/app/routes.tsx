import React, { Suspense } from 'react';
import { createBrowserRouter, Navigate, Outlet, useLocation } from 'react-router';

import { sendActivity } from 'app/config/websocket-middleware';
import EntitiesRoutes from 'app/entities/routes';
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
      {
        path: 'entities',
        element: (
          <PrivateRoute>
            <Navigate to="/product" replace />
          </PrivateRoute>
        ),
      },
      { path: 'premium', element: <PremiumPlansPage /> },
      { path: 'create-listing', element: <CreateListingPage /> },
      { path: 'login-info', element: <LoginInfoPage /> },
      { path: 'messages', element: <ChatPage /> },
      { path: 'seller-dashboard', element: <SellerDashboardPage /> },
      { path: 'orders', element: <MyOrdersPage /> },
      { path: 'cart', element: <ShoppingCartPage /> },
      { path: 'notifications', element: <NotificationsPage /> },
      { path: 'order/:id', element: <OrderDetailPage /> },
      { path: 'product/:id', element: <ProductDetailPage /> },
      { path: 'checkout', element: <CheckoutPage /> },
      { path: 'purchase-success', element: <PurchaseSuccessPage /> },
      { path: 'payment', element: <PaymentPage /> },
      { path: 'payment/momo', element: <MoMoQRPage /> },
      { path: 'payment/vnpay', element: <VNPayQRPage /> },
      { path: 'payment/bank-transfer', element: <BankTransferQRPage /> },
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
        path: 'admin/*',
        element: (
          <PrivateRoute hasAnyAuthorities={[Authority.ADMIN]}>
            <Admin />
          </PrivateRoute>
        ),
      },
      {
        path: '*',
        element: (
          <PrivateRoute hasAnyAuthorities={[Authority.USER]}>
            <EntitiesRoutes />
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

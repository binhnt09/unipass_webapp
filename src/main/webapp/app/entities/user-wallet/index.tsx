import React from 'react';
import { Route } from 'react-router';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import UserWallet from './user-wallet';
import UserWalletDeleteDialog from './user-wallet-delete-dialog';
import UserWalletDetail from './user-wallet-detail';
import UserWalletUpdate from './user-wallet-update';

const UserWalletRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<UserWallet />} />
    <Route path="new" element={<UserWalletUpdate />} />
    <Route path=":id">
      <Route index element={<UserWalletDetail />} />
      <Route path="edit" element={<UserWalletUpdate />} />
      <Route path="delete" element={<UserWalletDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default UserWalletRoutes;

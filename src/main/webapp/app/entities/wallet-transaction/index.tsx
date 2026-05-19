import React from 'react';
import { Route } from 'react-router';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import WalletTransaction from './wallet-transaction';
import WalletTransactionDeleteDialog from './wallet-transaction-delete-dialog';
import WalletTransactionDetail from './wallet-transaction-detail';
import WalletTransactionUpdate from './wallet-transaction-update';

const WalletTransactionRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<WalletTransaction />} />
    <Route path="new" element={<WalletTransactionUpdate />} />
    <Route path=":id">
      <Route index element={<WalletTransactionDetail />} />
      <Route path="edit" element={<WalletTransactionUpdate />} />
      <Route path="delete" element={<WalletTransactionDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default WalletTransactionRoutes;

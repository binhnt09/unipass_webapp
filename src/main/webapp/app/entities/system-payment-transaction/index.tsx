import React from 'react';
import { Route } from 'react-router';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import SystemPaymentTransaction from './system-payment-transaction';
import SystemPaymentTransactionDeleteDialog from './system-payment-transaction-delete-dialog';
import SystemPaymentTransactionDetail from './system-payment-transaction-detail';
import SystemPaymentTransactionUpdate from './system-payment-transaction-update';

const SystemPaymentTransactionRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<SystemPaymentTransaction />} />
    <Route path="new" element={<SystemPaymentTransactionUpdate />} />
    <Route path=":id">
      <Route index element={<SystemPaymentTransactionDetail />} />
      <Route path="edit" element={<SystemPaymentTransactionUpdate />} />
      <Route path="delete" element={<SystemPaymentTransactionDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default SystemPaymentTransactionRoutes;

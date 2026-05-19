import React from 'react';
import { Route } from 'react-router';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import UserBankAccount from './user-bank-account';
import UserBankAccountDeleteDialog from './user-bank-account-delete-dialog';
import UserBankAccountDetail from './user-bank-account-detail';
import UserBankAccountUpdate from './user-bank-account-update';

const UserBankAccountRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<UserBankAccount />} />
    <Route path="new" element={<UserBankAccountUpdate />} />
    <Route path=":id">
      <Route index element={<UserBankAccountDetail />} />
      <Route path="edit" element={<UserBankAccountUpdate />} />
      <Route path="delete" element={<UserBankAccountDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default UserBankAccountRoutes;

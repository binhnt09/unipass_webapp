import React from 'react';
import { Route } from 'react-router';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import UserPremium from './user-premium';
import UserPremiumDeleteDialog from './user-premium-delete-dialog';
import UserPremiumDetail from './user-premium-detail';
import UserPremiumUpdate from './user-premium-update';

const UserPremiumRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<UserPremium />} />
    <Route path="new" element={<UserPremiumUpdate />} />
    <Route path=":id">
      <Route index element={<UserPremiumDetail />} />
      <Route path="edit" element={<UserPremiumUpdate />} />
      <Route path="delete" element={<UserPremiumDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default UserPremiumRoutes;

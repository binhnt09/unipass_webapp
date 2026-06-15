import React from 'react';
import { Route } from 'react-router';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import UserAddress from './user-address';
import UserAddressDeleteDialog from './user-address-delete-dialog';
import UserAddressDetail from './user-address-detail';
import UserAddressUpdate from './user-address-update';

const UserAddressRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<UserAddress />} />
    <Route path="new" element={<UserAddressUpdate />} />
    <Route path=":id">
      <Route index element={<UserAddressDetail />} />
      <Route path="edit" element={<UserAddressUpdate />} />
      <Route path="delete" element={<UserAddressDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default UserAddressRoutes;

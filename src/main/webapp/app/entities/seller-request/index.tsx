import React from 'react';
import { Route } from 'react-router';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import SellerRequest from './seller-request';
import SellerRequestDeleteDialog from './seller-request-delete-dialog';
import SellerRequestDetail from './seller-request-detail';
import SellerRequestUpdate from './seller-request-update';

const SellerRequestRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<SellerRequest />} />
    <Route path="new" element={<SellerRequestUpdate />} />
    <Route path=":id">
      <Route index element={<SellerRequestDetail />} />
      <Route path="edit" element={<SellerRequestUpdate />} />
      <Route path="delete" element={<SellerRequestDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default SellerRequestRoutes;

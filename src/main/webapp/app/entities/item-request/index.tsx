import React from 'react';
import { Route } from 'react-router';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import ItemRequest from './item-request';
import ItemRequestDeleteDialog from './item-request-delete-dialog';
import ItemRequestDetail from './item-request-detail';
import ItemRequestUpdate from './item-request-update';

const ItemRequestRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<ItemRequest />} />
    <Route path="new" element={<ItemRequestUpdate />} />
    <Route path=":id">
      <Route index element={<ItemRequestDetail />} />
      <Route path="edit" element={<ItemRequestUpdate />} />
      <Route path="delete" element={<ItemRequestDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default ItemRequestRoutes;

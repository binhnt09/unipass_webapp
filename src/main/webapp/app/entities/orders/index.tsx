import React from 'react';
import { Route } from 'react-router';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import Orders from './orders';
import OrdersDeleteDialog from './orders-delete-dialog';
import OrdersDetail from './orders-detail';
import OrdersUpdate from './orders-update';

const OrdersRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<Orders />} />
    <Route path="new" element={<OrdersUpdate />} />
    <Route path=":id">
      <Route index element={<OrdersDetail />} />
      <Route path="edit" element={<OrdersUpdate />} />
      <Route path="delete" element={<OrdersDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default OrdersRoutes;

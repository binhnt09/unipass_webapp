import React from 'react';
import { Route } from 'react-router';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import TradeRequest from './trade-request';
import TradeRequestDeleteDialog from './trade-request-delete-dialog';
import TradeRequestDetail from './trade-request-detail';
import TradeRequestUpdate from './trade-request-update';

const TradeRequestRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<TradeRequest />} />
    <Route path="new" element={<TradeRequestUpdate />} />
    <Route path=":id">
      <Route index element={<TradeRequestDetail />} />
      <Route path="edit" element={<TradeRequestUpdate />} />
      <Route path="delete" element={<TradeRequestDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default TradeRequestRoutes;

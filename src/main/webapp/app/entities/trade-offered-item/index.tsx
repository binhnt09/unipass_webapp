import React from 'react';
import { Route } from 'react-router';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import TradeOfferedItem from './trade-offered-item';
import TradeOfferedItemDeleteDialog from './trade-offered-item-delete-dialog';
import TradeOfferedItemDetail from './trade-offered-item-detail';
import TradeOfferedItemUpdate from './trade-offered-item-update';

const TradeOfferedItemRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<TradeOfferedItem />} />
    <Route path="new" element={<TradeOfferedItemUpdate />} />
    <Route path=":id">
      <Route index element={<TradeOfferedItemDetail />} />
      <Route path="edit" element={<TradeOfferedItemUpdate />} />
      <Route path="delete" element={<TradeOfferedItemDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default TradeOfferedItemRoutes;

import React from 'react';
import { Route } from 'react-router';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import PremiumHistory from './premium-history';
import PremiumHistoryDeleteDialog from './premium-history-delete-dialog';
import PremiumHistoryDetail from './premium-history-detail';
import PremiumHistoryUpdate from './premium-history-update';

const PremiumHistoryRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<PremiumHistory />} />
    <Route path="new" element={<PremiumHistoryUpdate />} />
    <Route path=":id">
      <Route index element={<PremiumHistoryDetail />} />
      <Route path="edit" element={<PremiumHistoryUpdate />} />
      <Route path="delete" element={<PremiumHistoryDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default PremiumHistoryRoutes;

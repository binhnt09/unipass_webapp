import React from 'react';
import { Route } from 'react-router';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import StatusHistory from './status-history';
import StatusHistoryDeleteDialog from './status-history-delete-dialog';
import StatusHistoryDetail from './status-history-detail';
import StatusHistoryUpdate from './status-history-update';

const StatusHistoryRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<StatusHistory />} />
    <Route path="new" element={<StatusHistoryUpdate />} />
    <Route path=":id">
      <Route index element={<StatusHistoryDetail />} />
      <Route path="edit" element={<StatusHistoryUpdate />} />
      <Route path="delete" element={<StatusHistoryDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default StatusHistoryRoutes;

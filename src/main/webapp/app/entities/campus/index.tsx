import React from 'react';
import { Route } from 'react-router';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import Campus from './campus';
import CampusDeleteDialog from './campus-delete-dialog';
import CampusDetail from './campus-detail';
import CampusUpdate from './campus-update';

const CampusRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<Campus />} />
    <Route path="new" element={<CampusUpdate />} />
    <Route path=":id">
      <Route index element={<CampusDetail />} />
      <Route path="edit" element={<CampusUpdate />} />
      <Route path="delete" element={<CampusDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default CampusRoutes;

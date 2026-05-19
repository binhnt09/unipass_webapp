import React from 'react';
import { Route } from 'react-router';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import University from './university';
import UniversityDeleteDialog from './university-delete-dialog';
import UniversityDetail from './university-detail';
import UniversityUpdate from './university-update';

const UniversityRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<University />} />
    <Route path="new" element={<UniversityUpdate />} />
    <Route path=":id">
      <Route index element={<UniversityDetail />} />
      <Route path="edit" element={<UniversityUpdate />} />
      <Route path="delete" element={<UniversityDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default UniversityRoutes;

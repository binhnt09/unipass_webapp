import React from 'react';
import { Route } from 'react-router';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import PremiumPackage from './premium-package';
import PremiumPackageDeleteDialog from './premium-package-delete-dialog';
import PremiumPackageDetail from './premium-package-detail';
import PremiumPackageUpdate from './premium-package-update';

const PremiumPackageRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<PremiumPackage />} />
    <Route path="new" element={<PremiumPackageUpdate />} />
    <Route path=":id">
      <Route index element={<PremiumPackageDetail />} />
      <Route path="edit" element={<PremiumPackageUpdate />} />
      <Route path="delete" element={<PremiumPackageDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default PremiumPackageRoutes;

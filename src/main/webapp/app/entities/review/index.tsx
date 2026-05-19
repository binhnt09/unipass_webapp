import React from 'react';
import { Route } from 'react-router';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import Review from './review';
import ReviewDeleteDialog from './review-delete-dialog';
import ReviewDetail from './review-detail';
import ReviewUpdate from './review-update';

const ReviewRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<Review />} />
    <Route path="new" element={<ReviewUpdate />} />
    <Route path=":id">
      <Route index element={<ReviewDetail />} />
      <Route path="edit" element={<ReviewUpdate />} />
      <Route path="delete" element={<ReviewDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default ReviewRoutes;

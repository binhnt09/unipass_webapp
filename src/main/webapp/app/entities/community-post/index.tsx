import React from 'react';
import { Route } from 'react-router';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import CommunityPost from './community-post';
import CommunityPostDeleteDialog from './community-post-delete-dialog';
import CommunityPostDetail from './community-post-detail';
import CommunityPostUpdate from './community-post-update';

const CommunityPostRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<CommunityPost />} />
    <Route path="new" element={<CommunityPostUpdate />} />
    <Route path=":id">
      <Route index element={<CommunityPostDetail />} />
      <Route path="edit" element={<CommunityPostUpdate />} />
      <Route path="delete" element={<CommunityPostDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default CommunityPostRoutes;

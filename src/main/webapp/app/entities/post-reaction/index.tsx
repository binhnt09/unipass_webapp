import React from 'react';
import { Route } from 'react-router';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import PostReaction from './post-reaction';
import PostReactionDeleteDialog from './post-reaction-delete-dialog';
import PostReactionDetail from './post-reaction-detail';
import PostReactionUpdate from './post-reaction-update';

const PostReactionRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<PostReaction />} />
    <Route path="new" element={<PostReactionUpdate />} />
    <Route path=":id">
      <Route index element={<PostReactionDetail />} />
      <Route path="edit" element={<PostReactionUpdate />} />
      <Route path="delete" element={<PostReactionDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default PostReactionRoutes;

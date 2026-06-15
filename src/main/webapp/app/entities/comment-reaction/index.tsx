import React from 'react';
import { Route } from 'react-router';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import CommentReaction from './comment-reaction';
import CommentReactionDeleteDialog from './comment-reaction-delete-dialog';
import CommentReactionDetail from './comment-reaction-detail';
import CommentReactionUpdate from './comment-reaction-update';

const CommentReactionRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<CommentReaction />} />
    <Route path="new" element={<CommentReactionUpdate />} />
    <Route path=":id">
      <Route index element={<CommentReactionDetail />} />
      <Route path="edit" element={<CommentReactionUpdate />} />
      <Route path="delete" element={<CommentReactionDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default CommentReactionRoutes;

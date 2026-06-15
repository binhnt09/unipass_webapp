import React from 'react';
import { Route } from 'react-router';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import PostComment from './post-comment';
import PostCommentDeleteDialog from './post-comment-delete-dialog';
import PostCommentDetail from './post-comment-detail';
import PostCommentUpdate from './post-comment-update';

const PostCommentRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<PostComment />} />
    <Route path="new" element={<PostCommentUpdate />} />
    <Route path=":id">
      <Route index element={<PostCommentDetail />} />
      <Route path="edit" element={<PostCommentUpdate />} />
      <Route path="delete" element={<PostCommentDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default PostCommentRoutes;

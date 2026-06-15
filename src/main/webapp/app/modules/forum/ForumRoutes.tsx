import React from 'react';
import { Route } from 'react-router';
import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';
import { ForumFeed } from './ForumFeed';
import { PostDetail } from './PostDetail';

export const ForumRoutes = () => (
  <div>
    <ErrorBoundaryRoutes>
      <Route index element={<ForumFeed />} />
      <Route path="post/:id" element={<PostDetail />} />
    </ErrorBoundaryRoutes>
  </div>
);

export default ForumRoutes;

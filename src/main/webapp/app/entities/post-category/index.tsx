import React from 'react';
import { Route } from 'react-router';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import PostCategory from './post-category';
import PostCategoryDeleteDialog from './post-category-delete-dialog';
import PostCategoryDetail from './post-category-detail';
import PostCategoryUpdate from './post-category-update';

const PostCategoryRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<PostCategory />} />
    <Route path="new" element={<PostCategoryUpdate />} />
    <Route path=":id">
      <Route index element={<PostCategoryDetail />} />
      <Route path="edit" element={<PostCategoryUpdate />} />
      <Route path="delete" element={<PostCategoryDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default PostCategoryRoutes;

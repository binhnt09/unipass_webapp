import React from 'react';
import { Route } from 'react-router';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import UserSearchHistory from './user-search-history';
import UserSearchHistoryDeleteDialog from './user-search-history-delete-dialog';
import UserSearchHistoryDetail from './user-search-history-detail';
import UserSearchHistoryUpdate from './user-search-history-update';

const UserSearchHistoryRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<UserSearchHistory />} />
    <Route path="new" element={<UserSearchHistoryUpdate />} />
    <Route path=":id">
      <Route index element={<UserSearchHistoryDetail />} />
      <Route path="edit" element={<UserSearchHistoryUpdate />} />
      <Route path="delete" element={<UserSearchHistoryDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default UserSearchHistoryRoutes;

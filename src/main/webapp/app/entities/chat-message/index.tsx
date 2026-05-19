import React from 'react';
import { Route } from 'react-router';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import ChatMessage from './chat-message';
import ChatMessageDeleteDialog from './chat-message-delete-dialog';
import ChatMessageDetail from './chat-message-detail';
import ChatMessageUpdate from './chat-message-update';

const ChatMessageRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<ChatMessage />} />
    <Route path="new" element={<ChatMessageUpdate />} />
    <Route path=":id">
      <Route index element={<ChatMessageDetail />} />
      <Route path="edit" element={<ChatMessageUpdate />} />
      <Route path="delete" element={<ChatMessageDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default ChatMessageRoutes;

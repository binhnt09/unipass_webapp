import React from 'react';
import { Route } from 'react-router';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import AiChatMessage from './ai-chat-message';
import AiChatMessageDeleteDialog from './ai-chat-message-delete-dialog';
import AiChatMessageDetail from './ai-chat-message-detail';
import AiChatMessageUpdate from './ai-chat-message-update';

const AiChatMessageRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<AiChatMessage />} />
    <Route path="new" element={<AiChatMessageUpdate />} />
    <Route path=":id">
      <Route index element={<AiChatMessageDetail />} />
      <Route path="edit" element={<AiChatMessageUpdate />} />
      <Route path="delete" element={<AiChatMessageDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default AiChatMessageRoutes;

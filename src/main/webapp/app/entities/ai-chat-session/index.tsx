import React from 'react';
import { Route } from 'react-router';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import AiChatSession from './ai-chat-session';
import AiChatSessionDeleteDialog from './ai-chat-session-delete-dialog';
import AiChatSessionDetail from './ai-chat-session-detail';
import AiChatSessionUpdate from './ai-chat-session-update';

const AiChatSessionRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<AiChatSession />} />
    <Route path="new" element={<AiChatSessionUpdate />} />
    <Route path=":id">
      <Route index element={<AiChatSessionDetail />} />
      <Route path="edit" element={<AiChatSessionUpdate />} />
      <Route path="delete" element={<AiChatSessionDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default AiChatSessionRoutes;

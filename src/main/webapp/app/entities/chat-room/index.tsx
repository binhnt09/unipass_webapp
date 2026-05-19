import React from 'react';
import { Route } from 'react-router';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import ChatRoom from './chat-room';
import ChatRoomDeleteDialog from './chat-room-delete-dialog';
import ChatRoomDetail from './chat-room-detail';
import ChatRoomUpdate from './chat-room-update';

const ChatRoomRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<ChatRoom />} />
    <Route path="new" element={<ChatRoomUpdate />} />
    <Route path=":id">
      <Route index element={<ChatRoomDetail />} />
      <Route path="edit" element={<ChatRoomUpdate />} />
      <Route path="delete" element={<ChatRoomDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default ChatRoomRoutes;

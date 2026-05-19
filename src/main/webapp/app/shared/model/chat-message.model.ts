import dayjs from 'dayjs';

import { IChatRoom } from 'app/shared/model/chat-room.model';
import { IUser } from 'app/shared/model/user.model';

export interface IChatMessage {
  id?: number;
  content?: string;
  isRead?: boolean | null;
  createdAt?: dayjs.Dayjs | null;
  room?: IChatRoom | null;
  sender?: IUser | null;
}

export const defaultValue: Readonly<IChatMessage> = {
  isRead: false,
};

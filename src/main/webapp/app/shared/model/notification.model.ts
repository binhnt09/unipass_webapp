import dayjs from 'dayjs';

import { IUser } from 'app/shared/model/user.model';

export interface INotification {
  id?: number;
  title?: string;
  content?: string;
  type?: string;
  isRead?: boolean | null;
  createdAt?: dayjs.Dayjs | null;
  user?: IUser | null;
}

export const defaultValue: Readonly<INotification> = {
  isRead: false,
};

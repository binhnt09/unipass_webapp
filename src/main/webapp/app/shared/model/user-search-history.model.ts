import dayjs from 'dayjs';

import { IUser } from 'app/shared/model/user.model';

export interface IUserSearchHistory {
  id?: number;
  keyword?: string;
  searchCount?: number | null;
  lastSearchedAt?: dayjs.Dayjs | null;
  user?: IUser | null;
}

export const defaultValue: Readonly<IUserSearchHistory> = {};

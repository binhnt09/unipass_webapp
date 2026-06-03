import dayjs from 'dayjs';

import { IUser } from 'app/shared/model/user.model';

export interface IStatusHistory {
  id?: number;
  referenceId?: number;
  referenceType?: string;
  status?: string;
  previousStatus?: string | null;
  note?: string | null;
  createdAt?: dayjs.Dayjs | null;
  actor?: IUser | null;
}

export const defaultValue: Readonly<IStatusHistory> = {};

import dayjs from 'dayjs';

import { IUser } from 'app/shared/model/user.model';

export interface IReport {
  id?: number;
  targetType?: string;
  targetId?: number;
  reason?: string;
  status?: string | null;
  isDeleted?: boolean | null;
  createdAt?: dayjs.Dayjs | null;
  updatedAt?: dayjs.Dayjs | null;
  reporter?: IUser | null;
  reported?: IUser | null;
}

export const defaultValue: Readonly<IReport> = {
  isDeleted: false,
};

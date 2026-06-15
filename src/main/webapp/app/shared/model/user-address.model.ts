import dayjs from 'dayjs';

import { IUser } from 'app/shared/model/user.model';

export interface IUserAddress {
  id?: number;
  name?: string;
  address?: string;
  latitude?: number | null;
  longitude?: number | null;
  isDefault?: boolean | null;
  createdAt?: dayjs.Dayjs | null;
  updatedAt?: dayjs.Dayjs | null;
  user?: IUser | null;
}

export const defaultValue: Readonly<IUserAddress> = {
  isDefault: false,
};

import dayjs from 'dayjs';

import { IUser } from 'app/shared/model/user.model';

export interface IUserWallet {
  id?: number;
  balance?: number | null;
  frozenBalance?: number | null;
  status?: string | null;
  isDeleted?: boolean | null;
  createdAt?: dayjs.Dayjs | null;
  updatedAt?: dayjs.Dayjs | null;
  user?: IUser;
}

export const defaultValue: Readonly<IUserWallet> = {
  isDeleted: false,
};

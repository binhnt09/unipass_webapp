import dayjs from 'dayjs';

import { IPremiumPackage } from 'app/shared/model/premium-package.model';
import { IUser } from 'app/shared/model/user.model';

export interface IUserPremium {
  id?: number;
  startDate?: dayjs.Dayjs;
  endDate?: dayjs.Dayjs;
  status?: string | null;
  updatedAt?: dayjs.Dayjs | null;
  premiumPackage?: IPremiumPackage | null;
  user?: IUser | null;
}

export const defaultValue: Readonly<IUserPremium> = {};

import dayjs from 'dayjs';

import { IPremiumPackage } from 'app/shared/model/premium-package.model';
import { IUser } from 'app/shared/model/user.model';

export interface IPremiumHistory {
  id?: number;
  coinSpent?: number;
  durationDays?: number;
  createdAt?: dayjs.Dayjs | null;
  premiumPackage?: IPremiumPackage | null;
  user?: IUser | null;
}

export const defaultValue: Readonly<IPremiumHistory> = {};

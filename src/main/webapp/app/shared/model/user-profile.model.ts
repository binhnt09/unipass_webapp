import dayjs from 'dayjs';

import { ICampus } from 'app/shared/model/campus.model';
import { IUser } from 'app/shared/model/user.model';

export interface IUserProfile {
  id?: number;
  phoneNumber?: string | null;
  studentIdNumber?: string | null;
  reputationScore?: number | null;
  referralCode?: string | null;
  fingerprintId?: string | null;
  currentPremiumLevel?: number | null;
  isStudentVerified?: boolean | null;
  isDeleted?: boolean | null;
  createdAt?: dayjs.Dayjs | null;
  updatedAt?: dayjs.Dayjs | null;
  user?: IUser;
  campus?: ICampus | null;
  referredBy?: IUser | null;
}

export const defaultValue: Readonly<IUserProfile> = {
  isStudentVerified: false,
  isDeleted: false,
};

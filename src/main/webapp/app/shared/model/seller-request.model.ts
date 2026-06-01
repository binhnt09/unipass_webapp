import dayjs from 'dayjs';

import { IUser } from 'app/shared/model/user.model';

export interface ISellerRequest {
  id?: number;
  phoneNumber?: string;
  hostelLocation?: string | null;
  bio?: string | null;
  idCardUrl?: string;
  status?: string;
  rejectionReason?: string | null;
  submittedAt?: dayjs.Dayjs;
  reviewedAt?: dayjs.Dayjs | null;
  reviewedBy?: string | null;
  user?: IUser;
}

export const defaultValue: Readonly<ISellerRequest> = {};

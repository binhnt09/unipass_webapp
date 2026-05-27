import dayjs from 'dayjs';

import { IUser } from 'app/shared/model/user.model';

export interface IOrders {
  id?: number;
  totalAmount?: number;
  platformDiscount?: number | null;
  status?: string | null;
  meetupLocation?: string | null;
  cancelReason?: string | null;
  buyerNote?: string | null;
  createdAt?: dayjs.Dayjs | null;
  buyer?: IUser | null;
  seller?: IUser | null;
}

export const defaultValue: Readonly<IOrders> = {};

import dayjs from 'dayjs';

import { IOrders } from 'app/shared/model/orders.model';
import { IUser } from 'app/shared/model/user.model';

export interface IReview {
  id?: number;
  rating?: number;
  comment?: string | null;
  isDeleted?: boolean | null;
  createdAt?: dayjs.Dayjs | null;
  updatedAt?: dayjs.Dayjs | null;
  order?: IOrders | null;
  reviewer?: IUser | null;
  reviewee?: IUser | null;
}

export const defaultValue: Readonly<IReview> = {
  isDeleted: false,
};

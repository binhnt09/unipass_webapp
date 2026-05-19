import dayjs from 'dayjs';

import { IProduct } from 'app/shared/model/product.model';
import { IUser } from 'app/shared/model/user.model';

export interface IChatRoom {
  id?: number;
  createdAt?: dayjs.Dayjs | null;
  product?: IProduct | null;
  buyer?: IUser | null;
  seller?: IUser | null;
}

export const defaultValue: Readonly<IChatRoom> = {};

import dayjs from 'dayjs';

import { IProduct } from 'app/shared/model/product.model';
import { IUser } from 'app/shared/model/user.model';

export interface ICartItem {
  id?: number;
  quantity?: number;
  createdAt?: dayjs.Dayjs | null;
  product?: IProduct | null;
  user?: IUser | null;
}

export const defaultValue: Readonly<ICartItem> = {};

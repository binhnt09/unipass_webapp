import dayjs from 'dayjs';

import { IItemRequest } from 'app/shared/model/item-request.model';
import { IProduct } from 'app/shared/model/product.model';
import { IUser } from 'app/shared/model/user.model';

export interface IRequestOffer {
  id?: number;
  offerPrice?: number;
  message?: string | null;
  createdAt?: dayjs.Dayjs | null;
  request?: IItemRequest | null;
  product?: IProduct | null;
  seller?: IUser | null;
}

export const defaultValue: Readonly<IRequestOffer> = {};

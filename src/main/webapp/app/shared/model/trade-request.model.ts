import dayjs from 'dayjs';

import { IProduct } from 'app/shared/model/product.model';
import { IUser } from 'app/shared/model/user.model';

export interface ITradeRequest {
  id?: number;
  topUpAmount?: number | null;
  status?: string | null;
  meetupLocation?: string | null;
  createdAt?: dayjs.Dayjs | null;
  updatedAt?: dayjs.Dayjs | null;
  targetProduct?: IProduct | null;
  buyer?: IUser | null;
  seller?: IUser | null;
}

export const defaultValue: Readonly<ITradeRequest> = {};

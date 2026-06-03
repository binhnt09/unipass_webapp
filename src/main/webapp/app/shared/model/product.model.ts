import dayjs from 'dayjs';

import { ICategory } from 'app/shared/model/category.model';
import { IUser } from 'app/shared/model/user.model';

export interface IProduct {
  id?: number;
  name?: string;
  description?: string | null;
  price?: number;
  status?: string | null;
  condition?: string | null;
  stock?: number;
  createdAt?: dayjs.Dayjs | null;
  updatedAt?: dayjs.Dayjs | null;
  category?: ICategory | null;
  seller?: IUser | null;
  sellerRating?: number;
  sellerReviews?: number;
}

export const defaultValue: Readonly<IProduct> = {};

import dayjs from 'dayjs';

import { ICategory } from 'app/shared/model/category.model';
import { IUser } from 'app/shared/model/user.model';

export interface IItemRequest {
  id?: number;
  title?: string;
  description?: string | null;
  expectedPrice?: number | null;
  status?: string | null;
  createdAt?: dayjs.Dayjs | null;
  category?: ICategory | null;
  buyer?: IUser | null;
}

export const defaultValue: Readonly<IItemRequest> = {};

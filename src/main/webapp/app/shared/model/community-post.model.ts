import dayjs from 'dayjs';

import { IPostCategory } from 'app/shared/model/post-category.model';
import { IUser } from 'app/shared/model/user.model';

export interface ICommunityPost {
  id?: number;
  title?: string;
  content?: string;
  status?: string | null;
  createdAt?: dayjs.Dayjs | null;
  updatedAt?: dayjs.Dayjs | null;
  category?: IPostCategory | null;
  author?: IUser | null;
}

export const defaultValue: Readonly<ICommunityPost> = {};

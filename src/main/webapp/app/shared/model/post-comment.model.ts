import dayjs from 'dayjs';

import { ICommunityPost } from 'app/shared/model/community-post.model';
import { IUser } from 'app/shared/model/user.model';

export interface IPostComment {
  id?: number;
  content?: string;
  createdAt?: dayjs.Dayjs | null;
  updatedAt?: dayjs.Dayjs | null;
  post?: ICommunityPost | null;
  author?: IUser | null;
}

export const defaultValue: Readonly<IPostComment> = {};

import dayjs from 'dayjs';

import { ICommunityPost } from 'app/shared/model/community-post.model';
import { IUser } from 'app/shared/model/user.model';

export interface IPostReaction {
  id?: number;
  reactionType?: string;
  createdAt?: dayjs.Dayjs | null;
  post?: ICommunityPost | null;
  user?: IUser | null;
}

export const defaultValue: Readonly<IPostReaction> = {};

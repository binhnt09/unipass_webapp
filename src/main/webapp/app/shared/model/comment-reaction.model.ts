import dayjs from 'dayjs';

import { IPostComment } from 'app/shared/model/post-comment.model';
import { IUser } from 'app/shared/model/user.model';

export interface ICommentReaction {
  id?: number;
  reactionType?: string;
  createdAt?: dayjs.Dayjs | null;
  comment?: IPostComment | null;
  user?: IUser | null;
}

export const defaultValue: Readonly<ICommentReaction> = {};

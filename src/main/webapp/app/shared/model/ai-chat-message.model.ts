import dayjs from 'dayjs';

import { IAiChatSession } from 'app/shared/model/ai-chat-session.model';

export interface IAiChatMessage {
  id?: number;
  role?: string;
  content?: string;
  recommendedProductIds?: string | null;
  tokensUsed?: number | null;
  createdAt?: dayjs.Dayjs | null;
  session?: IAiChatSession | null;
}

export const defaultValue: Readonly<IAiChatMessage> = {};

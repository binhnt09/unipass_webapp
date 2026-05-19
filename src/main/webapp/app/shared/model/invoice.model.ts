import dayjs from 'dayjs';

import { IUser } from 'app/shared/model/user.model';

export interface IInvoice {
  id?: number;
  invoiceNumber?: string;
  sourceType?: string;
  sourceId?: number;
  amountPaid?: number;
  currency?: string | null;
  emailSentStatus?: string | null;
  sentAt?: dayjs.Dayjs | null;
  createdAt?: dayjs.Dayjs | null;
  updatedAt?: dayjs.Dayjs | null;
  user?: IUser | null;
}

export const defaultValue: Readonly<IInvoice> = {};

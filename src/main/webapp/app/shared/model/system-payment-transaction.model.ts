import dayjs from 'dayjs';

import { IUser } from 'app/shared/model/user.model';

export interface ISystemPaymentTransaction {
  id?: number;
  paymentMethod?: string;
  paymentChannel?: string | null;
  amountVnd?: number;
  coinReceived?: number;
  gatewayReference?: string;
  appOrderId?: string;
  bankCode?: string | null;
  status?: string | null;
  rawResponse?: string | null;
  createdAt?: dayjs.Dayjs | null;
  updatedAt?: dayjs.Dayjs | null;
  user?: IUser | null;
}

export const defaultValue: Readonly<ISystemPaymentTransaction> = {};

import dayjs from 'dayjs';

import { IUserWallet } from 'app/shared/model/user-wallet.model';

export interface IWalletTransaction {
  id?: number;
  amount?: number;
  transactionType?: string;
  referenceType?: string | null;
  referenceId?: number | null;
  description?: string | null;
  createdAt?: dayjs.Dayjs | null;
  wallet?: IUserWallet | null;
}

export const defaultValue: Readonly<IWalletTransaction> = {};

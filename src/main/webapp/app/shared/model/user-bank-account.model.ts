import { IUser } from 'app/shared/model/user.model';

export interface IUserBankAccount {
  id?: number;
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
  isDefault?: boolean | null;
  user?: IUser | null;
}

export const defaultValue: Readonly<IUserBankAccount> = {
  isDefault: false,
};

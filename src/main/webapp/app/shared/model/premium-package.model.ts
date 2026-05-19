import dayjs from 'dayjs';

export interface IPremiumPackage {
  id?: number;
  name?: string;
  priceCoin?: number;
  durationDays?: number;
  features?: string | null;
  isDeleted?: boolean | null;
  createdAt?: dayjs.Dayjs | null;
  updatedAt?: dayjs.Dayjs | null;
}

export const defaultValue: Readonly<IPremiumPackage> = {
  isDeleted: false,
};

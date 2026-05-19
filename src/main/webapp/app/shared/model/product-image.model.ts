import { IProduct } from 'app/shared/model/product.model';

export interface IProductImage {
  id?: number;
  imageUrl?: string;
  isPrimary?: boolean | null;
  product?: IProduct | null;
}

export const defaultValue: Readonly<IProductImage> = {
  isPrimary: false,
};

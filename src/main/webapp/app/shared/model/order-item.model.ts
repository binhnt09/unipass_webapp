import { IOrders } from 'app/shared/model/orders.model';
import { IProduct } from 'app/shared/model/product.model';

export interface IOrderItem {
  id?: number;
  price?: number;
  quantity?: number;
  order?: IOrders | null;
  product?: IProduct | null;
}

export const defaultValue: Readonly<IOrderItem> = {};

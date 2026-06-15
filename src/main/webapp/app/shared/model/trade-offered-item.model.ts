import { IProduct } from 'app/shared/model/product.model';
import { ITradeRequest } from 'app/shared/model/trade-request.model';

export interface ITradeOfferedItem {
  id?: number;
  offeredProduct?: IProduct | null;
  tradeRequest?: ITradeRequest | null;
}

export const defaultValue: Readonly<ITradeOfferedItem> = {};

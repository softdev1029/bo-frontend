import { OrderBookStartLayer } from "@/constants/order-book-enums";
import { SymbolType, SymbolValue } from "@/constants/symbol-enums";
import { OrderSide } from "@/constants/system-enums";
import { PacketHeaderMessageType } from "@/constants/websocket.enums";
import { CallPutOption } from "./order.model";

export interface OrderBookRaw {
  price: number;
  size: number;
  expiryDate?: string;
  callPut?: CallPutOption;
}

export interface OrderBookModel extends OrderBookRaw {
  sumSize?: number;
}

/**
 * @example
 * book data should be saved in following structure
 * {
 *  bids: {
 *  [price1]: amount1,
 *  [price2]: amount2
 * ....
 *  }
 * }
 */
export type BookItem = {
  [price: number]: number; // pirce:quantity
};

export type BookData = Partial<BookItem>;

export type OrderBookStruct = {
  price: number;
  volume: number;
  numOrders: number;
  side: "B" | "S";
};
export interface IBookResponse {
  type: PacketHeaderMessageType;
  symbolEnum: SymbolValue;
  side: OrderSide;
  symbolType?: SymbolType;
  symbolName?: string;
  sendingTime?: number;
  seqNum?: number;
  startLayer?: OrderBookStartLayer;
  markBidPrice?: number;
  markOfferPrice?: number;
  orderbooks?: OrderBookStruct[];
}

export type OptionsBookDataItem = {
  putBid: OrderBookModel;
  putAsk: OrderBookModel;
  callBid: OrderBookModel;
  callAsk: OrderBookModel;
};

export type OptionsBookData = {
  [expirtyDate: string]: OptionsBookDataItem[];
};

import { OrderBookStartLayer } from "@/constants/order-book-enums";
import {
  MessageType,
  MessageUpdateType,
  OrderSide,
  OrderStatus,
  OrderType,
  StopTrigger,
  TIF,
} from "@/constants/system-enums";
import { SymbolType, SymbolValue } from "@/constants/symbol-enums";

export type OrderItem = {
  orderMessageType?: MessageType;
  orderId: number;
  clientOrderId: number;
  symbolEnum: SymbolValue;
  orderType: OrderType;
  symbolType: SymbolType;
  price: number;
  side: OrderSide;
  qty: number;
  tif: TIF;
  stopPrice: number;
  origPrice: number;
  symbolName: string;
  cancelShares: number;
  execId: number;
  execShares: number;
  remainQty: number;
  limitCross: number;
  expiredDate: string;
  tradeId: number;
  sessionId: number;
  displaySize?: number;
  refreshSize?: number;
  layers: OrderBookStartLayer;
  sizeIncrement: number;
  priceIncrement: number;
  priceOffset: number;
  execPrice: number;
  status: OrderStatus;
  takeProfitPrice: number;
  triggerType: StopTrigger;
  attributes?: string; // 12 character indexed by AttributeIndexEnum
  putCall?: CallPutOption;
  strikePrice: number;
  secondLegPrice: number;
  isTimeout?: boolean;
};

export type TransactionModel = OrderItem & {
  rejectReason: number;
  updateType: MessageUpdateType;
  accountId: number;
  sendingTime: number;
};

export type OrderEntry = {
  formId: number;
  symbol: string;
  expiryDate: Date;
};

export enum CallPutOption {
  CALL = "C",
  PUT = "P",
}

export enum Symbols {
  OPTION = "Option",
  FUTURES = "Futures",
  SPOT = "Spot",
}

export enum Options {
  BTC = "BTC",
  ETH = "ETH",
  XRP = "XRP",
}

import {
  AttributeIndexEnum,
  MessageType,
  OrderSide,
  OrderType,
  TIF,
  TradeOption,
} from "@/constants/system-enums";
import { SymbolType, SymbolValue } from "@/constants/symbol-enums";
import { WebSocketKindEnum } from "@/constants/websocket.enums";
import {
  CallPutOption,
  OrderItem,
  TransactionModel,
} from "@/models/order.model";
import {
  TransactionManner,
  TRANSACTION_ATTRIBUTE_LENGTH,
} from "@/packets/transaction.packet";
import { sendWsData } from "./ws.actions";
import { getSymbolEnum } from "@/exports/ticker.utils";

export const ORDER_NEW = "@order/ORDER_NEW";

export const ORDER_NEW_ACCEPTED = "@order/ORDER_NEW_ACCEPTED";
export const ORDER_UPDATED = "@order/ORDER_UPDATED";
export const ORDER_UPDATED_LOCAL = "@order/ORDER_UPDATED_LOCAL";

export const ORDER_EXECUTION = "@order/ORDER_EXECUTION";
export const EXECUTION_PARTIAL = "@order/EXECUTION_PARTIAL";
export const ORDER_REJECTED = "@order/ORDER_REJECTED";
export const ORDER_CANCELLED = "@order/ORDER_CANCELLED";

export const ORDER_CREATE_NEW_ORDER_ENTRY =
  "@order/ORDER_CREATE_NEW_ORDER_ENTRY";
export const ORDER_DELETE_ORDER_ENTRY = "@order/ORDER_DELETE_ORDER_ENTRY";
export const ORDER_UPDATE_ORDER_ENTRY = "@order/ORDER_UPDATE_ORDER_ENTRY";

export function orderUpdated(msgType: MessageType, newOrder: OrderItem) {
  return {
    type: ORDER_UPDATED,
    payload: {
      msgType,
      newOrder,
    },
  };
}

export function newOrderAccepted(newOrder: OrderItem) {
  return {
    type: ORDER_NEW_ACCEPTED,
    payload: newOrder,
  };
}

interface NewOrderParams {
  pair: string;
  accountId: number;
  sessionId: number;
  tradeOptions?: TradeOption[];
  clientOrderId: number;
  type: OrderType;
  side: OrderSide;
  price: number;
  amount: number;
  stopPrice?: number;
  tif?: TIF;
  symbolType?: SymbolType;
  symbolEnum?: SymbolValue;
  displaySize?: number;
  stopLoss?: number;
  takeProfit?: number;
  refreshSize?: number;
  priceIncrement?: number;
  sizeIncrement?: number;
  offset?: number;
  layers?: number;
  secondLegPrice?: number;
  limitCross?: number;
  putCall?: CallPutOption;
  strikePrice: number;
}

export interface ReplaceOrderParams {
  clientOrderId: number;
  order: OrderItem;
}

export function submitNewOrder({
  accountId = 100500,
  tradeOptions,
  clientOrderId,
  pair,
  type,
  side,
  price,
  amount,
  stopPrice,
  tif = TIF.GTC,
  symbolType = SymbolType.SPOT,
  displaySize = 0,
  refreshSize = 0,
  stopLoss,
  takeProfit,
  sessionId,
  priceIncrement = 0,
  sizeIncrement = 0,
  offset = 0,
  layers = 2,
  secondLegPrice = 0,
  limitCross = 0,
  putCall = CallPutOption.CALL,
  strikePrice = 0,
}: NewOrderParams) {
  const symbolEnum = getSymbolEnum(pair) || SymbolValue.BTCUSD;
  let attributesArray = new Array(TRANSACTION_ATTRIBUTE_LENGTH).fill("N");
  const Y = "Y";

  if (!!displaySize) {
    attributesArray[AttributeIndexEnum.DISPLAYSIZE_ATTRIBUTE] = Y;
  }

  if (!!stopLoss || !!takeProfit) {
    attributesArray[AttributeIndexEnum.TPSL_ATTRIBUTE] = Y;
  }

  tradeOptions.forEach((tradeOption) => {
    if (tradeOption === TradeOption.HIDDEN) {
      attributesArray[AttributeIndexEnum.HIDDEN_ATTRIBUTE] = Y;
    } else if (tradeOption === TradeOption.POO) {
      attributesArray[AttributeIndexEnum.POST] = Y;
    } else if (tradeOption === TradeOption.RED) {
      attributesArray[AttributeIndexEnum.REDUCE] = Y;
    }
  });

  const params: Partial<TransactionModel> = {
    orderMessageType: MessageType.ORDER_NEW,
    accountId,
    clientOrderId,
    symbolEnum,
    symbolName: pair,
    orderType: type,
    symbolType,
    price: price,
    side,
    qty: amount,
    tif,
    sendingTime: Date.now(),
    sessionId,
    stopPrice: stopPrice || stopLoss,
    takeProfitPrice: takeProfit,
    displaySize,
    refreshSize,
    attributes: attributesArray.join(""),
    priceIncrement,
    sizeIncrement,
    priceOffset: offset,
    layers,
    secondLegPrice,
    limitCross,
    putCall,
    strikePrice,
  };

  const order = TransactionManner.send(params);
  console.log(
    ">>> origin data for submit new Order",
    TransactionManner.read(order)
  );

  return sendWsData(WebSocketKindEnum.ORDERS, order);
}

export function cancelOrder({ clientOrderId, order }: ReplaceOrderParams) {
  console.log(">>> origin order", { ...order }, "clientOrderId", clientOrderId);
  // if this order is bracket order
  // if you cancel the sell order, put the second leg price into the price field
  const validPrice =
    order.orderType === OrderType.BRACKET && order.side === OrderSide.SELL
      ? order.secondLegPrice
      : order.price;

  const params = {
    ...order,
    price: validPrice,
    symbolEnum: order.symbolEnum,
    orderMessageType: MessageType.ORDER_CANCEL,
    clientOrderId,
    sendingTime: Date.now(),
    orderId: order.clientOrderId, // original id
  };
  const orderPacket = TransactionManner.send(params);

  console.log(">>> origin data for canceling Order", { ...order });
  console.log("transaction reader:", TransactionManner.read(orderPacket, true));

  return sendWsData(WebSocketKindEnum.ORDERS, orderPacket);
}

export function replaceOrder({ clientOrderId, order }: ReplaceOrderParams) {
  const params = {
    ...order,
    orderMessageType: MessageType.CANCEL_REPLACE,
    // symbolEnum: SymbolValue.BTCUSD,
    clientOrderId,
    orderId: order.clientOrderId,
  };
  const orderSender = TransactionManner.send(params);

  // console.log('[]transaction buffer:', order);
  console.log(
    "[replace order] transaction reader:",
    TransactionManner.read(orderSender, true)
  );

  return sendWsData(WebSocketKindEnum.ORDERS, orderSender);
}

export function createNewOrderEntry() {
  return {
    type: ORDER_CREATE_NEW_ORDER_ENTRY,
    payload: {},
  };
}

export function updateOrderEntry(payload) {
  return {
    type: ORDER_UPDATE_ORDER_ENTRY,
    payload,
  };
}

export function rejectOrderEntry(payload) {
  return {
    type: ORDER_DELETE_ORDER_ENTRY,
    payload,
  };
}

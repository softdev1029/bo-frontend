import { PacketHeaderMessageType } from "@/constants/websocket.enums";
import { DataByte, TypedData } from "@/message-structures/typed-data";
import { PacketManner } from "./packet-manner";

const COL_DATA_STRUCTURE = [
  new DataByte("type", TypedData.CHAR, 2), // 4
  new DataByte("padding", TypedData.SHORT), // 6
  new DataByte("userName", TypedData.CHAR, 6), // 8
  new DataByte("accountId", TypedData.INT), // 14
  new DataByte("symbolEnum", TypedData.SHORT), // 18
  new DataByte("leverage", TypedData.DOUBLE), // 20
  new DataByte("longPosition", TypedData.DOUBLE), // 28
  new DataByte("shortPosition", TypedData.DOUBLE), // 36
  new DataByte("longCash", TypedData.DOUBLE), // 44
  new DataByte("shortCash", TypedData.DOUBLE), // 52
  new DataByte("tradingDisabled", TypedData.CHAR, 1), // 60 - symbolDisabled
  new DataByte("accountEquity", TypedData.DOUBLE), // 61
  new DataByte("symbolEquity", TypedData.DOUBLE), // 69 - instrumentEquity
  new DataByte("executedLongCash", TypedData.DOUBLE), // 77
  new DataByte("executedLongPosition", TypedData.DOUBLE), // 85
  new DataByte("executedShortCash", TypedData.DOUBLE), // 93
  new DataByte("executedShortPosition", TypedData.DOUBLE), // 101
  new DataByte("BTCEquity", TypedData.DOUBLE), // 109
  new DataByte("USDTEquity", TypedData.DOUBLE), // 117
  new DataByte("ETHEquity", TypedData.DOUBLE), // 125
  new DataByte("USDEquity", TypedData.DOUBLE), // 133
  new DataByte("FLYEquity", TypedData.DOUBLE), // 141
  new DataByte("openOrderRequestLimit", TypedData.INT), // 149
  new DataByte("sessionId", TypedData.INT), // 153 - TradingSessionID
  new DataByte("msgSeqId", TypedData.INT), // 157 - lastSeqNum
  // new DataByte('availableMargin', TypedData.DOUBLE), // 30
  // new DataByte('usedMargin', TypedData.DOUBLE), // 38
  // new DataByte('openLongOrders', TypedData.DOUBLE), // 70
  // new DataByte('openShortOrders', TypedData.DOUBLE), // 94
  // new DataByte('MMR', TypedData.DOUBLE), // 135
];

export const ColDataManner = new PacketManner(
  PacketHeaderMessageType.COL_DATA,
  COL_DATA_STRUCTURE
);

import { PacketHeaderMessageType } from "@/constants/websocket.enums";
import { DataByte, TypedData } from "@/message-structures/typed-data";
import { IRiskAdminResponse, IRiskSymbolResponse } from "@/models/risk.model";
import { PacketManner } from "./packet-manner";

const RISK_ACCOUNT_INFO_STRUCTURE = [
  new DataByte("type", TypedData.CHAR, 2), // 4
  new DataByte("padding", TypedData.SHORT), // 6
  new DataByte("accountId", TypedData.INT), // 8
  new DataByte("sessionId", TypedData.INT), // 12
  new DataByte("symbolEnum", TypedData.SHORT), // 16
  new DataByte("key", TypedData.INT), // 18
  new DataByte("accountEquity", TypedData.DOUBLE), // 22
  new DataByte("symbolEquity", TypedData.DOUBLE), // 30
  new DataByte("leverage", TypedData.DOUBLE), // 38
  new DataByte("longPosition", TypedData.DOUBLE), // 46
  new DataByte("shortPosition", TypedData.DOUBLE), // 54
  new DataByte("msgSeqId", TypedData.LONG), // 62
  new DataByte("sendingTime", TypedData.LONG), // 70
  new DataByte("symbolName", TypedData.CHAR, 16), // 78
  new DataByte("tradeId", TypedData.SHORT), // 94
];

export const RISK_SYMBOL_COLLATERAL = [
  new DataByte("type", TypedData.CHAR, 2), // 4
  new DataByte("padding", TypedData.SHORT), // 6
  new DataByte("username", TypedData.CHAR, 6), // 8
  new DataByte("accountId", TypedData.INT), // 14
  new DataByte("symbolEnum", TypedData.SHORT), // 18
  new DataByte("leverage", TypedData.DOUBLE), // 20
  new DataByte("longPosition", TypedData.DOUBLE), // 28
  new DataByte("shortPosition", TypedData.DOUBLE), // 36
  new DataByte("longCash", TypedData.DOUBLE), // 44
  new DataByte("shortCash", TypedData.DOUBLE), // 52
  new DataByte("symbolDisabled", TypedData.CHAR, 1), // 60
  new DataByte("accountEquity", TypedData.DOUBLE), // 61
  new DataByte("instrumentEquity", TypedData.DOUBLE), // 69
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
  new DataByte("sessionId", TypedData.INT), // 153
  new DataByte("lastSeqNum", TypedData.INT), // 157
];

export const RiskAccountManner = new PacketManner<IRiskAdminResponse>(
  PacketHeaderMessageType.RISK_ACCOUNT,
  RISK_ACCOUNT_INFO_STRUCTURE
);
export const RiskSymbolManner = new PacketManner<IRiskSymbolResponse>(
  PacketHeaderMessageType.RISK_USER_SYMBOL,
  RISK_SYMBOL_COLLATERAL
);

import { SymbolValue } from "@/constants/symbol-enums";
import { PacketHeaderMessageType } from "@/constants/websocket.enums";

export interface IRiskSymbolResponse {
  type: PacketHeaderMessageType; // N
  padding?: string;
  username: string;
  symbolEnum: SymbolValue;
  leverage?: number;
  longPosition?: number;
  shortPosition?: number;
  longCash?: number;
  shortCash?: number;
  symbolDisabled: string; // Y : N
  accountEquity: number;
  instrumentEquity?: number;
  executedLongCash?: number;
  executedLongPosition?: number;
  executedShortCash?: number;
  executedShortPosition?: number;
  BTCEquity: number;
  USDTEquity: number;
  ETHEquity: number;
  USDEquity: number;
  FLYEquity: number;
  openOrderRequestLimit: number;
  sessionId: number;
  lastSeqNum: number;
}

export interface IRiskAdminResponse {
  type: PacketHeaderMessageType;
  padding?: string;
  accountId: number;
  sessionId: number;
  symbolEnum: SymbolValue;
  key?: number;
  accountEquity: number;
  symbolEquity: number;
  leverage: number;
  longPosition: number;
  shortPosition: number;
  msgSeqId: number;
  sendingTime: number;
  symbolName: string;
  tradeId: number;
}

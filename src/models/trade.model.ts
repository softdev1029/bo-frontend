import { OrderBookSideEnum } from "@/constants/order-book-enums";
import { OrderSide } from "@/constants/system-enums";
import { SymbolType, SymbolValue } from "@/constants/symbol-enums";
import { PacketHeaderMessageType } from "@/constants/websocket.enums";

export interface TradeItemModel {
  id: number;
  price: number;
  amount: number;
  date: number;
  side: OrderBookSideEnum;
}

export interface ExecReportResponse {
  type: PacketHeaderMessageType.EXEC_REPORT;
  padding?: number;
  symbolEnum: SymbolValue;
  symbolType: SymbolType;
  price: number;
  volume: number;
  sendingTime: number;
  seqNum: number;
  side: OrderSide;
  symbolName: string;
}

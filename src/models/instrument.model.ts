import { SymbolType, SymbolValue } from "@/constants/symbol-enums";
import { MessageUpdateType } from "@/constants/system-enums";
import { PacketHeaderMessageType } from "@/constants/websocket.enums";

export enum InstrumentRequestEnum {
  ALL = 0,
  // ALL2 = 1,
  USE_SYMBOL = 2, // symbol enum of requested symbol, when the type of request == 2 -> symbol Enum feild is gonna use
}

export interface InstrumentRequest {
  type: PacketHeaderMessageType;
  padding?: number;
  accountId: number;
  requestType: InstrumentRequestEnum;
  key?: number;
  symbolName?: string;
  symbolType: SymbolType;
  symbolEnum?: SymbolValue;
  sessionId?: number;
  sendingTime: number;
  seqNum?: number;
}
export interface InstrumentModel {
  minSize: number;
  maxSize: number;
  symbolName: string;
  symbolEnum: SymbolValue;
  symbolType: SymbolType;
  priceIncrement: number;
}

export interface InstrumentResponse extends InstrumentModel {
  type: PacketHeaderMessageType;
  padding?: number;
  responseType: MessageUpdateType;
  sendingTime: number;
  seqNum: number;
}

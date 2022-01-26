import { SymbolType, SymbolValue } from "@/constants/symbol-enums";
import {
  BarInterval,
  MessageUpdateType,
  ScrollInitalizeEnum,
} from "@/constants/system-enums";
import { PacketHeaderMessageType } from "@/constants/websocket.enums";

export interface IBar {
  interval: number;
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface IBarShnapshot {
  symbolEnum: SymbolValue;
  symbolType: SymbolType;
  chartBars?: IBar[]; //max 46 bars each
  numUpdates?: number;
}

export interface IBarSnapshotResponse extends IBarShnapshot {
  type: PacketHeaderMessageType;
  scrollInitalize: ScrollInitalizeEnum;
  updateType: MessageUpdateType;
  sendingTime: number;
  seqNum: number;
}

export interface IBarResponse extends IBar {
  type: PacketHeaderMessageType;
  sendingTime: number;
  seqNum: number;
  symbolEnum: SymbolValue;
  symbolType: SymbolType;
  symbolName: string;
}

export interface IBarReq {
  scrollInitalize: ScrollInitalizeEnum;
  barInterval: BarInterval;
  start: number;
  end: number;
  symbolEnum: SymbolValue;
  symbolType: SymbolType;
}
export interface IBarReqResponse extends IBarReq {
  type: PacketHeaderMessageType;
  sendingTime: number;
  seqNum: number;
  symbolName: string;
}

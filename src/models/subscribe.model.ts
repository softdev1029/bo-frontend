import { SymbolValue } from "@/constants/symbol-enums";
import { SubscribeType } from "@/constants/system-enums";
import { PacketHeaderMessageType } from "@/constants/websocket.enums";

export interface ISubscribeRequest {
  type?: PacketHeaderMessageType; // s = subscribe | u = unsubscribe
  padding?: number;
  accountId: number;
  key?: number;
  symbolEnum: SymbolValue;
  sessionId?: number;
  sendingTime: number;
  seqNum?: number;
  expirationDate?: string;
  subscribeType: SubscribeType;
}

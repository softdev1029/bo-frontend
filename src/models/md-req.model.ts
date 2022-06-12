import { SymbolValue } from "@/constants/symbol-enums";

export interface IMDInfoRequest {
  padding?: number;
  accountId: number;
  key?: number;
  symbolEnum: SymbolValue;
  sessionId?: number;
  sendingTime: number;
  seqNum?: number;
  expirationDate?: string;
}

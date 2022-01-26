import { SymbolType, SymbolValue } from "@/constants/symbol-enums";

export type BalanceFundInfo = {
  available: number;
  reserved: number;
  total: number;
};

export type BalanceInfo = {
  id: string | number;
  wallet: SymbolType;
  code: string;
} & BalanceFundInfo;

export type BalancesObject = {
  [ccy: string]: {
    [w in SymbolType]: BalanceInfo;
  } & CurrencyInfo & {
      code: string;
    };
};

export interface CurrencyInfo {
  id: number;
  code: string;
  name: string;
  targetConfirms: number;
  enableDeposit: boolean;
  enableWithdraw: boolean;
  feeWithdraw: number;
  minWithdraw: number;
  minDeposit: number;
  decimalAmount: number;
  withdrawalAmount: number;
}

export enum CollateralUpdateType {
  // If you ask to cancel an order,
  NORMAL_UPDATE = 1,
  // If it a normal market data update,
  USER_REQUEST,
  // If an ICE order has been moved due to the tob of book change
  UNSOLICITED,
  EXCHANGE_REQUEST,
  SNAPSHOT = 1,
  SNAPSHOT_START,
  SNAPSHOT_CONTINUATION,
  SNAPSHOT_FINISH,
  UPDATE,
  POSS_DUP,
}

export interface ICollateralUpdateRequest {
  updateType: CollateralUpdateType;
  accountId: number;
  sessionId?: number;
  seqNum?: number;
  sendingTime?: number;
  key?: number;
  symbolEnum: SymbolValue; // 0 means get all
}

export interface ICollateralData {
  username: string;
  accountId: number;
  symbolEnum: SymbolValue;
  leverage: number;
  longPosition?: number;
  shortPosition?: number;
  longCash?: number;
  shortCash?: number;
  isDisabled?: string; // Y | N
  accountEquity?: number;
  instrumentEquity?: number;
  execLongCash?: number;
  execLongPosition?: number;
  execShortCash?: number;
  execShortPosition?: number;
  BTCEquity?: number;
  USDTEquity?: number;
  ETHEquity?: number;
  USDEquity?: number;
  FLYEquity?: number;
  openOrderRequestLimit?: number;
  sessionId?: number;
  seqNum: number;
}

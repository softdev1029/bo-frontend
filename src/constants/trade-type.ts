// export enum AppTradeType {
//   SPOT = 'spot',
//   DERIVATIVE = 'derivative',
// };

import { SymbolType } from "./symbol-enums";

export enum AppTradeType {
  STAR = "star",
  SPOT = "spot",
  DERIVATIVE = "usdt-m",
  COIN_M = "coin-m",
}

export function appTradeTypeToSymbolType(tradeType: AppTradeType): SymbolType {
  switch (tradeType) {
    case AppTradeType.SPOT: {
      return SymbolType.SPOT;
    }
    case AppTradeType.DERIVATIVE: {
      return SymbolType.DERIVATIVE;
    }
    default: {
      return 0;
    }
  }
}

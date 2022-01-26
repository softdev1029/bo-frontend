import { SymbolValue } from "@/constants/symbol-enums";

export const REQUEST_INIT_COLLATERAL = "@collateral/INIT";
export const COLLATERAL_UPDATE = "@collateral/UPDATE";
export const REQUEST_UPDATE_COLLATERAL = "@collateral/REQUEST_UPDATE";

export const requestCollateral = (symbol: SymbolValue = 0) => ({
  type: REQUEST_INIT_COLLATERAL,
  payload: { symbol },
});

export const requestUpdateCollateral = (symbol: SymbolValue = 0) => ({
  type: REQUEST_UPDATE_COLLATERAL,
  payload: { symbol },
});

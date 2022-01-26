import { SymbolType } from "@/constants/symbol-enums";
import { ITickerConfig } from "@/models/ticker.model";
import { TOGGLE_FAVOR_SYMBOL } from "./ui-setting.actions";

// instrument
export const INSTRUMENT_REQUEST = "@ticker/INSTRUMENT_REQUEST";
export const INSTRUMENT_RECEIVED_UPDATE = "@ticker/INSTRUMENT_RECEIVED_UPDATE";

export function requestInstrument(walletType: SymbolType) {
  return {
    type: INSTRUMENT_REQUEST,
    payload: walletType,
  };
}

export function updateInstrument(
  data: Partial<ITickerConfig>,
  isLoaded: boolean
) {
  return {
    type: INSTRUMENT_RECEIVED_UPDATE,
    payload: {
      instrument: data,
      finished: isLoaded,
    },
  };
}

export function toggleFavoriteSymbol(ccy: string, persist?) {
  return {
    type: TOGGLE_FAVOR_SYMBOL,
    payload: { symbol: ccy, persist },
  };
}

export function tickerUpdate(ticker) {
  return {
    type: "any", // any mean we didn't do that
    payload: ticker,
  };
}

import { ITickerConfig } from "@/models/ticker.model";
import { SymbolType, SymbolValue } from "@/constants/symbol-enums";

type CurrencyInfoCollectionType = {
  [symbolEnum in SymbolValue]?: Partial<ITickerConfig>;
};

const spotTickers: CurrencyInfoCollectionType = {
  [SymbolValue.BTCUSDT]: {
    base: "BTC",
    quote: "USDT",
    symbolEnum: SymbolValue.BTCUSDT,
    symbolType: SymbolType.SPOT,
    niceCCy: "BTC/USDT",
    pair: "BTCUSDT",
    maxSize: 10,
  },
  [SymbolValue.BTCUSD]: {
    base: "BTC",
    quote: "USD",
    symbolEnum: SymbolValue.BTCUSD,
    symbolType: SymbolType.SPOT,
    niceCCy: "BTC/USD",
    pair: "BTCUSD",
    maxSize: 10,
  },
  [SymbolValue.FLYUSDT]: {
    base: "FLY",
    quote: "USDT",
    symbolEnum: SymbolValue.FLYUSDT,
    symbolType: SymbolType.SPOT,
    niceCCy: "FLY/USDT",
    pair: "FLYUSDT",
    maxSize: 10,
  },
  [SymbolValue.USDUSDT]: {
    base: "USD",
    quote: "USDT",
    symbolEnum: SymbolValue.USDUSDT,
    symbolType: SymbolType.SPOT,
    niceCCy: "USD/USDT",
    pair: "USDUSDT",
    maxSize: 10,
  },
};

export const SYMBOLENUM_TO_INSTRUMENT_MAP: CurrencyInfoCollectionType = {
  ...spotTickers,
};

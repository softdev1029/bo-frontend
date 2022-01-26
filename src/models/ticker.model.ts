import { SymbolType, SymbolValue } from "@/constants/symbol-enums";
import { InstrumentModel } from "./instrument.model";

export type TickerModel = {
  ccy: string; // symbol alias
  pair: string; // symbol alias
  symbol: string;
  high: number;
  low: number;
  lastPrice: number;
  bidPrice: number;
  askPrice: number;
  volume: number;
  dailyChangePerc: number;
  niceCcy: string;
  priceChange: number;
  name?: string;
  symbolType: SymbolType;
  symbolEnum: SymbolValue;
} & TickerMarkPriceModel;

export type TickerMarkPriceModel = {
  symbol: string;
  markPrice?: number;
  indexPrice?: number;
  lastFundingRate?: number;
  nextFundingRate?: number;
  interestRate?: number;
};

export type ITickerConfig = InstrumentModel & {
  pair: string;
  base: string;
  quote: string;
  niceCCy: string;
  symbolType: SymbolType;
};

import { InstrumentModel } from "@/models/instrument.model";
import _get from "lodash/get";
import _set from "lodash/set";
import _includes from "lodash/includes";
import _split from "lodash/split";
import _toUpper from "lodash/toUpper";
import _toLower from "lodash/toLower";
import { SymbolType, SymbolValue } from "@/constants/symbol-enums";
import { SYMBOLENUM_TO_INSTRUMENT_MAP } from "./instrument.config";
import { ITickerConfig } from "@/models/ticker.model";

let CURRENCY_DECIMALS_INFO_MAP = {};

let CCY_TO_SYMBOLENUM_MAP = {};

export function initTickerInfo(
  instrument: InstrumentModel
): Partial<ITickerConfig> | null {
  CURRENCY_DECIMALS_INFO_MAP = {};
  if (SYMBOLENUM_TO_INSTRUMENT_MAP.hasOwnProperty(instrument.symbolEnum)) {
    const tickerConfig = Object.assign(
      {},
      SYMBOLENUM_TO_INSTRUMENT_MAP[instrument.symbolEnum],
      instrument
    );

    SYMBOLENUM_TO_INSTRUMENT_MAP[instrument.symbolEnum] = tickerConfig;

    CCY_TO_SYMBOLENUM_MAP[instrument.symbolName] = instrument.symbolEnum;

    return tickerConfig;
  }

  return null;
}

//@ref https://cryptoicons.org
//https://cryptoicons.org/api/:style/:currency/:size/:color
export function getSvgUrl(ccy: string = "", size: number = 24) {
  return `/resources/crypto-icons/${ccy}.svg`;
  // return `https://icons.bitbot.tools/api/${ccy.toLowerCase()}/32x32`
}

export function getSymbols(ccy: string): string[] {
  if (_includes(ccy, "/")) {
    // XXX/YYY[Y] format
    return _split(ccy, "/", 2);
  }
  if (isValidSymbol(ccy)) {
    const symbolEnum = getSymbolEnum(ccy) || 0;
    return _split(
      _get(SYMBOLENUM_TO_INSTRUMENT_MAP, [symbolEnum, "niceCCy"], ""),
      "/",
      2
    );
  }

  return [];
}

export function getPairBySymbolEnum(symbolEnum: SymbolValue): string {
  return _get(SYMBOLENUM_TO_INSTRUMENT_MAP, [symbolEnum, "pair"], "");
}

export function firstInPair(pair: string, uppercase: boolean = true): string {
  const [first = "-"] = getSymbols(pair);

  return uppercase ? _toUpper(first) : _toLower(first);
}

export function lastInPair(pair: string, uppercase: boolean = true): string {
  const [, last = "-"] = getSymbols(pair);

  return uppercase ? _toUpper(last) : _toLower(last);
}

export function getMinNumberByDecimals(decimals: number): number {
  let count = decimals - 1 < 0 ? 0 : decimals - 1;

  return Number(`0.${"0".repeat(count)}1`);
}

export function toFixed(num, fixed) {
  var re = new RegExp("^-?\\d+(?:.\\d{0," + (fixed || -1) + "})?");
  return num.toString().match(re)[0];
}

export function getAmountDecimals(ccy: string): number {
  let decimals = _get(CURRENCY_DECIMALS_INFO_MAP, [ccy, "decimalAmount"], null);
  if (decimals === null) {
    decimals = getPrecisionFromNumber(getMinAmount(ccy));
    _set(CURRENCY_DECIMALS_INFO_MAP, [ccy, "decimalAmount"], decimals);
  }

  return decimals;
}

export function getPriceDecimals(ccy: string): number {
  let decimals = _get(CURRENCY_DECIMALS_INFO_MAP, [ccy, "decimalPrice"], null);
  if (decimals === null) {
    decimals = getPrecisionFromNumber(getMinPrice(ccy));
    _set(CURRENCY_DECIMALS_INFO_MAP, [ccy, "decimalPrice"], decimals);
  }

  return decimals;
}

export function isValidSymbol(ccy: string): boolean {
  return ccy && SYMBOLENUM_TO_INSTRUMENT_MAP.hasOwnProperty(getSymbolEnum(ccy));
}

export function getMinAmount(ccy: string): number {
  return _get(
    SYMBOLENUM_TO_INSTRUMENT_MAP,
    [getSymbolEnum(ccy), "minSize"],
    getMinNumberByDecimals(8)
  );
}

export function getMaxAmount(ccy: string): number {
  return _get(
    SYMBOLENUM_TO_INSTRUMENT_MAP,
    [getSymbolEnum(ccy), "maxSize"],
    getMaxPrice(ccy)
  );
}

export function getMinPrice(ccy: string): number {
  return _get(
    SYMBOLENUM_TO_INSTRUMENT_MAP,
    [getSymbolEnum(ccy), "priceIncrement"],
    0.1
  );
}

export function getMaxPrice(ccy: string): number {
  return Number.MAX_SAFE_INTEGER;
}

export function getPrecisionFromNumber(a: number): number {
  if (!isFinite(a)) return 0;
  var e = 1,
    p = 0;
  while (Math.round(a * e) / e !== a) {
    e *= 10;
    p++;
  }
  return p;
}

export function getSymbolNameBySymbolEnum(symbolEnum: SymbolValue): string {
  return (
    _get(SYMBOLENUM_TO_INSTRUMENT_MAP, [symbolEnum, "symbolName"], "") ||
    _get(SYMBOLENUM_TO_INSTRUMENT_MAP, [symbolEnum, "pair"], "")
  );
}

export function getNiceCCy(ccy: string): string {
  const fullName = getSymbols(ccy);

  if (!fullName) return "";

  const [base, quote] = fullName;

  return `${base}/${quote}`;
}

export function getSymbolEnum(
  ccy: string,
  walletType = SymbolType.SPOT
): SymbolValue {
  return _get(CCY_TO_SYMBOLENUM_MAP, [ccy], 0);
}

export function getSpotCcy(): Partial<ITickerConfig>[] {
  return Object.values(SYMBOLENUM_TO_INSTRUMENT_MAP).filter(
    ({ symbolType }) => symbolType === SymbolType.SPOT
  );
}

export function getDerivativeCcy(): Partial<ITickerConfig>[] {
  return Object.values(SYMBOLENUM_TO_INSTRUMENT_MAP).filter(
    ({ symbolType }) => symbolType === SymbolType.DERIVATIVE
  );
}

export function getStrikePriceIncrement(ccy: string): number {
  return _get(
    SYMBOLENUM_TO_INSTRUMENT_MAP,
    [getSymbolEnum(ccy), "strikePriceIncrement"],
    0.1
  );
}

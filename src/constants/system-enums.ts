export enum OrderType {
  LIMIT = 1,
  MARKET,
  STOP_MKT,
  STOP_LMT,
  PEG,
  HIDDEN,
  PEG_HIDDEN,
  OCO,
  ICE,
  OCO_ICE,
  BRACKET,
  SNIPER_MKT,
  SNIPER_LMT,
  TSM, // TRAILING_STOP_MKT
  TSL, // TRAILING_STOP_LMT
  TPSL_MARKET, // (Has 3 prices associated with it, entry, profit and stop)
  TPSL_LIMIT, //(Has 3 prices associated with it, entry, profit and stop)
}

/**
   * There will be another TIF:
    DAY = Day order only, only good for this session, when you log out this order will be cancelled
   */
export enum TIF { //  time in force
  FOK = 1, // Fill or Kill
  GTC, // Good till cancel
  IOC, // Immediate or Cancel
  POO, // (Post) Make only
  RED, // Reduce only
  DAY,
}

export enum TradeOption {
  POO = 1, // (Post) Make only
  RED, // Reduce only
  HIDDEN,
}

/**
 * will be used in Executions to show where you added liquidity or took liquidity
 */
export enum FeeType {
  MAKE = 1,
  TAKE,
}

export enum OrderSide {
  BUY = 1,
  SELL,
  SELLSHORT,
}

export enum OrderStatus {
  REJECTED = -1,
  PENDING = 0,
  OPEN = 1,
  CANCELLED = 2,
  FILLED = 3,
  PARTIALLY_FILLED = 4,
  ADMIN_CANCELLED = 5,
}

export enum StopTrigger {
  LAST_PRICE = 1,
  INDEX,
  MARK,
}

export enum LoginType {
  LOGIN = 1,
  LOGOUT,
}

export enum MessageType {
  ORDER_NEW = 1,
  CANCEL_REPLACE,
  MARGIN_CANCEL_REPLACE,
  MARGIN_EXECUTE,
  ORDER_STATUS,
  ORDER_CANCEL,
  MARGIN_CANCEL,
  EXECUTION,
  EXECUTION_PARTIAL,
  MARGIN_EXECUTION,
  MARGIN_PARTIAL_EXECUTION,
  REJECT,
  ORDER_REJECT,
  ORDER_ACK,
  CANCELLED,
  REPLACED,
  QUOTE_FILL,
  QUOTE_FILL_PARTIAL,
  MARGIN_REPLACED,
  CANCEL_REPLACE_REJECT,
  INSTRUMENT,
  INSTRUMENT_REQUEST,
  RISK_REJECT,
  TOB_MSG,
  THREE_LAYER_MD_MSG,
  FIVE_LAYER_MD_MSG,
  TEN_LAYER_MD_MSG,
  TWENTY_LAYER_MD_MSG,
  THIRTY_LAYER_MD_MSG,
  EXEC_REPORT,
  COLLATERAL_DATA,
  COLLATERAL_UPDATE_REQ,
  RISK_USER_SYMBOL,
  RISK_UPDATE_REQUEST,
  OPEN_ORDER_REQUEST,
  CLIENT_LOGON,
  MD_SNAPSHOT,
  MD_SUBSCRIBE,
}

// general message update type used in every updateType field
export enum MessageUpdateType {
  NORMAL_UPDATE = 1,
  USER_REQUEST,
  UNSOLICITED,
  EXCHANGE_REQUEST,
  SNAPSHOT,
  SNAPSHOT_START,
  SNAPSHOT_CONTINUATION,
  SNAPSHOT_FINISH,
  UPDATE,
  POSS_DUP,
}

export enum BarInterval {
  MINUTE = 1,
  FIVE_MINUTE,
  FIFTEEN_MINUTE,
  THIRTY_MINUTE,
  HOUR,
  TWENTYFOUR_HOUR,
}

export enum MarginType {
  CROSS = "cross",
  ISOLATE = "isolate",
}

export enum LastTradePriceType {
  MARK_PRICE = 1,
  LAST_PRICE,
}

export enum ICELayers {
  L2 = 2,
  L3,
  L4,
  L5,
  L6,
  L7,
  L8,
  L9,
  L10,
}

export enum TakeProfitStopLossType {
  PERCENT = 1,
  VALUE,
}

export enum SubscribeType {
  TOB = 1,
  THREELAYERS,
  FIVELAYERS,
  TENLAYERS,
  TWENTYLAYERS,
  THIRTYLAYERS,
  FOB_DATA,
  FLB_DATA,
}

export enum AttributeIndexEnum {
  POPPED,
  HIDDEN_ATTRIBUTE,
  DISPLAYSIZE_ATTRIBUTE,
  PEG_ATTRIBUTE,
  REDUCE,
  POST,
  STOPMKT_ATTRIBUTE,
  STOPLMT_ATTRIBUTE,
  TSL_ATTRIBUTE,
  TSM_ATTRIBUTE,
  TPSL_ATTRIBUTE,
  STATIC_ATTRIBUTE,
}

export enum ScrollInitalizeEnum {
  INITIALIZE = 1,
  SCROLL,
}

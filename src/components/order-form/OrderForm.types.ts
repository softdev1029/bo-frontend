import {
  ICELayers,
  LastTradePriceType,
  TakeProfitStopLossType,
  MarginType,
  OrderSide,
  OrderType,
  StopTrigger,
  TIF,
  TradeOption,
} from "@/constants/system-enums";
import { SymbolType } from "@/constants/symbol-enums";
import { OrderBookModel } from "@/models/book.model";
import { TabProps } from "@/ui-components/Tabs";
import { OrderItem } from "@/models/order.model";
import { ReactNode } from "react";

export enum OrderFormErrorEnum {
  QTY = 1,
  PRICE,
  STOP_PRICE,
}

export type OrderFormErrors = {
  [x in OrderFormErrorEnum]?: string;
};

export interface OrderEntryInfo {
  accountId: number;
  sessionId: number;
  stopTrigger?: number;
  wallet: SymbolType;
  clientOrderId: number;
  type: OrderType;
  side: OrderSide;
  stopPrice: number;
  price: number;
  amount: number;
  tif: TIF;
  tradeOptions: TradeOption[];
  displaySize: number;
  refreshSize: number;
  takeProfit: number;
  takeProfitStopLossType: TakeProfitStopLossType;
  stopLoss: number;
  priceIncrement: number;
  offset: number;
  sizeIncrement: number;
  selectedLayer: number;
  secondLegPrice: number;
  limitCross: number;
}

export type SubmitOrderEntryData = Partial<OrderEntryInfo> & {
  dispatch: (action: any) => void;
};

export type OrderValidationData = Partial<OrderEntryInfo> & {
  lowestSellPrice: number;
  highestBuyPrice: number;
  onError: () => void;
  executedLongCash: number;
  executedLongPosition: number;
  leverage: number;
};

export interface OrderFormContainerProps {
  accountId: number;
  sessionId: number;
  rendererComponent: any;
  dispatch: (action: any) => void;
  isLoggedIn: boolean;
  pair: string;
  wallet: SymbolType;
  balances?: object;
  tradingFee: number;
  bids: OrderBookModel[];
  asks: OrderBookModel[];
  tickerPrice: number;
  isAuthenticated: boolean;
  isTradeLoaded: boolean;
  tradeType: string;
  activeTradeTabTitle: string;
  submitOrderFn: (
    data: SubmitOrderEntryData,
    props: OrderFormContainerProps,
    state?: OrderFormControlsState,
    extraData?: AdditionPopupData
  ) => void;
  orderValidationFn: (data: OrderValidationData, props) => boolean;
  orderTypes: TabProps[]; // enabled types
  selectedType: OrderType;
  immediateSubmit: boolean;
  showCalculator: boolean;
  maxLeverage: number;
  executedLongCash: number;
  executedLongPosition: number;
  leverage: number;
  mmr: number;
  hidden: boolean;
  order?: OrderItem;
  formId: number;
  expiryDate: Date;
  isDraggable: boolean;
}

export interface OrderFormControlsState {
  price: number;
  stopPrice?: number;
  amount?: number;
  typeId: OrderType;
  total?: number;
  fund?: number;
  pair?: string;
  isTradeLoaded?: boolean;
  tif: TIF;
  tradeOptions: TradeOption[];
  leverage: number;
  applyTPnSL: boolean;
  takeProfit?: number;
  stopLoss?: number;
  takeProfitTradePriceType: LastTradePriceType;
  stopLossTradePriceType: LastTradePriceType;
  takeProfitStopLossType: TakeProfitStopLossType;
  displaySize?: number | undefined;
  refreshSize?: number | undefined;
  enabledStopTrigger: boolean;
  selectedStopTrigger: StopTrigger;
  trailValue?: number;
  offset?: number;
  priceIncrement?: number;
  selectedLayer?: ICELayers;
  qtyIncrement?: number;
  layers?: number;
  secondLegPrice?: number;
  limitCross?: number;
}

export interface OrderFormControlsProps {
  accountId: number;
  sessionId: number;
  onClickHandler: (
    data: OrderEntryInfo,
    onError: (errors?: OrderFormErrors) => void,
    state: OrderFormControlsState,
    extraData: AdditionPopupData,
    onSuccess: () => void
  ) => void;
  side?: OrderSide;
  initialPrice: number;
  balances: object;
  isAuthenticated: boolean;
  pair: string;
  isTradeLoaded: boolean;
  wallet: SymbolType;
  orderTypes: TabProps[]; // enabled types
  selectedType: OrderType;
  immediateSubmit: boolean;
  tradingFee: number;
  maxLeverage: number;
  mmr: number;
  hidden: boolean;
  activeTradeTabTitle: string;
  order?: OrderItem;
}

export type AdditionPopupData = {
  side: OrderSide;
  marginType?: MarginType;
  selectedLeverage?: number;
};

type OrderFormValidationRules = {
  quantity?: any[];
};

export type OrderFormInputDataFlows = OrderFormControlsState & {
  pair: string;
  side?: OrderSide;
  balance?: number;
  orderTypes: TabProps[];
  isAuthenticated: boolean;
  immediateSubmit: boolean;
  tradeType: string;
  activeTradeTabTitle: string;
  onPriceChange: (price: number) => void;
  onStopPriceChange: (price: number) => void;
  onAmountChange: (amount: number) => void;
  onOrderBtnClick: (
    clientId: number,
    data?: AdditionPopupData,
    cb?: (errors?: OrderFormErrors) => void
  ) => void;
  errors?: OrderFormErrors;
  onTotalChange: (total: number) => void;
  onUpdateAmountByBalancePercent: (
    balance: number,
    percent: number,
    side: any
  ) => void;
  onOrderTypeChange: (orderType: string) => void;
  onTIFChange: (tif: TIF) => void;
  onTradeOptionChange: (tradeOptions: TradeOption[]) => void;
  onLeverageChange: (leverage: number) => void;
  onApplyTPnSLChange: (apply: boolean) => void;
  onTakeProfitChange: (price: number) => void;
  onStopLossChange: (price: number) => void;
  onTakeProfitLastTradePriceTypeChange: (
    lastTradePriceType: LastTradePriceType
  ) => void;
  onStopLossLastTradePriceTypeChange: (
    lastTradePriceType: LastTradePriceType
  ) => void;
  onTakeProfitStopLossTypeChange: (
    takeProfitStopLossType: TakeProfitStopLossType
  ) => void;
  onDisplaySizeChange: (n: number) => void;
  onRefreshSizeChange: (n: number) => void;
  onToggleStopTrigger: (_, e) => void;
  selectedCloseTrigger: StopTrigger;
  onCloseTriggerOptionChange: (opiton: string) => void;
  onTrailValueChange: (n: string) => void;
  onOffsetChange: (n: number) => void;
  onPriceIncrementChange: (n: number) => void;
  onLayerChange: (layer: ICELayers) => void;
  onQtyIncrementChange: (n: number) => void;
  onSecondLegPriceChange: (n: number) => void;
  onLimitCrossChange: (n: number) => void;
  validationRules: OrderFormValidationRules;
  hideBalanceSlider?: boolean;
};

export type OrderFormProps = OrderFormControlsState &
  OrderFormInputDataFlows & {
    mmr: number;
    balances: object;
    maxLeverage: number;
    wallet: SymbolType;
    hidden: boolean;
    isolatedWrapperRef: any;
    closePopup?: any;
    formId: number;
    showModal: (mid: string, component: ReactNode, props) => void;
  };

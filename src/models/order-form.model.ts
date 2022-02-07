import {
  OrderType,
  LastTradePriceType,
  TakeProfitStopLossType,
  TIF,
  TradeOption,
  StopTrigger,
  ICELayers,
} from "@/constants/system-enums";

export interface OrderFormModel {
  pair: string;
  isTradeLoaded?: boolean;
  price?: number;
  stopPrice?: number;
  amount: number | undefined;
  typeId: OrderType;
  total: number;
  fund: number;
  applyTPnSL: boolean;
  takeProfitTradePriceType: LastTradePriceType;
  stopLossTradePriceType: LastTradePriceType;
  takeProfitStopLossType: TakeProfitStopLossType;
  stopLoss: number;
  takeProfit: number;
  tif: TIF;
  tradeOptions: TradeOption[];
  leverage: number;
  displaySize: number;
  refreshSize: number;
  enabledStopTrigger: boolean;
  selectedStopTrigger: StopTrigger;
  trailValue: number;
  offset: number;
  priceIncrement: number;
  selectedLayer: ICELayers;
  qtyIncrement: number;
  secondLegPrice: number;
  limitCross: number;
}

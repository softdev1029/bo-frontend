import _isNull from "lodash/isNull";
import _get from "lodash/get";
import { OrderFormModel } from "@/models/order-form.model";
import {
  LastTradePriceType,
  OrderType,
  TakeProfitStopLossType,
  TIF,
  ICELayers,
  StopTrigger,
  TradeOption,
} from "@/constants/system-enums";
import { getAttributesByOrderTradeOptions } from "@/components/order-form/OrderForm.helpers";
import { divide, multiply } from "@/exports/math";

import { ON_PRICE_CHANGE } from "@/actions/order-form.actions";

const initialState: OrderFormModel = {
  pair: "",
  isTradeLoaded: false,
  price: 0,
  stopPrice: 0,
  amount: 0,
  typeId: OrderType.LIMIT,
  total: 0,
  fund: 0,
  applyTPnSL: false,
  takeProfitTradePriceType: LastTradePriceType.MARK_PRICE,
  stopLossTradePriceType: LastTradePriceType.MARK_PRICE,
  takeProfitStopLossType: TakeProfitStopLossType.VALUE,
  stopLoss: 0,
  takeProfit: 0,
  tif: TIF.GTC,
  tradeOptions: getAttributesByOrderTradeOptions(),
  leverage: 0,
  displaySize: 0,
  refreshSize: 0,
  enabledStopTrigger: false,
  selectedStopTrigger: StopTrigger.LAST_PRICE,
  trailValue: 0,
  offset: 0,
  priceIncrement: 0,
  selectedLayer: 2,
  qtyIncrement: 0,
  secondLegPrice: 0,
  limitCross: 0,
};

export const orderFormReducer = (state = initialState, action) => {
  switch (action.type) {
    case ON_PRICE_CHANGE: {
      const { price, persist } = action.payload;
      const total = +multiply(state.amount, price);

      return {
        ...state,
        price,
        total,
      };
    }
    default:
      return state;
  }
};

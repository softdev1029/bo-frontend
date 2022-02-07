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
import {
  getAttributesByOrderTradeOptions,
  getPickedPrice,
} from "@/components/order-form/OrderForm.helpers";
import { divide, multiply } from "@/exports/math";

import {
  ON_ACCEPT,
  ON_AMOUNT_CHANGE,
  ON_ORDER_TYPE_CHANGE,
  ON_PRICE_CHANGE,
  ON_STOP_PRICE_CHANGE,
  ON_TOTAL_CHANGE,
} from "@/actions/order-form.actions";
import { getAmountDecimals } from "@/exports/ticker.utils";
import { sliceTo } from "@/exports/format-number";

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

const initTickerPrice: number = 0;

export const orderFormReducer = (state = initialState, action) => {
  switch (action.type) {
    // case ON_PRICE_CHANGE: {
    //   const { price, persist } = action.payload;
    //   const total = +multiply(state.amount, price);

    //   return {
    //     ...state,
    //     price,
    //     total,
    //   };
    // }
    // case ON_STOP_PRICE_CHANGE: {
    //   const { price, persist } = action.payload;
    //   const total = +multiply(state.amount, price);

    //   return {
    //     ...state,
    //     stopPrice: price,
    //     total,
    //   };
    // }
    // case ON_AMOUNT_CHANGE: {
    //   const { amount, persist } = action.payload;

    //   const tickerPrice = getPickedPrice({
    //     typeId: state.typeId,
    //     tickerPrice: initTickerPrice,
    //     price: state.price,
    //     stopPrice: state.stopPrice,
    //   });

    //   const total = +multiply(+amount, tickerPrice);

    //   const changed = { total };
    //   if (state.typeId === OrderType.ICE) {
    //     changed["qtyIncrement"] = divide(+state.amount, state.selectedLayer);
    //   }

    //   return {
    //     ...state,
    //     amount,
    //     total,
    //   };
    // }
    // case ON_TOTAL_CHANGE: {
    //   const { total, persist } = action.payload;

    //   const decimalPlaceAmount = getAmountDecimals(state.pair);
    //   const tickerPrice = getPickedPrice({
    //     typeId: state.typeId,
    //     tickerPrice: initTickerPrice,
    //     price: state.price,
    //     stopPrice: state.stopPrice,
    //   });

    //   if (Number(tickerPrice)) {
    //     let amount = +sliceTo(
    //       +divide(Number(total), tickerPrice),
    //       decimalPlaceAmount
    //     );
    //     return {
    //       ...state,
    //       amount,
    //     };
    //   }

    //   return {
    //     ...state,
    //     total,
    //   };
    // }
    // case ON_ORDER_TYPE_CHANGE: {
    //   const { value } = action.payload;

    //   return {
    //     ...state,
    //     typeId: value,
    //   };
    // }
    case ON_ACCEPT: {
      const { orderFormInfo } = action.payload;

      return { ...state, ...orderFormInfo };
    }
    default:
      return state;
  }
};

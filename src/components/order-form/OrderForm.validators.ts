import { submitNewOrder } from "@/actions/order.actions";
import { commonOrderValidator } from "./OrderForm.helpers";

// export const selectedType = LIMIT_ORDER_TYPE;

// export const enableExchangeOrderTypes = [
//   {
//     title: getOrderTypeNameById(LIMIT_ORDER_TYPE), //TODO: i18n
//     to: LIMIT_ORDER_TYPE
//   },
//   {
//     title: getOrderTypeNameById(MARKET_ORDER_TYPE),
//     to: MARKET_ORDER_TYPE
//   },
//   {
//     title: 'Stop',
//     to: 'Stop',
//     dropdown: {
//       options: [{
//         label: getOrderTypeNameById(STOP_LIMIT_ORDER_TYPE),
//         value: STOP_LIMIT_ORDER_TYPE
//       }, {
//         label: getOrderTypeNameById(STOP_MARKET_ORDER_TYPE),
//         value: STOP_MARKET_ORDER_TYPE
//       }]
//     }
//   },
//   {
//     title: 'Others',
//     to: 'Others',
//     dropdown: {
//       options: [{
//         label: getOrderTypeNameById(OCO_ORDER_TYPE),
//         value: OCO_ORDER_TYPE
//       }, {
//         label: getOrderTypeNameById(FILL_OR_KILL),
//         value: FILL_OR_KILL
//       }, {
//         label: getOrderTypeNameById(IMMEDIATE_OR_CANCEL),
//         value: IMMEDIATE_OR_CANCEL
//       }]
//     }
//   }
// ];

export function orderValidationFn(
  {
    tradeOptions,
    lowestSellPrice,
    highestBuyPrice,
    side,
    stopPrice,
    price,
    amount,
    type,
    onError,
    executedLongCash,
    executedLongPosition,
    leverage,
  },
  props
) {
  // console.log(
  //   "{lowestSellPrice, highestBuyPrice, side, stopPrice, price, amount, type, onError},",
  //   {
  //     lowestSellPrice,
  //     highestBuyPrice,
  //     side,
  //     stopPrice,
  //     price,
  //     amount,
  //     type,
  //     onError,
  //   }
  // );

  return commonOrderValidator({
    tradeOptions,
    type,
    tickerPrice: props.tickerPrice,
    lowestSellPrice,
    highestBuyPrice,
    pair: props.pair,
    side,
    price,
    amount,
    balances: props.balances,
    wallet: props.wallet,
    stopPrice,
    asks: props.asks,
    bids: props.bids,
    onError,
    executedLongCash,
    executedLongPosition,
    leverage,
    onSucces: ({ side, pair }) => {
      // if (side === 1) {
      //   trackBuyOrder(pair);
      // } else {
      //   trackSellOrder(pair);
      // }
    },
  });
}

export function submitOrderFn(
  {
    tradeOptions,
    clientOrderId,
    tif,
    type,
    side,
    price,
    amount,
    stopPrice,
    dispatch,
    stopLoss,
    takeProfit,
    displaySize,
    refreshSize,
    priceIncrement,
    sizeIncrement,
    offset,
    selectedLayer,
    secondLegPrice,
    limitCross,
    putCall,
    strikePrice,
    ...state
  },
  props
) {
  dispatch(
    submitNewOrder({
      tradeOptions,
      clientOrderId,
      type,
      side,
      price,
      amount,
      stopPrice,
      tif,
      sessionId: props.sessionId,
      accountId: props.accountId,
      pair: props.pair,
      stopLoss,
      takeProfit,
      displaySize,
      refreshSize,
      priceIncrement,
      sizeIncrement,
      offset,
      layers: selectedLayer,
      secondLegPrice: secondLegPrice,
      limitCross,
      putCall,
      strikePrice,
    })
  );
}

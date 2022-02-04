export const ON_PRICE_CHANGE = "@orderform/ON_PRICE_CHANGE";
export const ON_STOP_PRICE_CHANGE = "@orderform/ON_STOP_PRICE_CHANGE";
export const ON_AMOUNT_CHANGE = "@orderform/ON_AMOUNT_CHANGE";
export const ON_TOTAL_CHANGE = "@orderform/ON_TOTAL_CHANGE";
export const ON_ORDER_TYPE_CHANGE = "@orderform/ON_ORDER_TYPE_CHANGE";
export const ON_ACCEPT = "@orderform/ON_ACCEPT";

export function onPriceChange({ price, persist = false }) {
  return {
    type: ON_PRICE_CHANGE,
    payload: { price, persist },
  };
}

export function onStopPriceChange({ price, persist = false }) {
  return {
    type: ON_STOP_PRICE_CHANGE,
    payload: { price, persist },
  };
}

export function onAmountChange({ amount, persist = false }) {
  return {
    type: ON_AMOUNT_CHANGE,
    payload: { amount, persist },
  };
}

export function onTotalChange({ total, persist = false }) {
  return {
    type: ON_TOTAL_CHANGE,
    payload: { total, persist },
  };
}

export function onOrderTypeChange({ value, persist = false }) {
  return {
    type: ON_ORDER_TYPE_CHANGE,
    payload: {
      value,
      persist,
    },
  };
}

export function onAccept({ orderFormInfo, persist = false }) {
  return {
    type: ON_ACCEPT,
    payload: {
      orderFormInfo,
      persist,
    },
  };
}

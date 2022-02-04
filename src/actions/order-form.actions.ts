export const ON_PRICE_CHANGE = "@orderform/ON_PRICE_CHANGE";

export function onPriceChange({ price, persist = false }) {
  return {
    type: ON_PRICE_CHANGE,
    payload: { price, persist },
  };
}

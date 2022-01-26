import {
  ORDER_CREATE_NEW_ORDER_ENTRY,
  ORDER_NEW_ACCEPTED,
  ORDER_REJECTED,
  ORDER_UPDATED,
  ORDER_UPDATED_LOCAL,
  ORDER_UPDATE_ORDER_ENTRY,
} from "@/actions/order.actions";
import { MessageType, OrderSide, OrderType } from "@/constants/system-enums";
import { USER_STORAGE_KEY } from "@/constants/storage-keys";
import { EMPTY_ARRAY, EMPTY_OBJ, formatNumber, strTemplate } from "@/exports";
import { getLabelOrderSide, getLabelOrderType } from "@/exports/order.utils";
import {
  firstInPair,
  getAmountDecimals,
  getPriceDecimals,
  getSymbolNameBySymbolEnum,
} from "@/exports/ticker.utils";
import Storage from "@/internals/Storage";
import { OrderEntry, OrderItem, Symbols } from "@/models/order.model";
import _set from "lodash/set";
import _unset from "lodash/unset";
import _get from "lodash/get";
import { isStopOrder } from "@/components/order-form/OrderForm.helpers";

// guest user is used for admin/risk authorizaton
export const GUEST_USER = "guest@user.id";

const originalState = {
  orders: EMPTY_OBJ,
  updatedOrder: EMPTY_OBJ,
  placedOrders: EMPTY_ARRAY,
  orderEntries: EMPTY_ARRAY,
};

const initialState = Object.assign(
  {},
  originalState,
  Storage.get(USER_STORAGE_KEY)
);

export const orderReducer = (state = initialState, action) => {
  switch (action.type) {
    case ORDER_NEW_ACCEPTED: {
      const newOrder = action.payload as OrderItem;

      const orders = _set(
        { ...state.orders },
        [newOrder.clientOrderId],
        newOrder
      );

      const pair = getSymbolNameBySymbolEnum(newOrder.symbolEnum);
      const str =
        "<orderType> <orderSide> of <amount> contracts of <symbol> at <price>.";
      const amountDecimals = getAmountDecimals(pair);
      const priceDecimals = getPriceDecimals(pair);

      const price = isStopOrder(newOrder.orderType)
        ? newOrder.stopPrice
        : newOrder.price;

      return {
        ...state,
        orders,
        updatedOrder: {
          id: `Accepted:${newOrder.clientOrderId}`,
          message: strTemplate(str, {
            orderType: getLabelOrderType(newOrder.orderType),
            orderSide: getLabelOrderSide(newOrder.side),
            amount: formatNumber({
              number: newOrder.qty,
              decimals: amountDecimals,
            }),
            orderId: newOrder.clientOrderId,
            symbol: firstInPair(pair),
            price: formatNumber({ number: price, decimals: priceDecimals }),
          }),
        },
      };
    }
    case ORDER_UPDATED: {
      const { msgType, newOrder } = action.payload as {
        msgType: MessageType;
        newOrder: OrderItem;
      };

      const pair = getSymbolNameBySymbolEnum(newOrder.symbolEnum);
      const amountDecimals = getAmountDecimals(pair);
      const priceDecimals = getPriceDecimals(pair);
      // console.log('>>> getting new order', newOrder, 'current orders', { ...state.orders });
      switch (msgType) {
        case MessageType.CANCELLED: {
          if (!newOrder.clientOrderId) return state;

          const ordersCpy = { ...state.orders };
          // push to history
          const placedOrders = [
            _get(ordersCpy, [newOrder.orderId || newOrder.clientOrderId]),
            ...state.placedOrders,
          ];
          _unset(ordersCpy, [newOrder.orderId || newOrder.clientOrderId]);
          // console.log('>>> last ordersCpy', ordersCpy);
          const price = isStopOrder(newOrder.orderType)
            ? newOrder.stopPrice
            : newOrder.price;

          const message = `Cancelled <orderType> <orderSide> of <amount> contracts of <symbol> at <price>.`;

          return {
            ...state,
            orders: ordersCpy,
            // push to history
            placedOrders,
            updatedOrder: {
              id: `Accepted:${newOrder.clientOrderId}`,
              message: strTemplate(message, {
                orderType: getLabelOrderType(newOrder.orderType),
                orderSide: getLabelOrderSide(newOrder.side),
                orderId: newOrder.clientOrderId,
                symbol: firstInPair(pair),
                amount: formatNumber({
                  number: newOrder.qty,
                  decimals: amountDecimals,
                }),
                price: formatNumber({ number: price, decimals: priceDecimals }),
              }),
            },
          };
        }
        case MessageType.EXECUTION: {
          if (!newOrder.clientOrderId) return state;

          const ordersCpy = { ...state.orders };

          // push to history
          const placedOrders = [
            _get(ordersCpy, [newOrder.clientOrderId]),
            ...state.placedOrders,
          ];
          // remove from open order
          _unset(ordersCpy, [newOrder.clientOrderId]);

          const message = `Filled <orderType> <orderSide> of <amount> contracts of <symbol> at <price>.`;

          return {
            ...state,
            orders: ordersCpy,
            placedOrders,
            updatedOrder: {
              id: `Accepted:${newOrder.clientOrderId}`,
              message: strTemplate(message, {
                orderType: getLabelOrderType(newOrder.orderType),
                orderSide: getLabelOrderSide(newOrder.side),
                orderId: newOrder.clientOrderId,
                symbol: firstInPair(pair),
                amount: formatNumber({
                  number: newOrder.execShares,
                  decimals: amountDecimals,
                }),
                price: formatNumber({
                  number: newOrder.price,
                  decimals: priceDecimals,
                }),
              }),
            },
          };
        }
        case MessageType.EXECUTION_PARTIAL: {
          console.log("EXECUTION_PARTIAL", newOrder);

          if (!newOrder.clientOrderId) return state;

          // push to history
          const placedOrders = [
            _get(state.orders, [newOrder.clientOrderId]),
            ...state.placedOrders,
          ];

          const orders = _set(
            { ...state.orders },
            [newOrder.clientOrderId],
            newOrder
          );

          return {
            ...state,
            placedOrders,
            orders,
          };
        }
        case MessageType.REPLACED: {
          if (!newOrder.orderId) return state;

          const ordersCpy = { ...state.orders };
          _unset(ordersCpy, [newOrder.orderId]);
          const orders = _set(ordersCpy, [newOrder.clientOrderId], newOrder);

          const message = `Replaced <orderType> <orderSide> of <amount> contracts of <symbol> at <price>.`;

          return {
            ...state,
            orders: orders,
            updatedOrder: {
              id: `Accepted:${newOrder.orderId}`,
              message: strTemplate(message, {
                orderType: getLabelOrderType(newOrder.orderType),
                orderSide: getLabelOrderSide(newOrder.side),
                orderId: newOrder.orderId,
                symbol: "BTC",
                amount: formatNumber({
                  number: newOrder.qty,
                  decimals: amountDecimals,
                }),
                price: formatNumber({
                  number: newOrder.price,
                  decimals: priceDecimals,
                }),
              }),
            },
          };
        }
        case MessageType.QUOTE_FILL:
        case MessageType.QUOTE_FILL_PARTIAL: {
          // push to history
          const placedOrders = [newOrder, ...state.placedOrders];

          return {
            ...state,
            placedOrders,
          };
        }
        case MessageType.ORDER_NEW: {
          const orders = _set(
            { ...state.orders },
            [newOrder.clientOrderId],
            newOrder
          );

          return {
            ...state,
            orders,
          };
        }
        default: {
          return state;
        }
      }
    }
    // use for updating an order locally
    case ORDER_UPDATED_LOCAL: {
      return state;
    }
    case ORDER_REJECTED: {
      const { errorCode } = action.payload;

      const message = "Getting an errorCode: <errorCode>";
      return {
        ...state,
        updatedOrder: {
          id: `Rejected:${errorCode}-${Date.now()}`,
          message: strTemplate(message, {
            errorCode: errorCode,
          }),
        },
      };
    }
    case ORDER_CREATE_NEW_ORDER_ENTRY: {
      const { orderEntries } = state;
      orderEntries.push({
        formId: new Date().getTime(),
        symbol: Symbols.OPTION,
        expiryDate: new Date(),
      });
      return {
        ...state,
        orderEntries,
      };
    }
    case ORDER_UPDATE_ORDER_ENTRY: {
      const { orderEntries } = state;
      const { formId, symbol, expiryDate } = action.payload as OrderEntry;
      const entry = orderEntries.find((e) => e.formId === formId);
      if (entry) {
        entry.symbol = symbol;
        entry.expiryDate = expiryDate;
      }

      return {
        ...state,
        orderEntries: [
          ...orderEntries.filter((e) => e.formId !== formId),
          entry,
        ],
      };
    }
    default:
      return state;
  }
};

import {
  ORDER_CREATE_NEW_ORDER_ENTRY,
  ORDER_NEW_ACCEPTED,
  ORDER_UPDATED,
  ORDER_UPDATE_ORDER_ENTRY,
} from "@/actions/order.actions";
import { MessageType } from "@/constants/order-enums";
import { USER_STORAGE_KEY } from "@/constants/storage-keys";
import { EMPTY_OBJ, formatNumber, strTemplate } from "@/exports";
import { getLabelOrderSide, getLabelOrderType } from "@/exports/order.utils";
import { getAmountDecimals, getPriceDecimals } from "@/exports/ticker.utils";
import Storage from "@/internals/Storage";
import { OrderEntry, OrderItem, Symbols } from "@/models/order.model";
import _set from "lodash/set";
import _unset from "lodash/unset";

// guest user is used for admin/risk authorizaton
export const GUEST_USER = "guest@user.id";

const originalState = {
  orders: EMPTY_OBJ,
  updatedOrder: EMPTY_OBJ,
  orderEntries: [],
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

      const orders = _set({ ...state.orders }, [newOrder.orderId], newOrder);
      const str =
        "<orderType> <orderSide> of <amount> contracts of <symbol> at <price>.";
      const amountDecimals = getAmountDecimals("BTCUSDT");
      const priceDecimals = getPriceDecimals("BTCUSDT");

      return {
        ...state,
        orders,
        updatedOrder: {
          id: `Accepted:${newOrder.orderId}`,
          message: strTemplate(str, {
            orderType: getLabelOrderType(newOrder.orderType),
            orderSide: getLabelOrderSide(newOrder.side),
            amount: formatNumber({
              number: newOrder.qty,
              decimals: amountDecimals,
            }),
            orderId: newOrder.orderId,
            symbol: "BTC",
            price: formatNumber({
              number: newOrder.price,
              decimals: priceDecimals,
            }),
          }),
        },
      };
    }
    case ORDER_UPDATED: {
      const { msgType, newOrder } = action.payload as {
        msgType: MessageType;
        newOrder: OrderItem;
      };

      const amountDecimals = getAmountDecimals("BTCUSDT");
      const priceDecimals = getPriceDecimals("BTCUSDT");

      switch (msgType) {
        case MessageType.CANCELLED:
        case MessageType.EXECUTION: {
          if (!newOrder.orderId) return state;

          const ordersCpy = { ...state.orders };
          _unset(ordersCpy, [newOrder.orderId]);

          const message = `${
            msgType === MessageType.CANCELLED ? "Cancelled" : "Filled"
          } <orderType> <orderSide> of <amount> contracts of <symbol> at <price>.`;
          const qty =
            msgType === MessageType.CANCELLED
              ? newOrder.qty
              : newOrder.execShares;
          console.log("new Order");
          return {
            ...state,
            orders: ordersCpy,
            updatedOrder: {
              id: `Accepted:${newOrder.orderId}`,
              message: strTemplate(message, {
                orderType: getLabelOrderType(newOrder.orderType),
                orderSide: getLabelOrderSide(newOrder.side),
                orderId: newOrder.orderId,
                symbol: "BTC",
                amount: formatNumber({ number: qty, decimals: amountDecimals }),
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

          if (!newOrder.orderId) return state;

          const orders = _set(
            { ...state.orders },
            [newOrder.orderId],
            newOrder
          );

          return {
            ...state,
            orders,
          };
        }
        case MessageType.ORDER_NEW: {
          console.log("ORDER_NEW", newOrder);
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

import {
  OrderBookDepthLimitEnum,
  SubscribeType,
  SubscribeUnsubscribe,
} from "@/constants/order-book-enums";
import { SymbolValue } from "@/constants/symbol-enums";
import { WebSocketKindEnum } from "@/constants/websocket.enums";
import { getSymbolId } from "@/exports/ticker.utils";
import { BookData } from "@/models/book.model";
import { SubscribeManner } from "@/packets/subscribe.packet";
import { convertToBookData } from "@/transformers/book.transformer";
import { sendWsData } from "./ws.actions";

export const BOOK_INIT = "@book/INIT";
export const BOOK_INITIALIZED = "@book/INITIALIZED";
export const BOOK_RECEIVED_UPDATE = "@book/RECEIVED_UPDATE";

export function initBook({ symbol, limit = OrderBookDepthLimitEnum.LVL3 }) {
  return {
    type: BOOK_INIT,
    payload: { symbol, limit },
  };
}

interface SubscribeMDParams {
  symbol: string;
  limit: OrderBookDepthLimitEnum;
}

export function subscribeMarketData({
  symbol,
  limit = OrderBookDepthLimitEnum.LVL3,
}: SubscribeMDParams) {
  console.log("[book.actions] submitting a MDSubscribe message ...", {
    symbol,
    limit,
  });

  const symbolEnum = getSymbolId(symbol) || SymbolValue.BTC;

  const ACCOUNT_ID = 90001;
  // const USER_NAME = "MTX01";
  const SESSION_ID = 901;

  const params = {
    subscribeUnsubscribe: SubscribeUnsubscribe.SUBSCRIBE,
    symbolEnum: symbolEnum,
    subscribeType: SubscribeType.THREELAYERS,
    account: ACCOUNT_ID,
    sessionId: SESSION_ID,
    sendingTime: Date.now(),
  };
  const msg = SubscribeManner.send(params);

  console.log(
    "[order.actions] subscribe message is built",
    SubscribeManner.read(msg)
  );

  return sendWsData(WebSocketKindEnum.ORDERS, msg);
}

interface BookInitializedParams {
  bids: BookData;
  asks: BookData;
  lastUpdateId: number;
}

export function bookInitialized({
  bids,
  asks,
  lastUpdateId,
}: BookInitializedParams) {
  return {
    type: BOOK_INITIALIZED,
    payload: { bids, asks, lastUpdateId },
  };
}

// {
//   "lastUpdateId": 1027024,
//   "bids": [
//     [
//       "4.00000000",     // PRICE
//       "431.00000000"    // QTY
//     ]
//   ],
//   "asks": [
//     [
//       "4.00000200",
//       "12.00000000"
//     ]
//   ]
// }
export function bookUpdate({ bids, asks, lastUpdateId }) {
  return {
    type: BOOK_RECEIVED_UPDATE,
    payload: {
      asks: convertToBookData(asks),
      bids: convertToBookData(bids),
      lastUpdateId,
    },
  };
}

export function bookUpdate2({ bids, asks, lastUpdateId }) {
  return {
    type: BOOK_RECEIVED_UPDATE,
    payload: {
      asks,
      bids,
      lastUpdateId,
    },
  };
}

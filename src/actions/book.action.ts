import { OrderBookDepthLimitEnum } from "@/constants/order-book-enums";
import { SymbolValue } from "@/constants/symbol-enums";
import { OrderSide } from "@/constants/system-enums";
import { BookData, OrderBookStruct } from "@/models/book.model";

export const BOOK_INIT = "@book/INIT";
export const BOOK_INITIALIZED = "@book/INITIALIZED";
export const BOOK_RECEIVED_UPDATE = "@book/RECEIVED_UPDATE";

export function initBook({ symbol, limit = OrderBookDepthLimitEnum.LVL3 }) {
  return {
    type: BOOK_INIT,
    payload: { symbol, limit },
  };
}

interface MDInfoReqParams {
  symbol: string;
}

/**
 * The market data is going to be run on channels,
 * so you will need to send a message to the admin server
 * and it will tell you the IP and port of the market data server
 * to connect to to get that data.
 */
export function sendMDInfoReq({ symbol }: MDInfoReqParams) {
  console.log("[book.actions] sending a MDInfoReq message ...", {
    symbol,
  });

  // const symbolEnum = getSymbolId(symbol) || SymbolValue.BTC;

  // const ACCOUNT_ID = 90001;
  // // const USER_NAME = "MTX01";
  // const SESSION_ID = 901;

  // const params = {
  //   symbolEnum: symbolEnum,
  //   protocolType: ProtocolType.WS_BINARY,
  //   bookType: BookType.LBS,
  //   account: ACCOUNT_ID,
  //   sessionId: SESSION_ID,
  //   sendingTime: Date.now(),
  // };
  // const msg = MdInfoReqManner.send(params);

  // console.log(
  //   "[book.actions] MDInfoReq message is built",
  //   MdInfoReqManner.read(msg)
  // );

  // return sendWsData(WebSocketKindEnum.ADMIN_RISK, msg);
}

interface SubscribeMDParams {
  symbol: string;
  limit?: OrderBookDepthLimitEnum;
}

export function subscribeMarketData({
  symbol,
  limit = OrderBookDepthLimitEnum.LVL3,
}: SubscribeMDParams) {
  console.log("[book.actions] submitting a MDSubscribe message ...", {
    symbol,
    limit,
  });

  // const symbolEnum = getSymbolId(symbol) || SymbolValue.BTC;

  // const ACCOUNT_ID = 90001;
  // // const USER_NAME = "MTX01";
  // const SESSION_ID = 901;

  // const params = {
  //   subscribeUnsubscribe: SubscribeUnsubscribe.SUBSCRIBE,
  //   symbolEnum: symbolEnum,
  //   subscribeType: SubscribeType.THREELAYERS,
  //   account: ACCOUNT_ID,
  //   sessionId: SESSION_ID,
  //   sendingTime: Date.now(),
  // };
  // const msg = SubscribeManner.send(params);

  // console.log(
  //   "[book.actions] subscribe message is built",
  //   SubscribeManner.read(msg)
  // );

  // return sendWsData(WebSocketKindEnum.ORDERS, msg);
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

type BookUpdateParams = {
  data: OrderBookStruct[];
  side: OrderSide;
  lastUpdateId: number;
};
export function bookUpdate({ data, side, lastUpdateId }: BookUpdateParams) {
  return {
    type: BOOK_RECEIVED_UPDATE,
    payload: {
      data: [],
      // bids: convertToBookData(bids),
      lastUpdateId,
    },
  };
}

// outdated, used in the worker
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

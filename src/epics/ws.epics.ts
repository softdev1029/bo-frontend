import {
  switchMap,
  filter,
  map,
  tap,
  ignoreElements,
  take,
  withLatestFrom,
  delay,
} from "rxjs/operators";
import { concat, EMPTY, of } from "rxjs";
import { ActionsObservable, ofType } from "redux-observable";
import {
  sendWsData,
  wsAuthenticated,
  WS_ON_MESSAGE,
} from "@/actions/ws.actions";
import { ORDER_NEW_ACCEPTED } from "@/actions/order.actions";
import {
  PacketHeaderMessageType,
  WebSocketKindEnum,
} from "@/constants/websocket.enums";
import { tickerUpdate, updateInstrument } from "@/actions/ticker.actions";
import { tradeUpdate2 } from "@/actions/trade.actions";
import {
  bookUpdate,
  bookUpdate2,
  subscribeMarketData,
} from "@/actions/book.action";
import {
  ChartSnapshotSubject,
  ChartUpdateSubject,
  TradeUpdateSubject,
} from "@/components/chart";
import { PacketReader, SingletonWSManager } from "@/internals";
import { updateSocketUrlEntries } from "@/actions/app.actions";
import { initWSStream } from "@/exports/streams/socket/create-socket-stream";
import {
  wsOnMessageObservable$,
  wsOnMessageSrc$,
} from "@/exports/streams/socket/on-message.subject";
import { fromWorker } from "@/exports/streams/rx-worker";
//@ts-ignore
import TestWorker from "@/internals/workers/file.worker.js";
import { ClientLoginManner } from "@/packets/client-login.packet";
import { TransactionManner } from "@/packets/transaction.packet";
import {
  newOrderAccepted,
  orderUpdated,
  ORDER_REJECTED,
} from "@/actions/order.actions";
import { RiskSymbolManner } from "@/packets/user-risk.packet";
import { updateUserInfo } from "@/actions/auth.actions";
import {
  InstrumentManner,
  InstrumentResponseType,
} from "@/packets/instrument.packet";
import {
  getPairBySymbolEnum,
  initTickerInfo as initInstrumentUtils,
} from "@/exports/ticker.utils";
import { InstrumentModel } from "@/models/instrument.model";
import {
  REQUEST_INIT_COLLATERAL,
  REQUEST_UPDATE_COLLATERAL,
} from "@/actions/collateral.actions";
import {
  CollateralRequestManner,
  CollateralUpdateRequestManner,
} from "@/packets/collateral.packet";
import {
  getAccountId,
  getSessionId,
  getUsername,
} from "@/selectors/auth.selectors";
import _pick from "lodash/pick";
import _chunk from "lodash/chunk";
import { MessageType, MessageUpdateType } from "@/constants/system-enums";
import config from "@/config/config";
import { BookManner } from "@/packets/book.packet";
import { TradesManner, TRADE_MESSAGE_LENGTH } from "@/packets/trades.packet";
import { BarManner, BarSnapshotManner } from "@/packets/chart.packet";
import { MdInfoResManner } from "@/packets/md-info-res.packet";
import { SubscribeManner } from "@/packets/subscribe.packet";
import { MdInfoReqManner } from "@/packets/md-info-req.packet";

export const wsOnAdminRiskMessageEpic = (action$: ActionsObservable<any>) =>
  action$.pipe(
    ofType(WS_ON_MESSAGE),
    filter((action) => SingletonWSManager.isRiskAdminWsById(action._id)),
    switchMap((action) => {
      const data = action.payload;
      const wsId = action._id;

      const reader = new PacketReader(data);
      const msgType = reader.getMessageType();
      console.log("[wsOnAdminRiskMessageEpic] msgType", msgType);

      switch (msgType) {
        case PacketHeaderMessageType.CLIENT_LOGIN: {
          const serverInfo = ClientLoginManner.read(data);
          console.log(
            "%c [wsOnAdminRiskMessageEpic] Received Logon reply via AES ( Step 2 )",
            "color: green",
            serverInfo
          );

          if (
            serverInfo.orderEntryIp1 &&
            serverInfo.orderEntryIp1.replace(/\s/g, "").length
          ) {
            // SingletonWSManager.addWs(`${config.protocol}://${serverInfo.orderEntryIp1}`, WebSocketKindEnum.ORDERS);
            SingletonWSManager.addWs(
              `${config.protocol}://oes-dev.bit24.com`,
              WebSocketKindEnum.ORDERS
            );
          } else {
            SingletonWSManager.addWs(
              `ws://localhost:8081`,
              WebSocketKindEnum.ORDERS
            );
          }

          // if (
          //   serverInfo.marketEntryIp1 &&
          //   serverInfo.marketEntryIp1.replace(/\s/g, "").length
          // ) {
          //   SingletonWSManager.addWs(
          //     `${config.protocol}://${serverInfo.marketEntryIp1}`,
          //     WebSocketKindEnum.MARKET
          //   );
          //   // SingletonWSManager.addWs(`ws://113.197.36.50:32028/`, WebSocketKindEnum.MARKET);
          // } else {
          //   SingletonWSManager.addWs(
          //     `ws://localhost:8082`,
          //     WebSocketKindEnum.MARKET
          //   );
          // }

          const saveEntries = SingletonWSManager.getUrlEntries();
          SingletonWSManager.acceptEntries();

          return of(
            updateSocketUrlEntries(saveEntries),
            wsAuthenticated(wsId),
            updateUserInfo({
              sessionId: serverInfo.sessionId,
              accountId: serverInfo.accountId,
            })
          );
        }

        case PacketHeaderMessageType.MD_INFO_REQ: {
          const serverInfo = MdInfoReqManner.read(data);
          console.log(
            "%c [MdInfoReqManner] Received MdInfoReq via AES ( Step 4 )",
            "color: green",
            serverInfo,
            wsId
          );

          let mdsUrl = `${config.protocol}://localhost:8082`;
          if (
            serverInfo.marketEntryIp1 &&
            serverInfo.marketEntryIp1.replace(/\s/g, "").length
          ) {
            mdsUrl = `${config.protocol}://${serverInfo.marketEntryIp1}`;
          }

          // T63-1, if a new MDS url is already used in a running MDS socket,
          // we don't need to re-open it again
          if (!SingletonWSManager.isMarketWsByUrl(mdsUrl)) {
            SingletonWSManager.addWs(mdsUrl, WebSocketKindEnum.MARKET);

            const saveEntries = SingletonWSManager.getUrlEntries();

            return of(updateSocketUrlEntries(saveEntries));
          } else {
            return EMPTY;
          }
        }
        case PacketHeaderMessageType.MD_INFO_RES: {
          const serverInfo = MdInfoResManner.read(data);
          console.log(
            "[ws.epcis] Received MdInfoRes via AES ( Step 4 )",
            serverInfo
          );

          const symbol = serverInfo.symbolEnum;

          if (serverInfo.mdPrimary.replace(/\s/g, "").length) {
            SingletonWSManager.addWs(
              `ws://${serverInfo.mdPrimary}`,
              WebSocketKindEnum.MARKET
            );
          } else {
            SingletonWSManager.addWs(
              `ws://localhost:8082`,
              WebSocketKindEnum.MARKET
            );
          }

          if (serverInfo.mdSecondary.replace(/\s/g, "").length) {
            SingletonWSManager.addWs(
              `ws://${serverInfo.mdSecondary}`,
              WebSocketKindEnum.MARKET
            );
          }

          const saveEntries = SingletonWSManager.getUrlEntries();

          SingletonWSManager.acceptEntries();

          return of(
            updateSocketUrlEntries(saveEntries),
            subscribeMarketData({ symbol: "BTCUSDT" })
          );
          break;
        }
        // risk symbol returns automatically after logon
        case PacketHeaderMessageType.RISK_USER_SYMBOL: {
          const userSymbols = RiskSymbolManner.read(data);
          console.log("RiskSymbolManner.read(data);", userSymbols);

          return of(updateUserInfo(userSymbols));
        }
        case PacketHeaderMessageType.TRANSACTION: {
          const orderRaw = TransactionManner.read(data);
          const { rejectReason, ...order } = orderRaw;
          const { orderMessageType } = orderRaw;
          console.warn(
            "[TRANSACTION]",
            orderRaw,
            "ordermessageType",
            orderMessageType
          );

          if (rejectReason) {
            console.error("order rejected >>>>", rejectReason);
            return of({
              type: ORDER_REJECTED,
              payload: { errorCode: rejectReason, id: order.clientOrderId },
            });
          }

          if (orderMessageType === MessageType.ORDER_ACK) {
            return of(newOrderAccepted(order));
          } else {
            return of(orderUpdated(orderMessageType, order));
          }
        }
        case PacketHeaderMessageType.INSTRUMENT: {
          const instrumentReader = InstrumentManner.read(data);

          const responseType = instrumentReader.responseType;
          const instrument: InstrumentModel = _pick(instrumentReader, [
            "minSize",
            "maxSize",
            "symbolType",
            "priceIncrement",
            "symbolEnum",
            "symbolName",
          ]);

          // update instrument info
          const tickerConfig = initInstrumentUtils(instrument);

          return of(
            updateInstrument(
              tickerConfig,
              responseType === InstrumentResponseType.SNAPSHOT_FINISH
            )
          );
        }
        case PacketHeaderMessageType.COLLATERAL: {
          const collateralReader = CollateralRequestManner.read(data);

          console.log("COLLATERAL", collateralReader);
          return EMPTY;
        }
        default: {
          return EMPTY;
        }
      }
      return EMPTY;
      // wsOnMessageSrc$.next(data);
    })
  );

export const wsOnOrderMessageEpic = (action$: ActionsObservable<any>, state$) =>
  action$.pipe(
    ofType(WS_ON_MESSAGE),
    filter((action) => SingletonWSManager.isOrderWsById(action._id)),
    // bufferTime(200),
    // filter(batch => batch.length > 0),
    // take(2),
    switchMap((action) => {
      const data = action.payload;
      const wsId = action._id;
      const reader = new PacketReader(data);
      const msgType = reader.getMessageType();
      console.log("[wsOnOrderMessageEpic] msgType", msgType);

      switch (msgType) {
        case PacketHeaderMessageType.CLIENT_LOGIN: {
          const serverInfo = ClientLoginManner.read(data);
          console.log(
            "ClientLoginManner.read(data);",
            ClientLoginManner.read(data)
          );

          return of(
            wsAuthenticated(wsId),
            updateUserInfo({
              sessionId: serverInfo.sessionId,
              accountId: serverInfo.accountId,
            })
          );
        }
        // risk symbol returns automatically after logon
        case PacketHeaderMessageType.RISK_USER_SYMBOL: {
          const userSymbols = RiskSymbolManner.read(data);
          console.log("RiskSymbolManner.read(data);", userSymbols);

          return of(updateUserInfo(userSymbols));
        }
        case PacketHeaderMessageType.TRANSACTION: {
          const orderRaw = TransactionManner.read(data);

          orderRaw.isTimeout = false;

          const { rejectReason, ...order } = orderRaw;
          const { orderMessageType } = orderRaw;

          console.warn("[TRANSACTION]", orderRaw, "ordermessageType", order);

          if (rejectReason) {
            console.error("order rejected >>>>", rejectReason);
            return of({
              type: ORDER_REJECTED,
              payload: { errorCode: rejectReason, id: order.clientOrderId },
            });
          }

          if (
            orderMessageType === MessageType.ORDER_ACK ||
            orderMessageType === MessageType.ORDER_NEW
          ) {
            const timeoutOrder = { ...order };
            timeoutOrder.isTimeout = true;

            return concat(
              of(newOrderAccepted(order)),
              of(orderUpdated(orderMessageType, timeoutOrder)).pipe(delay(3000))
            );
          } else {
            return of(orderUpdated(orderMessageType, order));
          }
        }
        case PacketHeaderMessageType.INSTRUMENT: {
          const instrumentReader = InstrumentManner.read(data);

          const responseType = instrumentReader.responseType;
          const instrument: InstrumentModel = _pick(instrumentReader, [
            "minSize",
            "maxSize",
            "symbolType",
            "priceIncrement",
            "symbolEnum",
            "symbolName",
          ]);

          // update instrument info
          const tickerConfig = initInstrumentUtils(instrument);

          return of(
            updateInstrument(
              tickerConfig,
              responseType === InstrumentResponseType.SNAPSHOT_FINISH
            )
          );
        }
        case PacketHeaderMessageType.COLLATERAL: {
          const collateralReader = CollateralRequestManner.read(data);

          console.log("COLLATERAL", collateralReader);
          return EMPTY;
        }
        default: {
          return EMPTY;
        }
      }
    })
  );

let barSnapshotMessagesCache = [];

export const wsOnMarketMessageEpic = (
  action$: ActionsObservable<any>,
  state$
) =>
  action$.pipe(
    ofType(WS_ON_MESSAGE),
    filter((action) => SingletonWSManager.isMarketWsById(action._id)),
    switchMap((action) => {
      const data = action.payload;
      const wsId = action._id;

      const reader = new PacketReader(data);
      const msgType = reader.getMessageType();
      // console.log('[wsOnMarketMessageEpic epic] >>>> msgType', msgType);

      switch (msgType) {
        case PacketHeaderMessageType.CLIENT_LOGIN: {
          const serverInfo = ClientLoginManner.read(data);

          console.log(
            "%c [wsOnMarketMessageEpic] Received Logon reply via MDS ( Step 6 )",
            "color: green",
            ClientLoginManner.read(data),
            "socketid",
            wsId
          );

          return of(wsAuthenticated(wsId));
        }
        case PacketHeaderMessageType.SUBSCRIBE: {
          console.log(
            "%c [wsOnMarketMessageEpic] Subscribe",
            "color: green",
            SubscribeManner.read(data)
          );

          return of();
        }
        // book, trades, chart returns automatically after logon
        case PacketHeaderMessageType.BOOK_30:
        case PacketHeaderMessageType.BOOK_20:
        case PacketHeaderMessageType.BOOK_10: {
          // wsOnMessageSrc$.next(data);
          const bookData = BookManner(msgType).read(data);
          const bids = {};
          const asks = {};
          bookData.orderbooks.forEach((book) => {
            if (book.volume) {
              if (book.side === "B") {
                bids[book.price] = book.volume;
              } else {
                asks[book.price] = book.volume;
              }
            }
          });

          return of(
            bookUpdate2({
              lastUpdateId: bookData.sendingTime,
              asks,
              bids,
            })
          );
        }
        case PacketHeaderMessageType.EXEC_REPORT: {
          const chunk: number[][] = _chunk<number>(
            data,
            TRADE_MESSAGE_LENGTH
          ).filter((array) => array.length === TRADE_MESSAGE_LENGTH); // make sure every array has the same length
          const trades = [];
          chunk.forEach((execBytes) => {
            const tradeData = TradesManner.read(execBytes);
            const trade = {
              id: tradeData.sendingTime,
              date: tradeData.sendingTime,
              price: tradeData.price,
              amount: tradeData.volume,
              side: tradeData.side,
            };

            const newBar = {
              price: tradeData.price,
              volume: tradeData.volume,
              // time: Number(tradeData.sendingTime) * 1000, //ms
              time: Date.now(),
              pair: getPairBySymbolEnum(tradeData.symbolEnum),
            };

            TradeUpdateSubject.next(newBar);
            trades.push(trade);
          });

          return of(tradeUpdate2(trades));
        }
        case PacketHeaderMessageType.BAR_SNAPSHOT: {
          const snapshotData = BarSnapshotManner.read(data);
          // console.log('snapshot', snapshotData);
          barSnapshotMessagesCache = [
            ...barSnapshotMessagesCache,
            ...snapshotData.chartBars,
          ];

          if (snapshotData.updateType === MessageUpdateType.SNAPSHOT_FINISH) {
            ChartSnapshotSubject.next({
              symbolEnum: snapshotData.symbolEnum,
              bars: [...barSnapshotMessagesCache],
              interval: barSnapshotMessagesCache[0]?.interval || null,
            });

            barSnapshotMessagesCache = [];
          }
          return EMPTY;
        }
        case PacketHeaderMessageType.BAR_MESSAGE: {
          const barData = BarManner.read(data);
          console.log("BAR_MESSAGE", barData);

          ChartUpdateSubject.next({
            interval: barData.interval,
            high: barData.high,
            low: barData.low,
            open: barData.open,
            time: barData.time,
            volume: barData.volume,
            close: barData.close,
            pair: getPairBySymbolEnum(barData.symbolEnum),
          });
          return EMPTY;
        }
        case PacketHeaderMessageType.BAR_REQUEST: {
          console.log("BAR_REQUEST");

          return EMPTY;
        }
        default: {
          return EMPTY;
        }
      }
    })
    // tap((data) => {
    //   wsOnMessageSrc$.next(data);
    // }),
    // ignoreElements()
  );

const worker$ = fromWorker(() => new TestWorker(), wsOnMessageObservable$);

export const onWebWorkerEpic = (action$, state$) =>
  worker$.pipe(
    // map((batch) => batch[0]),
    switchMap((data: any) => {
      const { bookPayload } = data;

      const streams = [
        // tickerUpdate(marketData),
        // tradeUpdate2(tradesData)
      ];
      if (bookPayload) {
        streams.push(bookUpdate2(bookPayload));
      }

      // charts.map(payload => ChartSubject.next(payload));

      return action$.pipe(
        take(1),
        switchMap(() => of(...streams))
      );
    })
    // ignoreElements()
  );

export const adminRisk = initWSStream(WebSocketKindEnum.ADMIN_RISK);
export const dataFeed = initWSStream(WebSocketKindEnum.MARKET, {
  isBinary: false,
});

export const collateralEpic = (action$: ActionsObservable<any>, state$) =>
  action$.pipe(
    ofType(REQUEST_INIT_COLLATERAL),
    filter((action) => SingletonWSManager.isOrderWsById(action._id)),
    withLatestFrom(state$),
    map(([action, state]) => {
      const collateralDataSender = CollateralRequestManner.send({
        symbolEnum: action.symbol || 0,
        accountId: getAccountId(state),
        sessionId: getSessionId(state),
        username: getUsername(state),
      });

      return sendWsData(WebSocketKindEnum.ORDERS, collateralDataSender);
    }),
    ignoreElements()
  );

export const collateralRequestEpic = (
  action$: ActionsObservable<any>,
  state$
) =>
  action$.pipe(
    ofType(REQUEST_UPDATE_COLLATERAL),
    filter((action) => SingletonWSManager.isOrderWsById(action._id)),
    withLatestFrom(state$),
    map(([action, state]) => {
      const collateralDataSender = CollateralUpdateRequestManner.send({
        symbolEnum: action.symbol || 0,
        accountId: getAccountId(state),
        sessionId: getSessionId(state),
      });

      return sendWsData(WebSocketKindEnum.ORDERS, collateralDataSender);
    }),
    ignoreElements()
  );

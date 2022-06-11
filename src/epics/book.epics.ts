import {
  bookInitialized,
  BOOK_INIT,
  optionsBookInitialized,
} from "@/actions/book.action";
import { makeRequest } from "@/exports";
import { CallPutOption } from "@/models/order.model";
import { convertToBookData, toRawBook } from "@/transformers/book.transformer";
import { ActionsObservable, ofType, StateObservable } from "redux-observable";
import { distinctUntilChanged, filter, map, switchMap } from "rxjs/operators";

export const initBookEpic = (
  action$: ActionsObservable<any>,
  state$: StateObservable<any>
) =>
  action$.pipe(
    ofType(BOOK_INIT),
    map((action) => action.payload),
    distinctUntilChanged(
      (prevPayload, payload) =>
        payload.symbol === prevPayload.symbol &&
        payload.limit === prevPayload.limit
    ),
    switchMap((payload) => makeRequest("depth", { params: payload })), // payload: {symbol, limit}
    filter(({ error }) => !error),
    map((data) => {
      const { lastUpdateId, asks, bids } = data;
      const b = [
        {
          price: 28045.5,
          size: 4.5,
          expiryDate: "2022-07-01",
          callPut: CallPutOption.PUT,
        },
        {
          price: 28145.5,
          size: 1.5,
          expiryDate: "2022-07-01",
          callPut: CallPutOption.CALL,
        },
      ];

      const a = [
        {
          price: 28901.0,
          size: 12.1,
          expiryDate: "2022-07-01",
          callPut: CallPutOption.PUT,
        },
      ];

      return optionsBookInitialized({
        // asks: convertToBookData(asks),
        // bids: convertToBookData(bids),
        asks: a,
        bids: b,
        lastUpdateId,
      });
    })
  );

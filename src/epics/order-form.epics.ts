import { saveToStorage } from "@/actions/app.actions";
import {
  ON_ACCEPT,
  ON_AMOUNT_CHANGE,
  ON_ORDER_TYPE_CHANGE,
  ON_PRICE_CHANGE,
  ON_STOP_PRICE_CHANGE,
  ON_TOTAL_CHANGE,
} from "@/actions/order-form.actions";
import { ORDER_FORM_MODAL } from "@/constants/order-form.modal";
import { RootState } from "@/models/root-state.model";
import { ActionsObservable, ofType, StateObservable } from "redux-observable";
import { filter, map, withLatestFrom } from "rxjs/operators";

export const orderFormEpic = (
  action$: ActionsObservable<any>,
  state$: StateObservable<RootState>
) =>
  action$.pipe(
    ofType(
      ON_PRICE_CHANGE,
      ON_STOP_PRICE_CHANGE,
      ON_AMOUNT_CHANGE,
      ON_ORDER_TYPE_CHANGE,
      ON_TOTAL_CHANGE,
      ON_ACCEPT
    ),
    //@todo defined type
    filter((action) => action.payload.persist),
    withLatestFrom(state$),
    map(([_, state]) => {
      const { setting } = state;

      return saveToStorage(ORDER_FORM_MODAL, setting);
    })
  );

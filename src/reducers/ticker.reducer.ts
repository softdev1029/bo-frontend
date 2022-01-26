import {
  INSTRUMENT_RECEIVED_UPDATE,
  INSTRUMENT_REQUEST,
} from "@/actions/ticker.actions";
import { EMPTY_ARRAY, EMPTY_OBJ } from "@/exports";
import { TickerState } from "@/models/ticker-state.model";
import { ITickerConfig } from "@/models/ticker.model";
import _set from "lodash/set";

const initialState: TickerState = {
  items: EMPTY_ARRAY,
  instruments: EMPTY_OBJ,
  instrumentLoaded: false,
};

export function tickerReducer(state: TickerState = initialState, action) {
  switch (action.type) {
    case INSTRUMENT_REQUEST: {
      return {
        ...state,
        instrumentLoaded: false,
      };
    }
    case INSTRUMENT_RECEIVED_UPDATE: {
      const instrument = action.payload.instrument as Partial<ITickerConfig>;
      const instrumentLoaded = action.payload.finished;
      const instruments = _set(
        { ...state.instruments },
        [instrument.symbolEnum],
        instrument
      );

      return {
        ...state,
        instruments,
        instrumentLoaded: instrumentLoaded,
      };
    }
    // case TICKER_RECEIVED_UPDATE: {
    //   const payload = action.payload;
    //   if (_isArray(payload)) {
    //     return state;
    //   }

    //   const items = state.items.map((item: TickerModel) => {
    //     if (payload[item.ccy]) {
    //       return {
    //         ...item,
    //         ...payload[item.ccy]
    //       }
    //     }

    //     return item;
    //   });

    //   return {
    //     ...state,
    //     items
    //   }
    // }
    default:
      return state;
  }
}

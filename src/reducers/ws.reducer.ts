import {
  WS_OPEN,
  WS_DISCONNECTED,
  WS_AUTH,
  WS_UNAUTH,
  WS_CONNECT,
  WS_MDS_SUBSCRIBE,
  WS_MDS_UNSUBSCRIBE,
} from "@/actions/ws.actions";
import { WebSocketKindStateEnum } from "@/constants/websocket.enums";
import { WSReducerState } from "@/models/ws-reducer-state";
import _set from "lodash/set";

// const EMPTY_COLLECTION = {
//   [WebSocketKindEnum.MARKET]: WebSocketKindStateEnum.IDLE,
//   [WebSocketKindEnum.ORDERS]: WebSocketKindStateEnum.IDLE,
// };

const initialState: WSReducerState = {
  wsCollection: {},
};

export const wsReducer = (state = initialState, action) => {
  // console.log('%c[ws reducer]', 'background: #222; color: #bada55', action.type, action.payload);

  switch (action.type) {
    case WS_CONNECT: {
      const { id } = action;
      const { wsCollection } = state;
      // console.log("[reducer WS_CONNECT] >>> id", id);

      if (
        wsCollection[id] === WebSocketKindStateEnum.CONNECTING ||
        wsCollection[id] === WebSocketKindStateEnum.OPENED
      ) {
        return state;
      }

      return {
        ...state,
        wsCollection: _set(
          state.wsCollection,
          [id],
          WebSocketKindStateEnum.CONNECTING
        ),
      };
    }
    case WS_OPEN: {
      const { id } = action;
      // console.log("[WS_OPEN] >>> id", id);
      return {
        ...state,
        wsCollection: _set(
          state.wsCollection,
          [id],
          WebSocketKindStateEnum.OPENED
        ),
      };
    }
    case WS_DISCONNECTED: {
      const { id } = action;
      console.log("WS_DISCONNECTED", id, { ...state.wsCollection });

      return {
        ...state,
        wsCollection: _set(
          state.wsCollection,
          [id],
          WebSocketKindStateEnum.IDLE
        ),
      };
    }
    case WS_AUTH: {
      const { id } = action.payload;
      console.log("WS_AUTH", id, { ...state.wsCollection });

      return {
        ...state,
        wsCollection: _set(
          state.wsCollection,
          [id],
          WebSocketKindStateEnum.AUTHORIZED
        ),
      };
    }
    case WS_UNAUTH: {
      const { id } = action;
      console.log("WS_UNAUTH", id, { ...state.wsCollection });

      return {
        ...state,
        wsCollection: _set(
          state.wsCollection,
          [id],
          WebSocketKindStateEnum.OPENED
        ),
      };
    }
    case WS_MDS_SUBSCRIBE: {
      const { id } = action;
      console.log("WS_MDS_SUBSCRIBE", id, { ...state.wsCollection });

      return {
        ...state,
        wsCollection: _set(
          state.wsCollection,
          [id],
          WebSocketKindStateEnum.SUBSCRIBED
        ),
      };
    }
    case WS_MDS_UNSUBSCRIBE: {
      const { id } = action;
      console.log("WS_MDS_UNSUBSCRIBE", id, { ...state.wsCollection });

      return {
        ...state,
        wsCollection: _set(
          state.wsCollection,
          [id],
          WebSocketKindStateEnum.AUTHORIZED
        ),
      };
    }
    default: {
      return state;
    }
  }
};

import { INSTRUMENT_REQUEST } from "@/actions/ticker.actions";
import { sendWsData } from "@/actions/ws.actions";
import { WebSocketKindEnum } from "@/constants/websocket.enums";
import {
  InstrumentRequest,
  InstrumentRequestEnum,
} from "@/models/instrument.model";
import { InstrumentRequestManner } from "@/packets/instrument.packet";
import { getAccountId, getSessionId } from "@/selectors/auth.selectors";
import { ofType } from "redux-observable";
import { map, withLatestFrom } from "rxjs/operators";

export const instrumentRequestEpic = (action$, state$) =>
  action$.pipe(
    ofType(INSTRUMENT_REQUEST),
    withLatestFrom(state$),
    //@ts-ignore
    map(([action, state]) => {
      const instrumentRequestData: InstrumentRequest = {
        type: InstrumentRequestManner.messageType,
        accountId: getAccountId(state),
        sessionId: getSessionId(state),
        sendingTime: Date.now(),
        requestType: InstrumentRequestEnum.ALL,
        symbolType: action.payload,
      };

      const data = InstrumentRequestManner.send(instrumentRequestData);
      console.log(
        "sending request for walletType",
        action.payload,
        "data",
        data,
        instrumentRequestData
      );

      return sendWsData(WebSocketKindEnum.ORDERS, data);
    })
  );

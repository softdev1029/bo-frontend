/**
 * @changelog Dec 11, 2021
 * + remove the concept of `channel`, the market data will include data of all trades, tickers, books
 * + remove the sub/unsub feature, if you want to unsubscribe -> close MDS (note: only closing MDS when switch to another symbol)
 * + MDS returns only 1 minute bar, so we don't have to renew the subscription when interval changed
 */
import { sendSubscribeToMDS, sendWsData } from "@/actions/ws.actions";
import { LOG_COLOR_SEND } from "@/constants/app.constants";
import { SubscribeType } from "@/constants/system-enums";
import {
  PacketHeaderMessageType,
  WebSocketKindEnum,
} from "@/constants/websocket.enums";
import { ISubscribeRequest } from "@/models/subscribe.model";
import { BookManner, TEST_LEVEL_DATA } from "@/packets/book.packet";
import { SubscribeManner } from "@/packets/subscribe.packet";
import React from "react";
import { connect } from "react-redux";
import Subscriber from "./Subscriber";

interface SubscribersProps {
  symbol: string;
  sendSubscribe: (x: ISubscribeRequest) => void;
  closeWs: (x: any) => void;
}

const Subscribers = React.memo(
  ({ sendSubscribe, closeWs, symbol }: Partial<SubscribersProps>) => {
    const props = {
      subscribeFunc: sendSubscribe,
      unsubscribeFunc: closeWs,
      symbol,
      subscribeType: SubscribeType.TENLAYERS,
    };

    return (
      <div>
        <Subscriber {...props} />
      </div>
    );
  }
);

const mapDispatchToProps = (dispatch) => ({
  sendSubscribe: function (data: ISubscribeRequest) {
    console.log("%c [subscribeFunc] >>>>> send (Step 7)", LOG_COLOR_SEND, data);

    const payload = SubscribeManner.send(data);
    dispatch(sendSubscribeToMDS(WebSocketKindEnum.MARKET, payload));

    // const payload = BookManner(PacketHeaderMessageType.BOOK_10).send(
    //   TEST_LEVEL_DATA
    // );
    // dispatch(sendWsData(WebSocketKindEnum.MARKET, payload));
  },
  closeWs: function (data) {
    console.log("close socket....");
  },
});

export default connect(null, mapDispatchToProps)(Subscribers);

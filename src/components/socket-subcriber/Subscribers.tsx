/**
 * @changelog Dec 11, 2021
 * + remove the concept of `channel`, the market data will include data of all trades, tickers, books
 * + remove the sub/unsub feature, if you want to unsubscribe -> close MDS (note: only closing MDS when switch to another symbol)
 * + MDS returns only 1 minute bar, so we don't have to renew the subscription when interval changed
 */
import { sendWsData } from "@/actions/ws.actions";
import { SubscribeType } from "@/constants/system-enums";
import { WebSocketKindEnum } from "@/constants/websocket.enums";
import { ISubscribeRequest } from "@/models/subscribe.model";
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
    console.log("[subscribeFunc] >>>>> send", data);

    const payload = SubscribeManner.send(data);
    dispatch(sendWsData(WebSocketKindEnum.MARKET, payload));
  },
  closeWs: function (data) {
    console.log("close socket....");
  },
});

export default connect(null, mapDispatchToProps)(Subscribers);

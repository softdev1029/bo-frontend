import React, { useEffect } from "react";
import {
  PacketHeaderMessageType,
  WebSocketKindEnum,
  WebSocketKindStateEnum,
} from "@/constants/websocket.enums";
import { connect } from "react-redux";
import { wsCollectionSelector } from "@/selectors/ws.selectors";
import { SingletonWSManager } from "@/internals";
import { getSymbolEnum } from "@/exports/ticker.utils";
import {
  SubscribeType,
  SubscribeUnsubscribeType,
} from "@/constants/system-enums";
import {
  getAccountId,
  getSessionId,
  isUserLoggedIn,
} from "@/selectors/auth.selectors";
import { ISubscribeRequest } from "@/models/subscribe.model";

interface SubscriberProps {
  subscribeFunc: (x: ISubscribeRequest) => void;
  unsubscribeFunc: (x: any) => void;
  isSocketReady?: boolean;
  isLoggedIn?: boolean;
  symbol: string;
  accountId?: number;
  sessionId?: number;
  subscribeType: SubscribeType;
  // removed
  // speed: number,
  // interval: number;
}

const Subscriber = React.memo(
  ({
    isLoggedIn,
    subscribeFunc,
    unsubscribeFunc,
    accountId,
    sessionId,
    symbol,
    subscribeType = SubscribeType.THIRTYLAYERS,
    isSocketReady,
  }: Partial<SubscriberProps>) => {
    useEffect(() => {
      if (!isSocketReady || !isLoggedIn) return;

      const data = {
        accountId,
        sessionId,
        subscribeType,
        symbolEnum: getSymbolEnum(symbol),
        sendingTime: Date.now(),
        type: PacketHeaderMessageType.SUBSCRIBE,
        subscribeUnsubscribe: SubscribeUnsubscribeType.SUBSCRIBE,
      };

      subscribeFunc(data);

      return () => {
        // @changelog Dec 11, 2021
        // no longer have to request unsubscribe to MDS
        // instead we have to create new instance of MDS socket when switching pair
        // unsubscribeFunc(data)
        console.log("un mount");
      }; // called on unmount
    }, [
      isLoggedIn,
      symbol,
      accountId,
      subscribeType,
      sessionId,
      unsubscribeFunc,
      subscribeFunc,
      isSocketReady,
    ]);

    return null;
  }
);

const mapStateToProps = (state, props: SubscriberProps) => {
  const wsId = WebSocketKindEnum.MARKET;
  const socketState = wsCollectionSelector(state)[wsId];

  return {
    accountId: getAccountId(state),
    sessionId: getSessionId(state),
    isLoggedIn: isUserLoggedIn(state),
    isSocketReady:
      SingletonWSManager.isMarketWsById(wsId) &&
      socketState === WebSocketKindStateEnum.AUTHORIZED,
  };
};

export default connect(mapStateToProps)(Subscriber);

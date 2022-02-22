import { selectOption } from "@/actions/ui-setting.actions";
import { getSetting } from "@/selectors/ui-setting.selectors";
import {
  FixedDropdown,
  Menu,
  MenuItem,
  SelectDropdown,
  Button,
} from "@/ui-components";
import React, { useEffect, useState, useRef } from "react";
import { connect } from "react-redux";
import { Options, Symbols } from "@/models/order.model";
import { sendWsData } from "@/actions/ws.actions";
import { ISubscribeRequest } from "@/models/subscribe.model";
import {
  PacketHeaderMessageType,
  WebSocketKindEnum,
  WebSocketKindStateEnum,
} from "@/constants/websocket.enums";
import { wsCollectionSelector } from "@/selectors/ws.selectors";
import {
  getAccountId,
  getSessionId,
  isUserLoggedIn,
} from "@/selectors/auth.selectors";
import { SingletonWSManager } from "@/internals";
import {
  SubscribeType,
  SubscribeUnsubscribeType,
} from "@/constants/system-enums";
import { getSymbolEnum } from "@/exports/ticker.utils";
import { SubscribeManner } from "@/packets/subscribe.packet";
import { MdInfoReqManner } from "@/packets/md-info-req.packet";
import { IMDInfoRequest } from "@/models/md-req.model";

interface OptionType {
  value: string;
  label: string;
}
const OptionBookSetting = ({
  selectedOption,
  selectOption,
  isLoggedIn,
  accountId,
  sessionId,
  subscribeType = SubscribeType.THIRTYLAYERS,
  isSocketReady,
  sendMdReq,
  sendSubscribe,
}) => {
  const options = [
    {
      value: Options.BTC,
      label: Options.BTC,
    },
    {
      value: Options.ETH,
      label: Options.ETH,
    },
    {
      value: Options.XRP,
      label: Options.XRP,
    },
  ];

  const date_options = [
    {
      value: "01 Feb 2022",
      label: "01 Feb 2022",
    },
    {
      value: "02 Jan 2022",
      label: "02 Jan 2022",
    },
    {
      value: "01 Jan 2022",
      label: "01 Jan 2022",
    },
  ];

  const [symbol, setSymbol] = useState<OptionType | undefined>(undefined);
  const [date, setDate] = useState<OptionType | undefined>(undefined);
  const labelRef = useRef<HTMLLabelElement>();

  const [subscribeData, setSubscribeData] = useState<ISubscribeRequest>({
    accountId: 0,
    sendingTime: Date.now(),
    subscribeType: 6,
    symbolEnum: 0,
    subscribeUnsubscribe: SubscribeUnsubscribeType.SUBSCRIBE,
  });

  let titleText = "Option";
  if (selectedOption) {
    titleText = `${
      selectedOption.symbol === undefined
        ? "Option "
        : selectedOption.symbol?.value
    } - ${selectedOption.date === undefined ? "" : selectedOption.date.value}`;
  }

  const onOrderAcceptHandler = () => {
    selectOption({ symbol, date });
    if (labelRef) labelRef.current.click();
    if (!isSocketReady || !isLoggedIn) return;

    sendSubscribe(subscribeData);
  };

  useEffect(() => {
    if (/*!isSocketReady ||*/ !isLoggedIn) return;

    const data = {
      accountId,
      sessionId,
      subscribeType,
      symbolEnum: getSymbolEnum(symbol?.value),
      sendingTime: Date.now(),
      expirationDate: date?.value,
      type: PacketHeaderMessageType.MD_INFO_REQ,
      subscribeUnsubscribe: SubscribeUnsubscribeType.SUBSCRIBE,
    };

    setSubscribeData({
      ...data,
      type: PacketHeaderMessageType.SUBSCRIBE,
    });

    sendMdReq(data);
  }, [symbol]);

  return (
    <FixedDropdown
      title={titleText}
      contentClasses="order-book__setting-menu"
      alignContent="right"
      labelRef={labelRef}
    >
      <Menu>
        <MenuItem
          content={
            <div>
              <label htmlFor="">Option</label>
              <SelectDropdown
                options={options}
                value={symbol}
                onChange={(option) =>
                  (option as OptionType).value !== symbol?.value &&
                  setSymbol(option as OptionType)
                }
              />
            </div>
          }
        />
        <MenuItem
          content={
            <div>
              <label htmlFor="">Expiration Date</label>
              <SelectDropdown
                options={date_options}
                value={date}
                onChange={(option) => setDate(option as OptionType)}
              />
            </div>
          }
        />
        <MenuItem
          content={
            <div className="d-flex d-justify-content-space-between w-100">
              <Button classes="btn primary" onClick={onOrderAcceptHandler}>
                Ok
              </Button>
            </div>
          }
        />
      </Menu>
    </FixedDropdown>
  );
};

const mapStateToProps = (state) => {
  const wsId = WebSocketKindEnum.MARKET;
  const socketState = wsCollectionSelector(state)[wsId];

  // console.log(
  //   "***********~~~~~~~~~~~~: ",
  //   SingletonWSManager.isMarketWsById(wsId) &&
  //     socketState === WebSocketKindStateEnum.AUTHORIZED,
  //   isUserLoggedIn(state)
  // );

  return {
    selectedOption: getSetting(state)("option_ordersetting"),
    accountId: getAccountId(state),
    sessionId: getSessionId(state),
    isLoggedIn: isUserLoggedIn(state),
    isSocketReady:
      SingletonWSManager.isMarketWsById(wsId) &&
      socketState === WebSocketKindStateEnum.AUTHORIZED,
  };
};

const mapDispatchToProps = (dispatch) => ({
  selectOption: function (option, persist?: boolean) {
    dispatch(
      selectOption({
        key: "option_ordersetting",
        option,
        persist: false,
      })
    );
  },
  sendMdReq: function (data: IMDInfoRequest) {
    console.log("%c [Send MDInfoReq for MDS to AES]", "color: green", data);

    const payload = MdInfoReqManner.send(data);
    dispatch(sendWsData(WebSocketKindEnum.ADMIN_RISK, payload));
  },
  sendSubscribe: function (data: ISubscribeRequest) {
    console.log("%c [Send Subscribe to MDS]", "color: green", data);
    const payload = SubscribeManner.send(data);
    dispatch(sendWsData(WebSocketKindEnum.MARKET, payload));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(OptionBookSetting);

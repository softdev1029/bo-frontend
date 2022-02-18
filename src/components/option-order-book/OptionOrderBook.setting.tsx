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
import { SubscribeType } from "@/constants/system-enums";
import { getSymbolEnum } from "@/exports/ticker.utils";
import { SubscribeManner } from "@/packets/subscribe.packet";

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

  const [selectedSymbol, setSelected] = useState<OptionType | undefined>(
    undefined
  );
  const [date, setDate] = useState<OptionType | undefined>(undefined);

  const labelRef = useRef<HTMLLabelElement>();

  let titleText = "Option";
  if (selectedOption) {
    titleText = `${
      selectedOption.selected === undefined
        ? "Option "
        : selectedOption.selectedSymbol?.value
    } - ${selectedOption.date === undefined ? "" : selectedOption.date.value}`;
  }

  const onOrderAcceptHandler = () => {
    selectOption({ selectedSymbol, date });
    if (labelRef) labelRef.current.click();
  };

  useEffect(() => {
    if (!isSocketReady || !isLoggedIn) return;

    const data = {
      accountId,
      sessionId,
      subscribeType,
      symbolEnum: getSymbolEnum(selectedSymbol?.value),
      sendingTime: Date.now(),
      type: PacketHeaderMessageType.SUBSCRIBE,
    };

    console.log("[subscriber orderrbook] >>>>> sub", data);
    sendSubscribe(data);

    return () => {
      // @changelog Dec 11, 2021
      // no longer have to request unsubscribe to MDS
      // instead we have to create new instance of MDS socket when switching pair
      // unsubscribeFunc(data)
      console.log("un mount");
    }; // called on unmount
  }, [
    isLoggedIn,
    onOrderAcceptHandler,
    accountId,
    subscribeType,
    sessionId,
    isSocketReady,
    sendSubscribe,
  ]);

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
                value={selectedSymbol}
                onChange={(option) => setSelected(option as OptionType)}
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
  sendSubscribe: function (data: ISubscribeRequest) {
    console.log("[Orderbook subscribeFunc] >>>>> send", data);

    const payload = SubscribeManner.send(data);
    dispatch(sendWsData(WebSocketKindEnum.ADMIN_RISK, payload));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(OptionBookSetting);

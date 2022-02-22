import { showModal } from "@/actions/app.actions";
import { createNewOrderEntry } from "@/actions/order.actions";
import { Dropdown, DropdownPosition, Icon, Menu, toast } from "@/ui-components";
import React, { useEffect } from "react";
import { connect, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import HeaderModal from "./Header.modal";

import { useBeforeunload } from "react-beforeunload";
import { ISubscribeRequest } from "@/models/subscribe.model";
import { SubscribeManner } from "@/packets/subscribe.packet";
import {
  PacketHeaderMessageType,
  WebSocketKindEnum,
  WebSocketKindStateEnum,
} from "@/constants/websocket.enums";
import { sendUnsubscribe, sendWsData } from "@/actions/ws.actions";
import { wsCollectionSelector } from "@/selectors/ws.selectors";
import { getSetting } from "@/selectors/ui-setting.selectors";
import {
  getAccountId,
  getSessionId,
  isUserLoggedIn,
} from "@/selectors/auth.selectors";
import { SingletonWSManager } from "@/internals";
import { getSymbolEnum } from "@/exports/ticker.utils";
import { SubscribeType } from "@/constants/system-enums";

const HeaderMenuSectionProvider = ({
  showModal,
  isLoggedIn,
  accountId,
  sessionId,
  subscribeType = SubscribeType.THIRTYLAYERS,
  isSocketReady,
  sendUnsubscribe,
  sendSubscribe,
}) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(createNewOrderEntry());
  }, []);

  const handleNewOrderEntry = () => {
    dispatch(createNewOrderEntry());

    if (/* !isSocketReady ||*/ !isLoggedIn) return;
    const data = {
      accountId,
      sessionId,
      subscribeType,
      symbolEnum: getSymbolEnum("BTC"),
      sendingTime: Date.now(),
      type: PacketHeaderMessageType.SUBSCRIBE,
    };

    sendSubscribe(data);
  };

  const title = (
    <div className="d-flex d-align-items-center cpn-header__menu__button">
      <div className="username">Main Menu</div>
    </div>
  );

  useBeforeunload((ev) => {
    const tabCount = sessionStorage.getItem("tabCount");

    if (tabCount && parseInt(tabCount) > 0) {
      sessionStorage.setItem("tabCount", (parseInt(tabCount) - 1).toString());
      sendUnsubscribe();
    } else {
      sessionStorage.setItem("tabCount", "0");
    }
  });

  const handleAcceptNewTab = () => {
    const tabCount = sessionStorage.getItem("tabCount");

    if (tabCount === "5") {
      toast.error("The maximum tab count is 5");
      return;
    }
    if (!tabCount || tabCount === "0") {
      sessionStorage.setItem("tabCount", "2");
    } else {
      sessionStorage.setItem("tabCount", (parseInt(tabCount) + 1).toString());
    }
    window.open(window.location.pathname, "_blank");
  };

  const handleDisplayModal = () => {
    showModal("option-modal-menu-popup", HeaderModal, {
      popupId: "option-modal-menu-popup",
      onAccept: () => {
        handleAcceptNewTab();
      },
    });
  };

  return (
    <Dropdown
      hoverable={true}
      title={title}
      arrowClass="icon-arrow_down_icon font-size-16"
      displayArrow={true}
      contentClasses="cpn-header__account__content"
      position={DropdownPosition.LEFT}
    >
      <Menu>
        <div className="account__content_item">
          <Link to="#">
            <Icon id="wallet" cssmodule="fal" />
            <span className="font-bold" onClick={handleNewOrderEntry}>
              Order Entry
            </span>
          </Link>
        </div>
        <div className="account__content_item">
          <Link to="#">
            <Icon id="usd-circle" cssmodule="fal" />
            <span className="font-bold">Chart</span>
          </Link>
        </div>
        <div className="account__content_item">
          <Link to="#">
            <Icon id="external-link" cssmodule="fal" />
            <span className="font-bold" onClick={handleDisplayModal}>
              Open New Tab
            </span>
          </Link>
        </div>
      </Menu>
    </Dropdown>
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

const mapDispatchToProps = (dispatch) => {
  return {
    showModal: function (id, component, props) {
      dispatch(showModal(id, component, props));
    },
    sendSubscribe: function (data: ISubscribeRequest) {
      console.log("[Sending subscribe to MDS]", data);

      const payload = SubscribeManner.send(data);
      dispatch(sendWsData(WebSocketKindEnum.MARKET, payload));
    },
    sendUnsubscribe: function () {
      dispatch(
        sendUnsubscribe({
          params: "BTC",
          id: 1,
          requestId: 0x42544355534454,
        })
      );
    },
  };
};

export const HeaderMenuSection = connect(
  mapStateToProps,
  mapDispatchToProps
)(HeaderMenuSectionProvider);

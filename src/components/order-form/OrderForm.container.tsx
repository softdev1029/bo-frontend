import React from "react";
import { connect } from "react-redux";

import { OrderFormContainerProps, OrderFormProps } from "./OrderForm.types";
import { isTradeLoaded } from "@/selectors/trade.selectors";
import _maxBy from "lodash/maxBy";
import _minBy from "lodash/minBy";
import { getBalances } from "@/selectors/balance.selectors";
import { getAsksSelector, getBidsSelector } from "@/selectors/book.selectors";
import { getLastPriceBySymbol } from "@/selectors/ticker.selectors";
import {
  getAccountId,
  getSessionId,
  isUserLoggedIn,
} from "@/selectors/auth.selectors";
import { Icon, Card } from "@/ui-components";
import { OrderForm } from "./OrderForm";
import OrderFormInputControlsContainer from "./OrderForm.input-controls.container";
import { orderValidationFn, submitOrderFn } from "./OrderForm.validators";
import { getSetting } from "@/selectors/ui-setting.selectors";
import {
  getLabelOrderType,
  getShortLabelOrderType,
} from "@/exports/order.utils";
import { Link } from "react-router-dom";
import LinkTo from "@/components/LinkTo";
import { RoutePaths } from "@/constants/route-paths";
import { SymbolType } from "@/constants/symbol-enums";
import { OrderType } from "@/constants/system-enums";
import { rejectOrderEntry } from "@/actions/order.actions";

class OrderFormContainer extends React.PureComponent<
  OrderFormContainerProps,
  Partial<OrderFormContainerProps>
> {
  static defaultProps = {
    rendererComponent: OrderForm,
  };
  constructor(props) {
    super(props);

    // this.onLimitBuyClicked = this.onLimitBuyClicked.bind(this);
    this.setParentState = this.setParentState.bind(this);
    this.onSubmitOrder = this.onSubmitOrder.bind(this);
    this.renderForm = this.renderForm.bind(this);
    this.state = { ...props };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let s = {};

    for (let k in prevState) {
      if (nextProps.hasOwnProperty(k) && s[k] !== nextProps[k]) {
        s[k] = nextProps[k];
      }
    }

    if (Object.keys(s).length) {
      return {
        ...prevState,
        ...s,
      };
    }

    return null;
  }

  setParentState(states) {
    this.setState(states);
  }

  onSubmitOrder(
    {
      takeProfit,
      clientOrderId,
      tradeOptions,
      price,
      amount,
      type,
      tif,
      stopPrice,
      side,
      displaySize,
      refreshSize,
      takeProfitStopLossType,
      stopLoss,
      sizeIncrement,
      selectedLayer,
      priceIncrement,
      offset,
      secondLegPrice,
      limitCross,
    },
    onError,
    state,
    extraData,
    onSuccess
  ) {
    let { tickerPrice } = this.state;

    const { price: lowestSellPrice = tickerPrice } =
      _minBy(this.props.asks, (o) => o.price) || {};
    const { price: highestBuyPrice = tickerPrice } =
      _maxBy(this.props.bids, (o) => o.price) || {};

    const {
      orderValidationFn,
      dispatch,
      submitOrderFn,
      executedLongCash,
      executedLongPosition,
      leverage,
      accountId,
      sessionId,
    } = this.props;

    const generalParams = {
      tif,
      tradeOptions,
      side,
      stopPrice: +stopPrice,
      price: +price,
      amount: +amount,
      type,
      leverage,
      takeProfitStopLossType,
      stopLoss,
      clientOrderId,
      takeProfit,
      priceIncrement,
      sizeIncrement,
      selectedLayer,
      offset,
      secondLegPrice,
      limitCross,
    };

    const validParams = {
      ...generalParams,
      lowestSellPrice,
      highestBuyPrice,
      onError,
      executedLongCash,
      executedLongPosition,
    };

    if (orderValidationFn(validParams, this.props)) {
      const submitParams = {
        ...generalParams,
        refreshSize,
        displaySize,
        wallet: this.props.wallet,
        accountId,
        sessionId,
        dispatch,
      };

      submitOrderFn(submitParams, this.props, state, extraData);
      onSuccess && onSuccess();
    }
  }

  private renderForm(data: OrderFormProps) {
    const { tradeType, activeTradeTabTitle, rendererComponent } = this.props;

    return React.createElement(rendererComponent, {
      ...data,
      tradeType,
      activeTradeTabTitle,
    });
  }

  render() {
    const {
      isLoggedIn,
      accountId,
      sessionId,
      order,
      formId,
      rejectOrderEntry,
    } = this.props;

    if (!isLoggedIn) {
      return (
        <div className="orderform__login">
          <div className="orderform__login__logo">
            <Link to="/">
              <span>bit</span>
              <span>24</span>
            </Link>
          </div>
          <LinkTo to={RoutePaths.LOGIN} className="orderform__login__btn">
            Log in
          </LinkTo>
          <LinkTo to={RoutePaths.REGISTER} className="orderform__register__btn">
            Register
          </LinkTo>
          <div className="orderform__login__socials">
            {/* <Link to="/">
              <Icon id="discord" cssmodule="fab" />
            </Link> */}
            <Link to="/">
              <Icon id="twitter" cssmodule="fab" />
            </Link>
            <Link to="/">
              <Icon id="telegram-plane" cssmodule="fab" />
            </Link>
          </div>
        </div>
      );
    }

    const {
      maxLeverage,
      isAuthenticated,
      pair,
      tickerPrice,
      balances,
      wallet,
      orderTypes,
      selectedType,
      immediateSubmit,
      tradingFee,
      mmr,
      hidden,
    } = this.state;

    const orderFormProps = {
      accountId,
      sessionId,
      maxLeverage,
      wallet,
      pair,
      initialPrice: tickerPrice,
      balances,
      onClickHandler: this.onSubmitOrder,
      isTradeLoaded: this.props.isTradeLoaded,
      isAuthenticated,
      orderTypes,
      selectedType,
      immediateSubmit,
      tradingFee,
      mmr,
      hidden,
      activeTradeTabTitle: this.props.activeTradeTabTitle,
      order,
    };

    return (
      <div className="react-grid-item__section">
        <Card
          title="Order Entry"
          className="order-book"
          closable={true}
          onClose={() => rejectOrderEntry(formId)}
        >
          <OrderFormInputControlsContainer {...orderFormProps}>
            {this.renderForm}
          </OrderFormInputControlsContainer>
        </Card>
      </div>
    );
  }
}

function _generateOrderTypeDropdownItem(type: OrderType) {
  return {
    title: getLabelOrderType(type),
    to: `${type}`,
  };
}

function _generateOrderTypeSubItem(type: OrderType) {
  return {
    label: getLabelOrderType(type),
    value: `${type}`,
    shortLabel: getShortLabelOrderType(type),
  };
}
const orderTypes = [
  ...[OrderType.LIMIT, OrderType.MARKET].map(_generateOrderTypeDropdownItem),
  {
    title: "Other",
    to: "other",
    dropdownOptions: [
      OrderType.PEG,
      OrderType.ICE,
      OrderType.OCO,
      OrderType.BRACKET,
      OrderType.SNIPER_LMT,
      OrderType.SNIPER_MKT,
      OrderType.STOP_LMT,
      OrderType.STOP_MKT,
      OrderType.TSL,
      OrderType.TSM,
      // OrderType.PEG_HIDDEN,
      // OrderType.OCO_ICE,
    ].map(_generateOrderTypeSubItem),
  },
];

const mapStateToProps = (state, props) => {
  const { wallet, submitOrderFn: defaultSubmitOrderFn } = props;
  const isDerivateExchange = wallet === SymbolType.DERIVATIVE;
  // @update 16/01/2022 the spot and derivative have the same validation
  const validSubmitOrderFn = defaultSubmitOrderFn || submitOrderFn;

  return {
    balances: getBalances(state),
    bids: getBidsSelector(state),
    asks: getAsksSelector(state),
    maxLeverage: 150,
    isLoggedIn: isUserLoggedIn(state),
    // position: getPositionBySymbol(state, props.pair),
    tickerPrice: getLastPriceBySymbol(state)(props.pair),
    isAuthenticated: isUserLoggedIn(state),
    isTradeLoaded: isTradeLoaded(state),
    tradingFee: 0,
    sessionId: getSessionId(state),
    accountId: getAccountId(state),
    orderTypes,
    executedLongCash: state.user.executedLongCash,
    executedLongPosition: state.user.executedLongPosition,
    leverage: state.user.leverage,
    mmr: state.user.mmr,
    orderValidationFn: orderValidationFn,
    submitOrderFn: validSubmitOrderFn,
    immediateSubmit:
      isDerivateExchange && !getSetting(state)("enabled_order_confirm_popup"),
    activeTradeTabTitle: state.setting.active_trade_tab_title,
  };
};

const mapDispatchToProps = (dispatch) => ({
  rejectOrderEntry: function (key: number, persist = false) {
    dispatch(rejectOrderEntry({ key, persist }));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(OrderFormContainer);

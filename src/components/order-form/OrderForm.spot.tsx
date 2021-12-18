import { OrderSide } from "@/constants/order-enums";
import { formatNumber, greenText, redText } from "@/exports";
import { getAmountDecimals, getSymbols } from "@/exports/ticker.utils";
import { Dropdown, RadioButton, RadioGroup, Tabs } from "@/ui-components";
import { TabTypes } from "@/ui-components/Tabs";
import React from "react";
import classNames from "classnames";
import OrderFormInputs from "./OrderForm.inputs";
import OrderSubmitButton from "./OrderForm.submit-btn";
import { AdditionPopupData, OrderFormProps } from "./OrderForm.types";
import { isBuy } from "./OrderForm.helpers";
import _get from "lodash/get";
import { walletNameFromId } from "@/constants/balance-enums";

interface OrderFormSpotState {
  selectedTab: string;
}
export class OrderFormSpot extends React.Component<
  Partial<OrderFormProps>,
  any
> {
  private _spotTabConfig = [
    {
      title: "Buy",
      to: `${OrderSide.BUY}`,
      // className: greenText(),
    },
    {
      title: "Sell",
      to: `${OrderSide.SELL}`,
      // className: redText(),
    },
  ];

  state = {
    selectedTab: `${OrderSide.BUY}`,
    t: "test",
  };

  constructor(props) {
    super(props);

    this.onTabChanged = this.onTabChanged.bind(this);
    this.sendOrder = this.sendOrder.bind(this);
  }

  private onTabChanged(to: string) {
    this.setState({
      selectedTab: to,
    });
  }

  private renderTab() {
    return (
      <Tabs
        elements={this._spotTabConfig}
        selected={this.state.selectedTab}
        onChange={this.onTabChanged}
        tabType={TabTypes.RADIO_BUTTONS}
        containerClassName="border-radius"
      />
    );
  }

  private sendOrder(clientOrderId: number, side: OrderSide, cb) {
    const { onOrderBtnClick } = this.props;

    onOrderBtnClick(clientOrderId, { side }, cb);
  }

  render() {
    const { amount, balances, pair, wallet } = this.props;
    const { selectedTab } = this.state;
    const [base, quote] = getSymbols(pair);
    const isBuyOrder = isBuy(+selectedTab);

    const btnClass = classNames("btn", isBuyOrder ? "buy" : "sell");

    const label = `PLACE ${isBuyOrder ? "BUY" : "SELL"} ORDER`;
    const balanceCCy = isBuyOrder ? quote : base;
    const balanceAmount = _get(
      balances,
      [balanceCCy, walletNameFromId(wallet), "available"],
      0
    );

    return (
      <div className="order-form__wrapper">
        <div className="mb-10">{this.renderTab()}</div>
        <OrderFormInputs
          balance={balanceAmount}
          side={+selectedTab}
          {...this.props}
        />
        <div className="btn-order__wrapper mb-10">
          <OrderSubmitButton
            className={btnClass}
            side={+selectedTab}
            onBtnClickFallback={this.sendOrder}
            label={label}
          />
        </div>
        <div className="d-flex font-size-11 d-justify-content-space-between font-semi-bold">
          <div className="d-flex d-flex-direction-column">
            <div>
              {isBuyOrder ? "Buy" : "Sell"} {base}
            </div>
            <div className="number-text">
              {formatNumber({
                number: amount,
                decimals: getAmountDecimals(pair),
              })}{" "}
              {base}
            </div>
          </div>
          <div className="d-flex d-flex-direction-column">
            <div className="text-right">Available Balance</div>
            <div className="number-text text-right">
              {formatNumber({
                number: balanceAmount,
                decimals: getAmountDecimals(pair),
              })}{" "}
              {balanceCCy}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

import { getSymbols } from "@/exports/ticker.utils";
import { Tabs } from "@/ui-components";
import { TabTypes } from "@/ui-components/Tabs";
import React from "react";
import { connect } from "react-redux";
import classNames from "classnames";
import OrderFormInputs from "./OrderForm.inputs";
import OrderSubmitButton from "./OrderForm.submit-btn";
import { OrderFormErrors, OrderFormProps } from "./OrderForm.types";
import { isBuy } from "./OrderForm.helpers";
import _get from "lodash/get";
import { walletNameFromId } from "@/constants/balance-enums";
import { OrderSide } from "@/constants/system-enums";
import { Button } from "@/ui-components";
import { closeModal, showModal } from "@/actions/app.actions";
import { replaceOrder } from "@/actions/order.actions";
import { OrderItem } from "@/models/order.model";
import OrderFormModal from "./OrderForm.modal";

interface OrderFormSpotState {
  selectedTab: string;
  errors?: OrderFormErrors;
}
class OrderFormSpotComponent extends React.Component<
  Partial<OrderFormProps>,
  OrderFormSpotState
> {
  private _spotTabConfig = [
    {
      title: "Buy",
      to: `${OrderSide.BUY}`,
      meta: {
        price: "42,400",
      },
    },
    {
      title: "Sell",
      to: `${OrderSide.SELL}`,
      meta: {
        price: "42,378",
      },
    },
  ];

  state = {
    selectedTab: `${OrderSide.BUY}`,
    errors: undefined,
  };

  constructor(props) {
    super(props);

    this.onTabChanged = this.onTabChanged.bind(this);
    this.sendOrder = this.sendOrder.bind(this);
    this.onReplaceOrder = this.onReplaceOrder.bind(this);
    this.onOrderTypeChange = this.onOrderTypeChange.bind(this);
  }

  private onTabChanged(to: string) {
    this.setState({
      selectedTab: to,
    });

    this.props.onPriceChange(this.strikePrice(to));
  }

  private renderTab() {
    return (
      <Tabs
        elements={this._spotTabConfig}
        selected={this.state.selectedTab}
        onChange={this.onTabChanged}
        tabType={TabTypes.BIG_BOX}
        containerClassName="border-radius"
      />
    );
  }

  private sendOrder(clientOrderId: number, side: OrderSide, cb) {
    const { onOrderBtnClick } = this.props;

    // reset the errors
    this.setState({
      errors: undefined,
    });

    onOrderBtnClick(clientOrderId, { side }, (errors) => {
      cb();
      this.setState({
        errors,
      });
    });
  }

  private onReplaceOrder() {
    console.log("props - ", this.props);
  }

  private strikePrice(to: string) {
    const cfg = this._spotTabConfig.find((e) => e.to === to);
    const p = cfg.meta.price;

    return parseInt(p.replace(",", ""));
  }

  onOrderTypeChange(value: string) {
    const { balances, pair, wallet, onOrderTypeChange, showModal } = this.props;
    const { selectedTab } = this.state;

    onOrderTypeChange(value);

    const [base, quote] = getSymbols(pair);
    const isBuyOrder = isBuy(+selectedTab);

    const balanceCCy = isBuyOrder ? quote : base;
    const balanceAmount = _get(
      balances,
      [balanceCCy, walletNameFromId(wallet), "available"],
      0
    );

    showModal("order-form-modal-popup", OrderFormModal, {
      popupId: "order-form-modal-popup",
      sendSubmit: (newOrder) => {
        // console.log("newOrder", newOrder);
      },
      balance: balanceAmount,
      side: +selectedTab,
      ...this.props,
      typeId: +value,
    });
  }

  render() {
    const { balances, pair, wallet } = this.props;

    const { selectedTab, errors } = this.state;
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
          errors={errors}
          {...this.props}
          orderTypes={this.props.orderTypes}
          onOrderTypeChange={this.onOrderTypeChange}
        />
        <div className="btn-order__wrapper mb-10">
          <OrderSubmitButton
            className={classNames("btn", "buy")}
            side={OrderSide.BUY}
            onBtnClickFallback={this.sendOrder}
            label={"Buy"}
          />
          <OrderSubmitButton
            className={classNames("btn", "sell")}
            side={OrderSide.SELL}
            onBtnClickFallback={this.sendOrder}
            label={"Sell"}
          />
        </div>
        {/* <div className="d-flex font-size-11 d-justify-content-space-between font-semi-bold">
          <div className="d-flex d-flex-direction-column">
            <div className="mb-4">
              {isBuyOrder ? "Buy" : "Sell"} {base}
            </div>
            <div className="number-text text--white">
              {hidden ? (
                <div className="text--cool-grey-50">●●●●●●●●●●</div>
              ) : (
                <>
                  {formatNumber({
                    number: amount,
                    decimals: getAmountDecimals(pair, base),
                  })}{" "}
                  {base}
                </>
              )}
            </div>
          </div>
          <div className="d-flex d-flex-direction-column">
            <div className="text-right mb-4">Available Balance</div>
            <div className="number-text text-right text--white">
              {hidden ? (
                <div className="text--cool-grey-50">●●●●●●●●●●</div>
              ) : (
                <>
                  {formatNumber({
                    number: balanceAmount,
                    decimals: getAmountDecimals(pair, balanceCCy),
                  })}{" "}
                  {balanceCCy}
                </>
              )}
            </div>
          </div>
        </div> */}
        {/* <OrderFormAdvanced
          pair={pair}
          typeId={typeId}
          displaySize={displaySize}
          refreshSize={refreshSize}
          onDisplaySizeChange={onDisplaySizeChange}
          onRefreshSizeChange={onRefreshSizeChange}
        /> */}
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {};

const mapDispatchToProps = (dispatch) => ({
  showModal: function (id, component, props) {
    // console.log("1111=", component);
    dispatch(showModal(id, component, props));
  },
  closePopup(id) {
    dispatch(closeModal(id));
  },
  replaceOrder: function (newOrder: OrderItem) {
    dispatch(
      replaceOrder({
        clientOrderId: Date.now(),
        order: newOrder,
      })
    );
  },
});

export const OrderFormSpot = connect(
  null,
  mapDispatchToProps
)(OrderFormSpotComponent);

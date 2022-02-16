import React from "react";
import _isFunction from "lodash/isFunction";
import {
  OrderFormControlsProps,
  OrderFormControlsState,
} from "./OrderForm.types";
import {
  ICELayers,
  LastTradePriceType,
  TakeProfitStopLossType,
  OrderSide,
  OrderType,
  StopTrigger,
  TIF,
  TradeOption,
} from "@/constants/system-enums";
import {
  calculatedTotal,
  getAttributesByOrderTradeOptions,
  getPickedPrice,
  isBuy,
  isEnabledTPSL,
  isMarketOrder,
  shouldHidePriceField,
} from "./OrderForm.helpers";
import { divide, multiply } from "@/exports/math";
import {
  getAmountDecimals,
  getMaxAmount,
  getMinAmount,
} from "@/exports/ticker.utils";
import { sliceTo } from "@/exports/format-number";
import { getOrderBookObservable } from "../order-book/OrderBook.subject";
import { Subscription } from "rxjs";
import _get from "lodash/get";

import { connect } from "react-redux";
import { onAccept } from "@/actions/order-form.actions";

class OrderFormInputControlsContainer extends React.PureComponent<
  Partial<OrderFormControlsProps>,
  OrderFormControlsState
> {
  static defaultProps = {
    selectedType: OrderType.LIMIT,
    orderTypes: [],
  };

  _clientOrderId = null;
  tickerPrice: number = 0;
  subscription: Subscription = null;

  constructor(props) {
    super(props);

    const qty = _get(this.props.order, "qty", 0);
    const price = _get(this.props.order, "price", 0);

    this.state = {
      pair: this.props.pair,
      isTradeLoaded: this.props.isTradeLoaded,
      price,
      stopPrice: _get(this.props.order, "stopPrice", undefined),
      amount: qty || undefined,
      typeId: _get(this.props.order, "orderType", OrderType.LIMIT),
      total: +multiply(qty, price) || undefined,
      fund: undefined,
      applyTPnSL: isEnabledTPSL(_get(this.props.order, "attributes", "")),
      takeProfitTradePriceType: LastTradePriceType.MARK_PRICE,
      stopLossTradePriceType: LastTradePriceType.MARK_PRICE,
      takeProfitStopLossType: TakeProfitStopLossType.VALUE,
      stopLoss: _get(this.props.order, "stopPrice", undefined),
      takeProfit: _get(this.props.order, "takeProfitPrice", undefined),
      tif: TIF.GTC,
      tradeOptions: getAttributesByOrderTradeOptions(
        _get(this.props.order, "attributes", "")
      ),
      leverage: 5,
      displaySize: _get(this.props.order, "displaySize", undefined),
      refreshSize: _get(this.props.order, "refreshSize", undefined),
      enabledStopTrigger: false,
      selectedStopTrigger: StopTrigger.LAST_PRICE,
      trailValue: undefined,
      offset: _get(this.props.order, "priceOffset", undefined),
      priceIncrement: _get(this.props.order, "priceIncrement", undefined),
      selectedLayer: _get(this.props.order, "layers" || 2),
      qtyIncrement: _get(this.props.order, "sizeIncrement", undefined),
      secondLegPrice: _get(this.props.order, "secondLegPrice", undefined),
      limitCross: _get(this.props.order, "limitCross", undefined),
    };

    this.tickerPrice = this.props.initialPrice;

    this._onOrderBookTransferData = this._onOrderBookTransferData.bind(this);
    this.onPriceChange = this.onPriceChange.bind(this);
    this.onStopPriceChange = this.onStopPriceChange.bind(this);
    this.onAmountChange = this.onAmountChange.bind(this);
    this.onOrderBtnClick = this.onOrderBtnClick.bind(this);
    this.onTotalChange = this.onTotalChange.bind(this);
    this.onBalanceClick = this.onBalanceClick.bind(this);
    this.onOrderTypeChange = this.onOrderTypeChange.bind(this);
    this.onPercQuantityBtnClick = this.onPercQuantityBtnClick.bind(this);
    this.onTIFChange = this.onTIFChange.bind(this);
    this.onTradeOptionChange = this.onTradeOptionChange.bind(this);
    this.onLeverageChange = this.onLeverageChange.bind(this);
    this.onApplyTPnSLChange = this.onApplyTPnSLChange.bind(this);
    this.onTakeProfitChange = this.onTakeProfitChange.bind(this);
    this.onStopLossChange = this.onStopLossChange.bind(this);
    this.onTakeProfitLastTradePriceTypeChange =
      this.onTakeProfitLastTradePriceTypeChange.bind(this);
    this.onStopLossLastTradePriceTypeChange =
      this.onStopLossLastTradePriceTypeChange.bind(this);
    this.onTakeProfitStopLossTypeChange =
      this.onTakeProfitStopLossTypeChange.bind(this);
    this.onDisplaySizeChange = this.onDisplaySizeChange.bind(this);
    this.onRefreshSizeChange = this.onRefreshSizeChange.bind(this);
    this.onToggleStopTrigger = this.onToggleStopTrigger.bind(this);
    this.onCloseTriggerOptionChange =
      this.onCloseTriggerOptionChange.bind(this);
    this.onTrailValueChange = this.onTrailValueChange.bind(this);
    this.onOffsetChange = this.onOffsetChange.bind(this);
    this.onPriceIncrementChange = this.onPriceIncrementChange.bind(this);
    this.onLayerChange = this.onLayerChange.bind(this);
    this.onQtyIncrementChange = this.onQtyIncrementChange.bind(this);
    this.onSecondLegPriceChange = this.onSecondLegPriceChange.bind(this);
    this.onLimitCrossChange = this.onLimitCrossChange.bind(this);
    this.handleConfirmOrderForm = this.handleConfirmOrderForm.bind(this);
  }

  onLayerChange(layer: ICELayers) {
    const { amount } = this.state;

    this.setState({
      selectedLayer: layer,
      qtyIncrement: +divide(amount, layer),
    });
  }

  onSecondLegPriceChange(value: number) {
    this.setState({
      secondLegPrice: value,
    });
  }

  onLimitCrossChange(value: number) {
    this.setState({
      limitCross: value,
    });
  }

  onQtyIncrementChange(value: number) {
    const { selectedLayer } = this.state;
    const newQty = +multiply(selectedLayer, value);

    this.onAmountChange(newQty);
  }

  onOffsetChange(value: number) {
    this.setState({
      offset: value,
    });
  }

  onPriceIncrementChange(value: number) {
    this.setState({
      priceIncrement: value,
    });
  }

  onTrailValueChange(value: number) {
    this.setState({
      trailValue: value,
    });
  }

  onToggleStopTrigger(v, e) {
    const isChecked = e.target.checked;
    this.setState({
      enabledStopTrigger: isChecked,
    });
  }

  onCloseTriggerOptionChange(newOption: string) {
    this.setState({
      selectedStopTrigger: +newOption,
    });
  }

  onDisplaySizeChange(value: number) {
    this.setState({
      displaySize: value,
    });
  }

  onRefreshSizeChange(value: number) {
    this.setState({
      refreshSize: value,
    });
  }

  onApplyTPnSLChange(value: boolean) {
    this.setState({
      applyTPnSL: value,
    });
  }

  onTakeProfitChange(value: number) {
    this.setState({
      takeProfit: value,
    });
  }

  onStopLossChange(value: number) {
    // console.log("onStopLossChange", value);

    this.setState({
      stopLoss: value,
    });
  }

  onTakeProfitLastTradePriceTypeChange(ltp: LastTradePriceType) {
    this.setState({
      takeProfitTradePriceType: ltp,
    });
  }

  onStopLossLastTradePriceTypeChange(ltp: LastTradePriceType) {
    this.setState({
      stopLossTradePriceType: ltp,
    });
  }

  onTakeProfitStopLossTypeChange(type: TakeProfitStopLossType) {
    this.setState({
      takeProfitStopLossType: type,
    });
  }

  onLeverageChange(value: number) {
    this.setState({
      leverage: value,
    });
  }

  onTradeOptionChange(values: TradeOption[]) {
    this.setState({
      tradeOptions: values,
    });
  }

  onTIFChange(tif: TIF) {
    if (this.state.tif === tif) {
      return;
    }

    this.setState({ tif });
  }

  onPriceChange(price: number) {
    const { typeId } = this.state;

    this.setState({ price }, () => {
      if (isMarketOrder(typeId) || this.state.amount === undefined) return;
      // const total = Number(this.state.amount) * Number(this.state.price)
      const total = +multiply(this.state.amount, this.state.price);

      this.setState({
        total,
      });
    });
  }

  onStopPriceChange(price: number) {
    const { typeId } = this.state;

    this.setState({ stopPrice: price }, () => {
      if (isMarketOrder(typeId) || !shouldHidePriceField(typeId)) return;

      // const total = Number(this.state.amount) * Number(this.state.price)
      const total = +multiply(this.state.amount, this.state.stopPrice);

      this.setState({
        total,
      });
    });
  }

  onAmountChange(amount: number) {
    const { price, stopPrice, typeId } = this.state;

    this.setState({ amount }, () => {
      // if (isMarketOrder(typeId)) return;

      const tickerPrice = getPickedPrice({
        typeId,
        tickerPrice: this.tickerPrice,
        price,
        stopPrice,
      });

      const total = +multiply(+this.state.amount, tickerPrice);

      const changed = { total };
      if (typeId === OrderType.ICE) {
        changed["qtyIncrement"] = divide(
          +this.state.amount,
          this.state.selectedLayer
        );
      }

      this.setState(changed);
    });
  }

  // used by OrderSubmitBtn
  onOrderBtnClick(clientId: number, data, cb) {
    const { accountId, wallet, sessionId } = this.props;
    const { side } = data || {};

    const {
      takeProfit,
      selectedStopTrigger,
      displaySize,
      refreshSize,
      price,
      amount,
      typeId,
      stopPrice,
      tif,
      tradeOptions,
      takeProfitStopLossType,
      stopLoss,
      priceIncrement,
      qtyIncrement,
      offset,
      selectedLayer,
      secondLegPrice,
      limitCross,
    } = this.state;

    this.props.onClickHandler(
      {
        wallet,
        sessionId,
        accountId,
        displaySize,
        refreshSize,
        clientOrderId: clientId,
        tradeOptions,
        tif,
        side,
        stopTrigger: selectedStopTrigger,
        price,
        amount,
        takeProfitStopLossType,
        takeProfit,
        stopLoss,
        type: typeId,
        stopPrice,
        priceIncrement,
        sizeIncrement: qtyIncrement,
        offset,
        selectedLayer,
        secondLegPrice,
        limitCross,
      },
      cb,
      this.state,
      data,
      () => {
        stopPrice && this.setState({ stopPrice: undefined });

        //clear the trade attributes
        this.setState({
          tradeOptions: [],
          takeProfit: undefined,
          stopLoss: undefined,
          enabledStopTrigger: false,
        });
      }
    );
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      nextProps.pair !== prevState.pair ||
      prevState.isTradeLoaded !== nextProps.isTradeLoaded
    ) {
      const { pair } = nextProps;

      return {
        ...prevState,
        price: nextProps.initialPrice || 0,
        isTradeLoaded: nextProps.isTradeLoaded,
        pair,
        stopPrice: undefined,
        amount: undefined,
        typeId: nextProps.selectedType || OrderType.LIMIT,
        total: undefined,
        tif: TIF.GTC,
        refreshSize: undefined,
        displaySize: undefined,
        takeProfit: undefined,
        stopLoss: undefined,
        takeProfitTradePriceType: LastTradePriceType.MARK_PRICE,
        stopLossTradePriceType: LastTradePriceType.MARK_PRICE,
        tradeOptions: [],
        enabledStopTrigger: false,
        selectedStopTrigger: StopTrigger.LAST_PRICE,
        trailValue: undefined,
        offset: undefined,
        priceIncrement: undefined,
        qtyIncrement: undefined,
        selectedLayer: 2,
        secondLegPrice: undefined,
        limitCross: undefined,
      };
    }

    return null;
  }

  onTotalChange(total: number) {
    this._updateAmountByTotal(total);
  }

  onBalanceClick(balance: number, side: OrderSide) {
    // let { isAuthenticated } = this.props;
    // if (!isAuthenticated || !balance)
    //   return;

    if (!balance) return;

    this._updateFieldsByTotal(balance, side);
  }

  onPercQuantityBtnClick(
    balance: number,
    percentage: number = 1,
    side: OrderSide
  ) {
    let { isAuthenticated } = this.props;
    // console.log("side", side);

    // if (!isAuthenticated || !balance)
    //   return;
    if (!balance) return;

    if (percentage !== 1) balance = +multiply(balance, percentage);

    this._updateFieldsByTotal(balance, side);
  }

  _updateFieldsByTotal(balance: number, side: OrderSide) {
    if (!side) {
      // console.log("derivative");
    }

    let { pair } = this.props;

    if (isBuy(side)) {
      this._updateAmountByTotal(+balance);
    } else {
      const decimalPlaceAmount = getAmountDecimals(pair);

      this.setState(
        {
          amount: +sliceTo(+balance, decimalPlaceAmount),
        },
        () => {
          let { price, typeId, stopPrice, amount } = this.state;

          const total = calculatedTotal({
            typeId,
            price,
            stopPrice,
            tickerPrice: this.tickerPrice,
            amount,
          });

          this.setState({
            total,
          });
        }
      );
    }
  }

  _updateAmountByTotal(total) {
    const { pair } = this.props;

    const decimalPlaceAmount = getAmountDecimals(pair);

    this.setState(
      {
        total: total,
      },
      () => {
        const { price, total, stopPrice, typeId } = this.state;

        const tickerPrice = getPickedPrice({
          typeId,
          tickerPrice: this.tickerPrice,
          price,
          stopPrice,
        });

        // console.warn('this.tickerPrice', this.tickerPrice,'tickerPrice', tickerPrice);

        if (Number(tickerPrice)) {
          let amount = +sliceTo(
            +divide(Number(total), tickerPrice),
            decimalPlaceAmount
          );
          this.setState({
            amount,
          });
        }
      }
    );
  }

  onOrderTypeChange(value: string) {
    this.setState({
      typeId: +value,
      // stopPrice: undefined,
      // amount: undefined,
      // total: undefined,
      // refreshSize: undefined,
      // displaySize: undefined,
      // takeProfit: undefined,
      // stopLoss: undefined,
      // takeProfitTradePriceType: LastTradePriceType.MARK_PRICE,
      // stopLossTradePriceType: LastTradePriceType.MARK_PRICE,
      // tradeOptions: [],
      // enabledStopTrigger: false,
      // selectedStopTrigger: StopTrigger.LAST_PRICE,
      // trailValue: undefined,
      // offset: undefined,
      // priceIncrement: undefined,
      // selectedLayer: 2,
      // qtyIncrement: undefined,
      // secondLegPrice: undefined,
      // limitCross: undefined,
    });
  }

  componentDidMount() {
    if (!this.subscription) {
      this.subscription = getOrderBookObservable().subscribe(
        this._onOrderBookTransferData
      );
    }
  }

  componentWillUnmount() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  componentDidUpdate(_, prevState) {
    if (
      prevState.pair !== this.state.pair ||
      prevState.isTradeLoaded !== this.state.isTradeLoaded
    ) {
      this._onUpdateTickerPrice({ price: this.state.price });
    }
  }

  _onUpdateTickerPrice({ price }) {
    this.tickerPrice = Number(price);
  }

  _onOrderBookTransferData({ side, price, amount, isQuick }: any) {
    // const { wallet } = this.props;
    // price = Number(sliceTo(price, getPriceDecimals(this.props.pair)));
    // amount = Number(sliceTo(amount, getAmountDecimals(this.props.pair)));

    // // click to BUY -> fill SELL
    // if (wallet !== SymbolType.DERIVATIVE && side !== this.props.side) {
    //   this.setState(function (state) {
    //     const total = +multiply(price, amount);
    //     return {
    //       price,
    //       amount,
    //       total
    //     }
    //   });
    // } else {
    //   this.setState(function (state) {
    //     return { price }
    //   });
    // }
    this.setState(
      {
        price,
      },
      () => {
        if (isQuick) {
          this.onOrderBtnClick(Date.now(), { side }, () => {});
        }
      }
    );
  }

  handleConfirmOrderForm() {
    this.props.onAccept({ ...this.state });
  }

  render() {
    const {
      mmr,
      balances,
      pair,
      isAuthenticated,
      orderTypes,
      wallet,
      immediateSubmit,
      maxLeverage,
      hidden,
    } = this.props;

    const props = {
      ...this.state,
      hidden,
      mmr,
      maxLeverage,
      pair,
      balances,
      wallet,
      orderTypes,
      isAuthenticated,
      immediateSubmit,
      onPriceChange: this.onPriceChange,
      onAccept: this.handleConfirmOrderForm,
      onStopPriceChange: this.onStopPriceChange,
      onAmountChange: this.onAmountChange,
      onOrderBtnClick: this.onOrderBtnClick,
      onTotalChange: this.onTotalChange,
      onUpdateAmountByBalancePercent: this.onPercQuantityBtnClick,
      onOrderTypeChange: this.onOrderTypeChange,
      onTIFChange: this.onTIFChange,
      onTradeOptionChange: this.onTradeOptionChange,
      onLeverageChange: this.onLeverageChange,
      onApplyTPnSLChange: this.onApplyTPnSLChange,
      onTakeProfitChange: this.onTakeProfitChange,
      onStopLossChange: this.onStopLossChange,
      onTakeProfitLastTradePriceTypeChange:
        this.onTakeProfitLastTradePriceTypeChange,
      onStopLossLastTradePriceTypeChange:
        this.onStopLossLastTradePriceTypeChange,
      onTakeProfitStopLossTypeChange: this.onTakeProfitStopLossTypeChange,
      onDisplaySizeChange: this.onDisplaySizeChange,
      onRefreshSizeChange: this.onRefreshSizeChange,
      onToggleStopTrigger: this.onToggleStopTrigger,
      onCloseTriggerOptionChange: this.onCloseTriggerOptionChange,
      onTrailValueChange: this.onTrailValueChange,
      onOffsetChange: this.onOffsetChange,
      onPriceIncrementChange: this.onPriceIncrementChange,
      onLayerChange: this.onLayerChange,
      onQtyIncrementChange: this.onQtyIncrementChange,
      onSecondLegPriceChange: this.onSecondLegPriceChange,
      onLimitCrossChange: this.onLimitCrossChange,
    };
    return _isFunction(this.props.children) ? this.props.children(props) : null;
  }
}

const mapStateToProps = () => {
  return {};
};

const mapDispatchToProps = (dispatch) => ({
  onAccept: function (orderFormInfo, persist = false) {
    dispatch(
      onAccept({
        orderFormInfo,
        persist,
      })
    );
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrderFormInputControlsContainer);

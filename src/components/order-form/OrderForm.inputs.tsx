import React from "react";
import { AppTradeType } from "@/constants/trade-type";
import {
  getMinAmount,
  getAmountDecimals,
  getPriceDecimals,
  getSymbols,
  getMinPrice,
} from "@/exports/ticker.utils";
import {
  Tabs,
  InputCheckboxInline,
  SelectDropdown,
  Tooltip,
  RadioGroup,
  RadioButton,
} from "@/ui-components";
import GroupInput from "./OrderForm.group-input";
import {
  shouldDisplayLayers,
  shouldDisplayPriceIncreAndOffset,
  shouldDisplayStandaloneOffset,
  shouldDisplayStandaloneStopPrice,
  shouldDisplayStopPriceField,
  shouldDisplayStopTriggerGroup,
  shouldDisplayTIFOptions,
  shouldDisplayTPnSLGroups,
  shouldDisplayTrailValueField,
  shouldHidePriceField,
  shouldDisplayAdvancedGroups,
  shouldDisplayLimitCrossField,
} from "./OrderForm.helpers";
import OrderFormInputWithInfo from "./OrderForm.input-with-info";
import { OrderFormLastTradePriceOptions } from "./OrderForm.lastTradePrice-options";
import OrderFormQuantitySlider from "./OrderForm.quantity-slider";
import OrderFormStopTrigger from "./OrderForm.stop-trigger";
import { OrderFormTIFOptions } from "./OrderForm.tif-options";
import { OrderFormTradeOptions } from "./OrderForm.trade-options";
import { OrderFormErrorEnum, OrderFormInputDataFlows } from "./OrderForm.types";
import { ReactComponent as InfoIcon } from "../../resources/img/info.svg";
import { ReactComponent as CalculatorIcon } from "../../resources/img/calculator.svg";
import {
  ICELayers,
  OrderType,
  TakeProfitStopLossType,
} from "@/constants/system-enums";
import _get from "lodash/get";
import { CallPutOption } from "@/models/order.model";
import { getLabelOrderType } from "@/exports/order.utils";

const takeProfitStopLossOptions = [
  {
    label: "% from price",
    value: TakeProfitStopLossType.PERCENT,
  },
  {
    label: "Value",
    value: TakeProfitStopLossType.VALUE,
  },
];

export default class OrderFormInputs extends React.Component<
  Partial<OrderFormInputDataFlows>,
  any
> {
  static defaultProps = {
    hideBalanceSlider: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      layers: Object.values(ICELayers)
        .filter((v) => !isNaN(+v))
        .map((v) => ({
          label: `${v}`,
          value: v,
        })),
      showAdvanced: false,
      expiryDate: new Date(),
      selectedCallPutOption: CallPutOption.CALL,
    };
    this.handleShowAdvancedChange = this.handleShowAdvancedChange.bind(this);
    this.onLayerChange = this.onLayerChange.bind(this);
    this.onChangeExpiryDate = this.onChangeExpiryDate.bind(this);
    this.onCallPutChange = this.onCallPutChange.bind(this);
  }

  onLayerChange({ value }) {
    const { onLayerChange } = this.props;

    onLayerChange(value);
  }

  onChangeExpiryDate(value) {
    this.setState((state) => {
      return { ...state, expiryDate: value };
    });
  }

  onCallPutChange(value: CallPutOption) {
    this.setState((state) => {
      return { ...state, selectedCallPutOption: value };
    });
  }

  handleShowAdvancedChange() {
    if (this.state.showAdvanced) {
      this.props.onDisplaySizeChange(0);
      this.props.onRefreshSizeChange(0);
    }

    this.setState({ showAdvanced: !this.state.showAdvanced });
  }

  render() {
    const { layers } = this.state;

    const {
      orderTypes,
      side,
      pair,
      typeId,
      price,
      amount,
      stopPrice,
      tif,
      balance,
      tradeOptions,
      applyTPnSL,
      secondLegPrice,
      stopLoss,
      takeProfit,
      takeProfitTradePriceType,
      stopLossTradePriceType,
      takeProfitStopLossType,
      trailValue,
      total,
      onStopPriceChange,
      onAmountChange,
      onUpdateAmountByBalancePercent,
      onPriceChange,
      onOrderTypeChange,
      onTIFChange,
      onTradeOptionChange,
      onTakeProfitLastTradePriceTypeChange,
      onStopLossLastTradePriceTypeChange,
      onTakeProfitStopLossTypeChange,
      onApplyTPnSLChange,
      onStopLossChange,
      onTakeProfitChange,
      enabledStopTrigger,
      onToggleStopTrigger,
      selectedCloseTrigger,
      onCloseTriggerOptionChange,
      onTrailValueChange,
      offset,
      onOffsetChange,
      priceIncrement,
      onPriceIncrementChange,
      qtyIncrement,
      selectedLayer,
      onQtyIncrementChange,
      tradeType,
      displaySize,
      onDisplaySizeChange,
      refreshSize,
      onRefreshSizeChange,
      onTotalChange,
      onSecondLegPriceChange,
      hideBalanceSlider,
      limitCross,
      onLimitCrossChange,
      errors,
    } = this.props;

    const [base, quote] = getSymbols(pair);
    const decimalPlacePrice = getPriceDecimals(pair);
    const decimalPlaceAmount = getAmountDecimals(pair);
    const numberRegex = "[0-9]+";
    const floatingPointRegex = "[+-]?([0-9]+([.][0-9]{0,8})?|[.][0-9]{1,8})";
    const priceRegex = decimalPlacePrice
      ? `^([0-9]+([.][0-9]{0,${decimalPlacePrice}})?|[.][0-9]{1,${decimalPlacePrice}})$`
      : decimalPlacePrice === null
      ? floatingPointRegex
      : numberRegex;
    const amountRegex = decimalPlaceAmount
      ? `^([0-9]+([.][0-9]{0,${decimalPlaceAmount}})?|[.][0-9]{1,${decimalPlaceAmount}})$`
      : decimalPlaceAmount === null
      ? floatingPointRegex
      : numberRegex;
    const priceStep = getMinPrice(pair);
    const amountStep = getMinAmount(pair);
    const totalStep = price * amountStep;

    return (
      <div>
        {orderTypes.length ? (
          <div className="mb-15 tabs-order-type_ctn">
            <Tabs
              elements={orderTypes}
              selected={`${typeId}`}
              onChange={onOrderTypeChange}
              tabClassName="tab-order-type"
              containerClassName="tabs-order-type tabs-order-type-tab"
            />
            {/* <Tooltip
              tooltipContent="Limit: Show info on selection"
              place="bottom"
            >
              <InfoIcon className="icon pl-20" />
            </Tooltip>
            {tradeType !== AppTradeType.SPOT && (
              <Tooltip tooltipContent="Show info on selection" place="bottom">
                <CalculatorIcon className="icon ml-5" />
              </Tooltip>
            )} */}
          </div>
        ) : null}

        <div className="mb-10 call-put-option">
          {/* <SelectDropdown options={callPutOptions} /> */}
          <RadioGroup
            className="call-put-group"
            name="callPutOptions"
            selectedValue={this.state.selectedCallPutOption}
            onChange={this.onCallPutChange}
          >
            <RadioButton label="Call" value={CallPutOption.CALL} />
            <div>{getLabelOrderType(typeId)}</div>
            <RadioButton label="Put" value={CallPutOption.PUT} />
          </RadioGroup>
        </div>

        {!shouldHidePriceField(typeId) && (
          <div className="mb-10">
            <GroupInput
              type="numeric"
              useHandlers={true}
              pattern={priceRegex}
              value={price}
              onChange={onPriceChange}
              precision={decimalPlacePrice}
              addonAfter={quote}
              addonBefore={
                typeId !== OrderType.BRACKET ? "Price" : "Limit Buy Price"
              }
              step={priceStep}
              error={_get(errors, [OrderFormErrorEnum.PRICE], undefined)}
            />
          </div>
        )}

        <div className="mb-10">
          <GroupInput
            type="numeric"
            useHandlers={true}
            value={amount}
            pattern={amountRegex}
            onChange={onAmountChange}
            addonAfter={base}
            addonBefore={
              typeId === OrderType.ICE ? "Order Quantity" : "Quantity"
            }
            step={amountStep}
            precision={decimalPlaceAmount}
            error={_get(errors, [OrderFormErrorEnum.QTY], undefined)}
          />
        </div>
        <div className="mb-10">
          <GroupInput
            type="numeric"
            useHandlers={true}
            value={total}
            pattern={amountRegex}
            onChange={onTotalChange}
            step={totalStep}
            addonAfter={quote}
            addonBefore={"Value"}
            precision={getPriceDecimals(pair)}
          />
        </div>

        {false && typeId === OrderType.BRACKET && (
          <div className="mb-10">
            <GroupInput
              type="numeric"
              useHandlers={true}
              pattern={priceRegex}
              value={secondLegPrice}
              onChange={onSecondLegPriceChange}
              precision={decimalPlacePrice}
              addonAfter={quote}
              addonBefore={"Limit Sell Price"}
              step={priceStep}
            />
          </div>
        )}
        {false && shouldDisplayStopPriceField(typeId) && (
          <div className="mb-10">
            <GroupInput
              value={stopPrice}
              pattern={priceRegex}
              onChange={onStopPriceChange}
              addonAfter={quote}
              addonBefore={"Stop Price"}
              precision={decimalPlacePrice}
              step={priceStep}
              type="numeric"
              useHandlers={true}
              error={_get(errors, [OrderFormErrorEnum.STOP_PRICE], undefined)}
            />
          </div>
        )}
        {false && shouldDisplayLimitCrossField(typeId) && (
          <div className="mb-10">
            <GroupInput
              type="numeric"
              useHandlers={true}
              pattern={priceRegex}
              value={limitCross}
              onChange={onLimitCrossChange}
              precision={decimalPlacePrice}
              addonAfter={quote}
              addonBefore={"Limit Cross"}
              step={priceStep}
            />
          </div>
        )}
        {!!offset && shouldDisplayPriceIncreAndOffset(typeId) && (
          <div className="mb-10">Offset: {offset}</div>
        )}
        {!!priceIncrement && shouldDisplayPriceIncreAndOffset(typeId) && (
          <div className="mb-10">Increment: {priceIncrement}</div>
        )}

        {false && shouldDisplayStandaloneOffset(typeId) && (
          <div className="mb-10">
            <GroupInput
              type="numeric"
              value={offset}
              useHandlers={true}
              onChange={onOffsetChange}
              addonBefore={"Stop Offset"}
              addonAfter={quote}
            />
          </div>
        )}
        {false && shouldDisplayLayers(typeId) && (
          <div className="mb-10 order-form__layers">
            <div className="order-form__layers__label">Layers</div>
            <SelectDropdown
              placeholder="Layers"
              options={layers}
              value={selectedLayer}
              onChange={this.onLayerChange}
            />
            {/* <OrderFormInputWithInfo
              pattern={amountRegex}
              placeholder="Offset"
              value={qtyIncrement || ""}
              onChange={onQtyIncrementChange}
            /> */}
            <GroupInput
              type="numeric"
              useHandlers={true}
              value={qtyIncrement}
              pattern={amountRegex}
              onChange={onQtyIncrementChange}
              addonAfter={base}
              step={amountStep}
              addonBefore={"Size Inc."}
            />
          </div>
        )}
        {false && !hideBalanceSlider ? (
          <div className="mb-10">
            {/* <OrderFormQuantityButtons
            balance={balance}
            side={side}
            onClick={onUpdateAmountByBalancePercent}
          /> */}
            <OrderFormQuantitySlider
              min={0}
              max={100}
              value={0}
              label="Percentage of Balance"
              valueLabel={"%"}
              isValueEditable={false}
              onChange={(val) =>
                onUpdateAmountByBalancePercent(balance, val / 100.0, side)
              }
            />
          </div>
        ) : null}
        {false && shouldDisplayTrailValueField(typeId) && (
          <div className="mb-10">
            <GroupInput
              value={trailValue}
              pattern={amountRegex}
              onChange={onTrailValueChange}
              addonAfter={quote}
              addonBefore={"Trail Value"}
            />
          </div>
        )}
        {false && shouldDisplayTIFOptions(typeId) && (
          <div className="mb-15 d-flex d-justify-content-space-between">
            <OrderFormTradeOptions
              orderType={typeId}
              selectedOptions={tradeOptions}
              onTradeOptionChange={onTradeOptionChange}
            />
            <div style={{ width: 56 }}>
              <OrderFormTIFOptions selected={tif} onTIFChange={onTIFChange} />
            </div>
          </div>
        )}
        {false &&
          ((shouldDisplayAdvancedGroups(typeId) &&
            !shouldDisplayTPnSLGroups(typeId)) ||
            shouldDisplayStopTriggerGroup(typeId)) && (
            <div
              className="d-flex d-justify-content-space-between"
              style={{ marginBottom: 16 }}
            >
              <div className="d-flex d-align-items-center">
                {shouldDisplayAdvancedGroups(typeId) &&
                  !shouldDisplayTPnSLGroups(typeId) && (
                    <InputCheckboxInline
                      value={this.state.showAdvanced}
                      checked={this.state.showAdvanced}
                      onChange={this.handleShowAdvancedChange}
                      label="Display/Refresh"
                    />
                  )}
              </div>
              {shouldDisplayStopTriggerGroup(typeId) && (
                <OrderFormStopTrigger
                  enabledStopTrigger={enabledStopTrigger}
                  onToggleStopTrigger={onToggleStopTrigger}
                  selectedCloseTrigger={selectedCloseTrigger}
                  onCloseTriggerOptionChange={onCloseTriggerOptionChange}
                />
              )}
            </div>
          )}
        {false && shouldDisplayTPnSLGroups(typeId) && (
          <div className="mb-15 d-flex d-justify-content-space-between">
            <InputCheckboxInline
              value={applyTPnSL}
              checked={applyTPnSL}
              onChange={(_) => onApplyTPnSLChange(!applyTPnSL)}
              label="Take Profit/Stop Loss"
            />
            {shouldDisplayTPnSLGroups(typeId) && applyTPnSL ? (
              <SelectDropdown
                options={takeProfitStopLossOptions}
                value={takeProfitStopLossType}
                onChange={(selected) =>
                  onTakeProfitStopLossTypeChange(selected.value)
                }
                className={"take-profit-stop-loss-dropdown"}
              />
            ) : (
              <InputCheckboxInline
                value={this.state.showAdvanced}
                checked={this.state.showAdvanced}
                onChange={this.handleShowAdvancedChange}
                label="Display/Refresh"
              />
            )}
          </div>
        )}
        {false && shouldDisplayTPnSLGroups(typeId) && applyTPnSL && (
          // <OrderFormCollapseArea
          //   title="Take Profit / Stop Loss"
          //   expandedTitle="Remove Take Profit / Stop Loss"
          // >
          <>
            <div className="order-form__input-wraper--2-1">
              <GroupInput
                value={takeProfit}
                pattern={priceRegex}
                onChange={onTakeProfitChange}
                addonAfter={
                  takeProfitStopLossType === TakeProfitStopLossType.PERCENT
                    ? "%"
                    : quote
                }
                addonBefore={"Take Profit"}
                type="numeric"
                useHandlers={true}
              />
              {tradeType !== AppTradeType.SPOT && (
                <OrderFormLastTradePriceOptions
                  selected={takeProfitTradePriceType}
                  onLastTradePriceTypeChange={
                    onTakeProfitLastTradePriceTypeChange
                  }
                />
              )}
            </div>
            <div className="order-form__input-wraper--2-1">
              <GroupInput
                value={stopLoss}
                pattern={priceRegex}
                onChange={onStopLossChange}
                addonAfter={
                  takeProfitStopLossType === TakeProfitStopLossType.PERCENT
                    ? "%"
                    : quote
                }
                addonBefore={"Stop Loss"}
                type="numeric"
                useHandlers={true}
              />
              {tradeType !== AppTradeType.SPOT && (
                <OrderFormLastTradePriceOptions
                  selected={stopLossTradePriceType}
                  onLastTradePriceTypeChange={
                    onStopLossLastTradePriceTypeChange
                  }
                />
              )}
            </div>
          </>
          // </OrderFormCollapseArea>
        )}
        {false && shouldDisplayTPnSLGroups(typeId) && applyTPnSL && (
          <div className="mb-15">
            <InputCheckboxInline
              value={this.state.showAdvanced}
              checked={this.state.showAdvanced}
              onChange={this.handleShowAdvancedChange}
              label="Display/Refresh"
            />
          </div>
        )}
        {false && this.state.showAdvanced && (
          <>
            <div className="order-form__input-wraper--2-1">
              <GroupInput
                value={displaySize}
                pattern={priceRegex}
                onChange={onDisplaySizeChange}
                addonAfter={base}
                addonBefore={"Display Size"}
                type="numeric"
                useHandlers={true}
              />
            </div>
            <div className="order-form__input-wraper--2-1">
              <GroupInput
                value={refreshSize}
                pattern={priceRegex}
                onChange={onRefreshSizeChange}
                addonAfter={base}
                addonBefore={"Refresh Size"}
                type="numeric"
                useHandlers={true}
              />
            </div>
          </>
        )}
        {false && shouldDisplayStandaloneStopPrice(typeId) && (
          <div className="mb-10">
            <OrderFormInputWithInfo
              inputClass="border-radius"
              placeholder="Stop Price"
              value={stopPrice || ""}
              pattern={priceRegex}
              onChange={onStopPriceChange}
            />
          </div>
        )}
      </div>
    );
  }
}

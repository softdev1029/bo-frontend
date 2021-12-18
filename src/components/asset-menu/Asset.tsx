import { Dropdown, DropdownPosition, Tabs } from "@/ui-components";
import React, { useMemo, useState } from "react";
import { useRouteToTradeType } from "@/hooks/useRouteToTradeType";
import { AssetPopup } from "./Asset.Popup";
import { TickerObject } from "@/selectors/ticker.selectors";
import { AppTradeType } from "@/constants/trade-type";

interface AssetProps {
  symbol: string;
  tickers: TickerObject;
  tradeType: AppTradeType;
}

export class Asset extends React.Component<Partial<AssetProps>> {
  render() {
    const { symbol, tradeType } = this.props;

    return (
      <Dropdown
        displayArrow={true}
        titleClasses="market-info-asset__ticker-btn"
        position={DropdownPosition.LEFT}
        title={
          <div className="currency-button">
            <span className="currency">{symbol}</span>
          </div>
        }
        contentClasses="market-info-asset__dropdown"
      >
        <div className="market-info-asset__wrapper">
          <AssetPopup tradeType={tradeType} />
        </div>
      </Dropdown>
    );
  }
}

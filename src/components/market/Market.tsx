import { AppTradeType } from "@/constants/trade-type";
import React, { ReactNode } from "react";
import { Asset } from "../asset-menu/Asset";
import { SpotMarketInfo, DerivativeMarketInfo } from "./Market.info";
import MarketLastTick from "./Market.LastTick";

interface MarketProps {
  symbol: string;
  tradeType?: string;
  rightTool?: ReactNode;
  marketInfo?: ReactNode;
}

export const Market = React.memo(
  ({ symbol, tradeType, rightTool }: MarketProps) => {
    const marketInfo =
      tradeType === AppTradeType.SPOT ? (
        <SpotMarketInfo symbol={symbol} />
      ) : (
        <DerivativeMarketInfo symbol={symbol} />
      );

    return (
      <div className="cpn-market-info">
        <div className="cpn-market-info--left">
          <Asset symbol={symbol} />
          <div className="cpn-market-info__short-info">
            <div className="title">Last Price</div>
            <MarketLastTick symbol={symbol} />
          </div>
          {marketInfo}
        </div>
        <div className="cpn-market-info--right pr-10">
          {/* {rightTool} */}
          {/* <MarketSetting tradeType={tradeType}/> */}
        </div>
      </div>
    );
  }
);

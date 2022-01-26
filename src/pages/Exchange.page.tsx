import React from "react";
import { MainTradingGrid } from "@/components/grids";
import InstrumentRequester from "@/components/Instrument-requester";
import OrdersNotifier from "@/components/open-order/Orders.notifier";
import { Subscribers } from "@/components/socket-subcriber";
import TradingControlsCol from "@/components/TradingControlsCol";
import { SymbolType } from "@/constants/symbol-enums";

import { AppTradeType } from "@/constants/trade-type";
import OrderTradingGrid from "@/components/grids/OrderTradingGrid";

const ExchangePage = ({ match }) => {
  const tradeType = AppTradeType.SPOT;
  const symbol = match.params.symbol || "BTCUSDT";

  return (
    <>
      <InstrumentRequester tradeType={SymbolType.SPOT}>
        <div className="trading-main-layout">
          {/* <TradingControlsCol tradeType={tradeType} symbol={symbol} /> */}
          <div className="trading-main-free-grid">
            <div className="trading-main-order-grid">
              <OrderTradingGrid symbol={symbol} tradeType={tradeType} />
            </div>
            <div className="trading-main-other-grid">
              <MainTradingGrid symbol={symbol} tradeType={tradeType} />
            </div>
          </div>
        </div>
        <Subscribers symbol={symbol} />
        <OrdersNotifier />
      </InstrumentRequester>
    </>
  );
};
export default ExchangePage;

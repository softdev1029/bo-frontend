import { AppTradeType } from "@/constants/trade-type";
import React from "react";
import { MainTradingGrid } from "@/components/grids";
import { Subscribers } from "@/components/socket-subcriber";
import TradingControlsCol from "@/components/TradingControlsCol";
import OrdersNotifier from "@/components/open-order/Orders.notifier";
import InstrumentRequester from "@/components/Instrument-requester";
import { SymbolType } from "@/constants/symbol-enums";

const DerivativePage = ({ match }) => {
  const symbol = match.params.symbol;
  const tradeType = AppTradeType.DERIVATIVE;
  // const dispatch = useDispatch();

  // useEffect(() => {
  //   dispatch(getFutureTicker(symbol));
  // }, [symbol, dispatch]);

  return (
    <InstrumentRequester tradeType={SymbolType.DERIVATIVE}>
      <div className="trading-main-layout">
        <TradingControlsCol tradeType={tradeType} symbol={symbol} />
        <div className="trading-main-free-grid">
          <MainTradingGrid symbol={symbol} tradeType={tradeType} />
        </div>
      </div>
      <Subscribers symbol={symbol} />
      <OrdersNotifier />
    </InstrumentRequester>
  );
};

export default DerivativePage;

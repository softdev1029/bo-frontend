import { useRouteToTradeType } from "@/hooks/useRouteToTradeType";
import React, { useMemo } from "react";
import { getHeaderConfig } from "./Header.config";
import { getHeaderItems, getHeaderMarketDropdown } from "./Header.helpers";
import { HeaderUserSection } from "./Header.user.section";
import { capitalize } from "@/exports";
import { Link, matchPath, withRouter } from "react-router-dom";
import _get from "lodash/get";
import { Market } from "../market/Market";
import { AppTradeType } from "@/constants/trade-type";
// import { MarketBalance } from '../market/Market.balance';

interface HeaderProps {
  location: any;
}

export const Header = React.memo(
  withRouter(({ location }: Partial<HeaderProps>) => {
    const tradeType = useRouteToTradeType();
    const label = tradeType ? capitalize(tradeType) : "Market";

    const configs = useMemo(
      () => getHeaderConfig({ marketLbl: label, tradeType }),
      [tradeType, label]
    );

    const match = matchPath(location.pathname, {
      path: `/${
        tradeType === AppTradeType.DERIVATIVE ? "derivative" : "exchange"
      }/:symbol`,
    });
    const symbol = _get(match, ["params", "symbol"]);

    const marketHeader = useMemo(
      () => [getHeaderMarketDropdown({ label, tradeType })],
      [label, tradeType]
    );

    return (
      <div className="cpn-header">
        <div className="cpn-header__logo">
          <Link to="/">
            <span>b</span>
            <span>o</span>
          </Link>
          {getHeaderItems(marketHeader)}
        </div>
        {symbol && <Market symbol={symbol} tradeType={tradeType} />}
        <div className="cpn-header__nav">
          {getHeaderItems(configs)}
          <HeaderUserSection />
        </div>
      </div>
    );
  })
);

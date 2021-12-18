import { greenText, redText } from "@/exports";
import { NumberFormat } from "@/ui-components";
import { getTickerBySymbol } from "@/selectors/ticker.selectors";
import React from "react";
import { connect } from "react-redux";
import { getAmountDecimals, getPriceDecimals } from "@/exports/ticker.utils";

interface InfoProps {
  symbol: string;
  high: number;
  low: number;
  volume: number;
  dailyChangePerc: number;
}

const mapStateToProps = (state, props: Partial<InfoProps>) => {
  const ticker = getTickerBySymbol(state)(props.symbol);

  if (ticker) {
    return {
      high: ticker.high,
      low: ticker.low,
      volume: ticker.volume,
      dailyChangePerc: ticker.dailyChangePerc,
    };
  }

  return {};
};

export const SpotMarketInfo = connect(mapStateToProps)(
  ({ high, low, dailyChangePerc, volume, symbol }: Partial<InfoProps>) => {
    const dailyChangeClasses = dailyChangePerc < 0 ? redText() : greenText();
    const decimals = getPriceDecimals(symbol);
    const sigma = dailyChangePerc >= 0 ? "+" : "";
    const amountDecimals = getAmountDecimals(symbol);

    return (
      <div className="d-flex d-align-items-center">
        <div className="cpn-market-info__short-info">
          <div className="cell">
            <div className="col">
              <div className="title">24H High</div>
              <div className="title">24H Low</div>
            </div>
            <div className="col">
              <div className="value">
                <NumberFormat number={high} decimals={decimals} />
              </div>
              <div className="value">
                <NumberFormat number={low} decimals={decimals} />
              </div>
            </div>
          </div>
        </div>
        <div className="cpn-market-info__short-info">
          <div className="cell">
            <div className="col">
              <div className="title">24H Change</div>
              <div className="title">24H Volume</div>
            </div>
            <div className="col">
              <div className="value">
                <NumberFormat
                  prefix={sigma}
                  number={dailyChangePerc}
                  decimals={2}
                  suffix="%"
                  classes={dailyChangeClasses}
                />
              </div>
              <div className="value">
                <NumberFormat number={volume} decimals={amountDecimals} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

interface DerivativeMarketProps extends InfoProps {
  markPrice: number;
  indexPrice: number;
  interestRate: number;
  fundingRate: number;
}

const mapStateToPropsForDerivative = (state, props: Partial<InfoProps>) => {
  const ticker = getTickerBySymbol(state)(props.symbol);

  if (ticker) {
    return {
      high: ticker.high,
      low: ticker.low,
      volume: ticker.volume,
      dailyChangePerc: ticker.dailyChangePerc,
      markPrice: ticker.markPrice,
      indexPrice: ticker.indexPrice,
      fundingRate: ticker.lastFundingRate * 100,
      interestRate: ticker.interestRate,
    };
  }

  return {};
};

export const DerivativeMarketInfo = connect(mapStateToPropsForDerivative)(
  ({
    high,
    low,
    dailyChangePerc,
    volume,
    markPrice,
    indexPrice,
    interestRate,
    fundingRate,
    symbol,
  }: Partial<DerivativeMarketProps>) => {
    const dailyChangeClasses = dailyChangePerc < 0 ? redText() : greenText();
    const fundingRateClasses = fundingRate < 0 ? redText() : greenText();
    const priceDecimals = getPriceDecimals(symbol);
    const amountDecimals = getAmountDecimals(symbol);

    return (
      <div className="d-flex d-align-items-center">
        <div className="cpn-market-info__short-info">
          <div className="cell">
            <div className="col">
              <div className="title">24H High</div>
              <div className="title">24H Low</div>
            </div>
            <div className="col">
              <div className="value">
                <NumberFormat number={high} decimals={priceDecimals} />
              </div>
              <div className="value">
                <NumberFormat number={low} decimals={priceDecimals} />
              </div>
            </div>
          </div>
        </div>
        <div className="cpn-market-info__short-info">
          <div className="cell">
            <div className="col">
              <div className="title">Mark Price</div>
              <div className="title">Index Price</div>
            </div>
            <div className="col">
              <div className="value">
                <NumberFormat number={markPrice} decimals={2} />
              </div>
              <div className="value">
                <NumberFormat number={indexPrice} decimals={2} />
              </div>
            </div>
          </div>
        </div>
        <div className="cpn-market-info__short-info">
          <div className="cell">
            <div className="col">
              <div className="title">24H Change</div>
              <div className="title">Open Interest</div>
            </div>
            <div className="col">
              <div className="value">
                <NumberFormat
                  number={dailyChangePerc}
                  decimals={2}
                  suffix="%"
                  classes={dailyChangeClasses}
                />
              </div>
              <div className="value">
                <NumberFormat number={interestRate} decimals={5} />
              </div>
            </div>
          </div>
        </div>
        <div className="cpn-market-info__short-info">
          <div className="cell">
            <div className="col">
              <div className="title">Funding Rate</div>
              <div className="title">24H Volume</div>
            </div>
            <div className="col">
              <div className="value">
                <NumberFormat
                  number={fundingRate}
                  decimals={4}
                  suffix="%"
                  classes={fundingRateClasses}
                />
              </div>
              <div className="value">
                <NumberFormat number={volume} decimals={amountDecimals} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

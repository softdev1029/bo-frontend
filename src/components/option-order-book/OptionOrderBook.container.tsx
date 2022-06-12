import ResizeSensor from "@/ui-components/ResizeSensor";
import React from "react";
import { connect } from "react-redux";

import { OrderBookModel } from "@/models/book.model";
import { AppTradeType } from "@/constants/trade-type";
import {
  initBook,
  sendMDInfoReq,
  subscribeMarketData,
} from "@/actions/book.action";
import {
  getOptionsAsksSelector,
  getOptionsBidsSelector,
} from "@/selectors/book.selectors";
import { getLastPriceBySymbol } from "@/selectors/ticker.selectors";

import { Collapsible } from "@/ui-components";
import OptionOrderBook from "./OptionOrderBook";

import "./option-order-book.scss";

interface OptionOrderBookContainerProps {
  symbol: string;
  lastPrice: number;
  bids: OrderBookModel[];
  asks: OrderBookModel[];
  dualColumn: boolean;
  enabled1Click: boolean;
  showDepth: boolean;
  maxSumSize: number;
  loadBook: ({ symbol, limit }: { symbol: string; limit?: number }) => void;
  windowOpen?: boolean;
  tradeType: AppTradeType;
}

interface OptionOrderBookContainerState {
  width: number;
  height: number;
}

class OptionOrderBookContainer extends React.PureComponent<
  Partial<OptionOrderBookContainerProps>,
  OptionOrderBookContainerState
> {
  state = {
    width: 0,
    height: 0,
  };

  onResize = (dimension) => {
    const { width, height } = dimension;

    this.setState({
      width,
      height,
    });
  };

  componentDidUpdate(prevProps: Partial<OptionOrderBookContainerProps>) {
    if (this.props.symbol !== prevProps.symbol) {
      const { symbol, loadBook } = this.props;
      loadBook({ symbol });
    }
  }

  componentDidMount() {
    const { symbol, loadBook } = this.props;
    loadBook({ symbol });
  }

  render() {
    return (
      <ResizeSensor onResize={this.onResize}>
        <div className="oob__container" id="oob__container">
          <OptionOrderBook className="oob__date__table" {...this.props} />
        </div>
      </ResizeSensor>
    );
  }
}

const mapStateToProps = (
  state,
  props: Partial<OptionOrderBookContainerProps>
) => {
  return {
    lastPrice: getLastPriceBySymbol(state)(props.symbol),
    bids: getOptionsBidsSelector(state),
    asks: getOptionsAsksSelector(state),
  };
};

const mapDispatchToProps = (dispatch) => ({
  loadBook: function ({ symbol, limit }: { symbol: string; limit?: number }) {
    // we don't need `initBook` (it's only for binance or test)
    // dispatch(initBook({ symbol, limit }));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OptionOrderBookContainer);

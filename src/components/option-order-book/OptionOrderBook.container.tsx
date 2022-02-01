import ResizeSensor from "@/ui-components/ResizeSensor";
import React from "react";
import { connect } from "react-redux";
import { OrderBookModel } from "@/models/book.model";
import { AppTradeType } from "@/constants/trade-type";
import { initBook } from "@/actions/book.action";
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
    const {
      symbol,
      lastPrice,
      dualColumn,
      showDepth,
      maxSumSize,
      bids: b,
      asks: a,
      windowOpen,
      enabled1Click,
      tradeType,
    } = this.props;

    const { width, height } = this.state;

    const bookProps = {
      symbol,
      lastPrice,
      dualColumn,
      showDepth,
      // bids,
      // asks,
      maxSumSize,
      width,
      windowOpen,
      enabled1Click,
      tradeType,
    };

    return (
      <ResizeSensor onResize={this.onResize}>
        <div className="oob__container">
          <OptionOrderBook className="oob__date__table" />
        </div>
      </ResizeSensor>
    );
  }
}

const mapStateToProps = (
  state,
  props: Partial<OptionOrderBookContainerProps>
) => {
  return {};
};

const mapDispatchToProps = (dispatch) => ({
  loadBook: function ({ symbol, limit }: { symbol: string; limit?: number }) {
    dispatch(initBook({ symbol, limit }));
    // dispatch(subscribeMarketData({ symbol, limit }));
    // dispatch(sendMDInfoReq({ symbol }));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OptionOrderBookContainer);

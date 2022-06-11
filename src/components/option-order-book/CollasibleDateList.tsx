import React from "react";
import { connect } from "react-redux";
import { Collapsible } from "@/ui-components";
import CollapibleDate from "./CollasibleDate";
import { getSetting } from "@/selectors/ui-setting.selectors";
import { getOptionOrderBookDataByDate } from "./OptionOrderBook.helpers";
import { OrderBookModel } from "@/models/book.model";

interface CollasibleDateListProps {
  className: string;
  fullscreenMode: boolean;
  bids: OrderBookModel[];
  asks: OrderBookModel[];
}

interface CollasibleDateListState {
  className: string;
}

class CollasibleDateList extends React.PureComponent<
  Partial<CollasibleDateListProps>,
  CollasibleDateListState
> {
  constructor(props) {
    super(props);
    this.state = {
      className: this.props.className,
    };
  }

  render() {
    const { bids, asks } = this.props;
    const optionsBookDataByDate = getOptionOrderBookDataByDate({ bids, asks });
    const compList = Object.keys(optionsBookDataByDate).reduce((acc, cur) => {
      const optionsBookData = optionsBookDataByDate[cur];
      const comp = (
        <Collapsible
          key={cur}
          title={cur}
          open={true}
          triggerDisabled={!this.props.fullscreenMode}
          resizable={this.props.fullscreenMode}
        >
          <CollapibleDate
            className={this.state.className}
            data={optionsBookData}
          />
        </Collapsible>
      );
      acc.push(comp);
      return acc;
    }, []);

    return <div className={`${this.state.className}__wrapper`}>{compList}</div>;
  }
}

const mapStateToProps = (state, props: Partial<CollasibleDateListProps>) => {
  return {
    fullscreenMode: getSetting(state)("set_fullscreen_mode"),
  };
};

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(CollasibleDateList);

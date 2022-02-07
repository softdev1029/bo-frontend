import React from "react";
import { connect } from "react-redux";
import { Collapsible } from "@/ui-components";
import CollasibleDateList from "./CollasibleDateList";
import CollasibleDateHeader from "./CollasibleDate.Header";

interface OptionOrderBookProps {
  className: string;
}

interface OptionOrderBookState {
  className: string;
}

class OptionOrderBook extends React.PureComponent<
  Partial<OptionOrderBookProps>,
  OptionOrderBookState
> {
  constructor(props) {
    super(props);
    this.state = {
      className: this.props.className,
    };
  }

  render() {
    return (
      <div className={`${this.state.className}`}>
        <CollasibleDateHeader className={this.state.className} />
        <CollasibleDateList className={this.state.className} />
      </div>
    );
  }
}

const mapStateToProps = (state, props: Partial<OptionOrderBookProps>) => {
  return {};
};

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(OptionOrderBook);

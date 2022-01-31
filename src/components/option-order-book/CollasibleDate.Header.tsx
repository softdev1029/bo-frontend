import React from "react";
import { connect } from "react-redux";
import { Collapsible } from "@/ui-components";

interface CollasibleDateHeaderProps {
  className: string;
}

interface CollasibleDateHeaderState {
  className: string;
}

class CollasibleDateHeader extends React.PureComponent<
  Partial<CollasibleDateHeaderProps>,
  CollasibleDateHeaderState
> {
  constructor(props) {
    super(props);
    this.state = {
      className: this.props.className,
    };
  }
  render() {
    return (
      <table>
        <thead className={`${this.state.className}__header`}>
          <tr>
            {/* Calls Start */}
            <th>
              <div className={`${this.state.className}__header__item`}>
                <span>Size</span>
              </div>
            </th>
            <th>
              <div className={`${this.state.className}__header__item`}>
                <span>IV (Bid)</span>
              </div>
            </th>
            <th>
              <div className={`${this.state.className}__header__item`}>
                <span>Bid</span>
              </div>
            </th>
            <th>
              <div className={`${this.state.className}__header__item`}>
                <span>Mark</span>
              </div>
            </th>
            <th>
              <div className={`${this.state.className}__header__item`}>
                <span>Ask</span>
              </div>
            </th>
            <th>
              <div className={`${this.state.className}__header__item`}>
                <span>IV (Ask)</span>
              </div>
            </th>
            <th>
              <div className={`${this.state.className}__header__item`}>
                <span>Open</span>
              </div>
            </th>
            <th>
              <div className={`${this.state.className}__header__item`}>
                <span>Δ|Delta</span>
              </div>
            </th>
            {/* Calls End */}
            {/* Puts Start */}
            <th>
              <div className={`${this.state.className}__header__item`}>
                <span>Size</span>
              </div>
            </th>
            <th>
              <div className={`${this.state.className}__header__item`}>
                <span>IV (Bid)</span>
              </div>
            </th>
            <th>
              <div className={`${this.state.className}__header__item`}>
                <span>Bid</span>
              </div>
            </th>
            <th>
              <div className={`${this.state.className}__header__item`}>
                <span>Mark</span>
              </div>
            </th>
            <th>
              <div className={`${this.state.className}__header__item`}>
                <span>Ask</span>
              </div>
            </th>
            <th>
              <div className={`${this.state.className}__header__item`}>
                <span>IV (Ask)</span>
              </div>
            </th>
            <th>
              <div className={`${this.state.className}__header__item`}>
                <span>Open</span>
              </div>
            </th>
            <th>
              <div className={`${this.state.className}__header__item`}>
                <span>Δ|Delta</span>
              </div>
            </th>
            {/* Puts End */}
          </tr>
        </thead>
      </table>
    );
  }
}

const mapStateToProps = (state, props: Partial<CollasibleDateHeaderProps>) => {
  return {};
};

const mapDispatchToProps = (dispatch) => ({
  loadBook: function ({ symbol, limit }: { symbol: string; limit?: number }) {
    // dispatch(initBook({ symbol, limit }));
    // dispatch(subscribeMarketData({ symbol, limit }));
    // dispatch(sendMDInfoReq({ symbol }));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CollasibleDateHeader);

import React from "react";
import { connect } from "react-redux";

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
      <>
        <div className={`${this.state.className}__category`}>
          <div className={`${this.state.className}__category__item`}>Put</div>
          <div className={`${this.state.className}__category__item`}>Call</div>
        </div>
        <div className={`${this.state.className}__header`}>
          <div className={`${this.state.className}__header__left`}>
            <div className={`${this.state.className}__header__item`}>
              <span>Mark</span>
            </div>
            <div className={`${this.state.className}__header__item`}>
              <span>Open</span>
            </div>
            <div className={`${this.state.className}__header__item`}>
              <span>IV (Bid)</span>
            </div>
            <div className={`${this.state.className}__header__item`}>
              <span>Size</span>
            </div>
            <div className={`${this.state.className}__header__item`}>
              <span>Bid</span>
            </div>
            <div className={`${this.state.className}__header__item`}>
              <span>Ask</span>
            </div>
            <div className={`${this.state.className}__header__item`}>
              <span>Size</span>
            </div>
            <div className={`${this.state.className}__header__item`}>
              <span>IV (Ask)</span>
            </div>
          </div>
          <div className={`${this.state.className}__header__center`}>
            <div className={`${this.state.className}__header__item`}>
              <span>Strike</span>
            </div>
          </div>
          <div className={`${this.state.className}__header__right`}>
            <div className={`${this.state.className}__header__item`}>
              <span>IV (Bid)</span>
            </div>
            <div className={`${this.state.className}__header__item`}>
              <span>Size</span>
            </div>
            <div className={`${this.state.className}__header__item`}>
              <span>Bid</span>
            </div>
            <div className={`${this.state.className}__header__item`}>
              <span>Ask</span>
            </div>
            <div className={`${this.state.className}__header__item`}>
              <span>Size</span>
            </div>
            <div className={`${this.state.className}__header__item`}>
              <span>IV (Ask)</span>
            </div>
            <div className={`${this.state.className}__header__item`}>
              <span>Open</span>
            </div>
            <div className={`${this.state.className}__header__item`}>
              <span>Mark</span>
            </div>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch) => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CollasibleDateHeader);

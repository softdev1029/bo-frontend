import React from "react";
import { connect } from "react-redux";
import { Collapsible } from "@/ui-components";
import CollapibleDate from "./CollasibleDate";
import { getSetting } from "@/selectors/ui-setting.selectors";

interface CollasibleDateListProps {
  className: string;
  fullscreenMode: boolean;
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
    return (
      <div className={`${this.state.className}__wrapper`}>
        <Collapsible
          title="01 Feb 2022"
          open={true}
          triggerDisabled={!this.props.fullscreenMode}
          resizable={!this.props.fullscreenMode}
        >
          <CollapibleDate className={this.state.className} />
        </Collapsible>
        {!!this.props.fullscreenMode && (
          <>
            <Collapsible
              title="01 Feb 2022"
              open={true}
              triggerDisabled={false}
            >
              <CollapibleDate className={this.state.className} />
            </Collapsible>
            <Collapsible
              title="01 Feb 2022"
              open={true}
              // triggerDisabled={!!this.props.fullscreenMode}
            >
              <CollapibleDate className={this.state.className} />
            </Collapsible>
          </>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state, props: Partial<CollasibleDateListProps>) => {
  return {
    fullscreenMode: getSetting(state)("set_fullscreen_mode"),
  };
};

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(CollasibleDateList);

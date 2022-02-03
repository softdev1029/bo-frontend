import React from "react";
import { connect } from "react-redux";
import { Collapsible } from "@/ui-components";

interface CollasibleDateProps {
  className?: string;
}

interface CollasibleDateState {
  className: string;
}

class CollasibleDate extends React.PureComponent<
  Partial<CollasibleDateProps>,
  CollasibleDateState
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
        {/* <Collapsible title="01 Feb 2022" open={false}> */}
        <div className={`${this.state.className}__body`}>
          <div className={`${this.state.className}__body__left`}>
            <div>
              <div className={`${this.state.className}__body__item mark`}>
                <span>0.0731</span>
                <span>98.18%</span>
              </div>
              <div className={`${this.state.className}__body__item open`}>
                <span>11.3</span>
              </div>
              <div className={`${this.state.className}__body__item iv_bid`}>
                <span>68.1%</span>
              </div>
              <div className={`${this.state.className}__body__item size`}>
                <span>-</span>
              </div>
              <div className={`${this.state.className}__body__item bid`}>
                <span className="up">0.0010</span>
                <span>$38.90</span>
              </div>
              <div className={`${this.state.className}__body__item ask`}>
                <span className="down">0.0605</span>
                <span>$2351.70</span>
              </div>
              <div className={`${this.state.className}__body__item size`}>
                <span>-</span>
              </div>
              <div className={`${this.state.className}__body__item iv_ask`}>
                <span>-</span>
              </div>
            </div>
          </div>
          <div className={`${this.state.className}__body__center`}>
            <div className={`${this.state.className}__body__item`}>
              <span>30000</span>
            </div>
          </div>
          <div className={`${this.state.className}__body__right`}>
            <div>
              <div className={`${this.state.className}__body__item iv_bid`}>
                <span>68.1%</span>
              </div>
              <div className={`${this.state.className}__body__item size`}>
                <span>-</span>
              </div>
              <div className={`${this.state.className}__body__item bid`}>
                <span className="up">0.0010</span>
                <span>$38.90</span>
              </div>
              <div className={`${this.state.className}__body__item ask`}>
                <span className="down">0.0605</span>
                <span>$2351.70</span>
              </div>
              <div className={`${this.state.className}__body__item size`}>
                <span>-</span>
              </div>
              <div className={`${this.state.className}__body__item iv_ask`}>
                <span>-</span>
              </div>
              <div className={`${this.state.className}__body__item size`}>
                <span>-</span>
              </div>
              <div className={`${this.state.className}__body__item open`}>
                <span>11.3</span>
              </div>
              <div className={`${this.state.className}__body__item mark`}>
                <span>0.0731</span>
                <span>98.18%</span>
              </div>
            </div>
          </div>
        </div>
        <div className={`${this.state.className}__body`}>
          <div className={`${this.state.className}__body__left`}>
            <div>
              <div className={`${this.state.className}__body__item mark`}>
                <span>0.0731</span>
                <span>98.18%</span>
              </div>
              <div className={`${this.state.className}__body__item open`}>
                <span>11.3</span>
              </div>
              <div className={`${this.state.className}__body__item iv_bid`}>
                <span>68.1%</span>
              </div>
              <div className={`${this.state.className}__body__item size`}>
                <span>-</span>
              </div>
              <div className={`${this.state.className}__body__item bid`}>
                <span className="up">0.0010</span>
                <span>$38.90</span>
              </div>
              <div className={`${this.state.className}__body__item ask`}>
                <span className="down">0.0605</span>
                <span>$2351.70</span>
              </div>
              <div className={`${this.state.className}__body__item size`}>
                <span>-</span>
              </div>
              <div className={`${this.state.className}__body__item iv_ask`}>
                <span>-</span>
              </div>
            </div>
          </div>
          <div className={`${this.state.className}__body__center`}>
            <div className={`${this.state.className}__body__item`}>
              <span>30000</span>
            </div>
          </div>
          <div className={`${this.state.className}__body__right`}>
            <div>
              <div className={`${this.state.className}__body__item iv_bid`}>
                <span>68.1%</span>
              </div>
              <div className={`${this.state.className}__body__item size`}>
                <span>-</span>
              </div>
              <div className={`${this.state.className}__body__item bid`}>
                <span className="up">0.0010</span>
                <span>$38.90</span>
              </div>
              <div className={`${this.state.className}__body__item ask`}>
                <span className="down">0.0605</span>
                <span>$2351.70</span>
              </div>
              <div className={`${this.state.className}__body__item size`}>
                <span>-</span>
              </div>
              <div className={`${this.state.className}__body__item iv_ask`}>
                <span>-</span>
              </div>
              <div className={`${this.state.className}__body__item size`}>
                <span>-</span>
              </div>
              <div className={`${this.state.className}__body__item open`}>
                <span>11.3</span>
              </div>
              <div className={`${this.state.className}__body__item mark`}>
                <span>0.0731</span>
                <span>98.18%</span>
              </div>
            </div>
          </div>
        </div>
        <div className={`${this.state.className}__body`}>
          <div className={`${this.state.className}__body__left`}>
            <div>
              <div className={`${this.state.className}__body__item mark`}>
                <span>0.0731</span>
                <span>98.18%</span>
              </div>
              <div className={`${this.state.className}__body__item open`}>
                <span>11.3</span>
              </div>
              <div className={`${this.state.className}__body__item iv_bid`}>
                <span>68.1%</span>
              </div>
              <div className={`${this.state.className}__body__item size`}>
                <span>-</span>
              </div>
              <div className={`${this.state.className}__body__item bid`}>
                <span className="up">0.0010</span>
                <span>$38.90</span>
              </div>
              <div className={`${this.state.className}__body__item ask`}>
                <span className="down">0.0605</span>
                <span>$2351.70</span>
              </div>
              <div className={`${this.state.className}__body__item size`}>
                <span>-</span>
              </div>
              <div className={`${this.state.className}__body__item iv_ask`}>
                <span>-</span>
              </div>
            </div>
          </div>
          <div className={`${this.state.className}__body__center`}>
            <div className={`${this.state.className}__body__item`}>
              <span>30000</span>
            </div>
          </div>
          <div className={`${this.state.className}__body__right`}>
            <div>
              <div className={`${this.state.className}__body__item iv_bid`}>
                <span>68.1%</span>
              </div>
              <div className={`${this.state.className}__body__item size`}>
                <span>-</span>
              </div>
              <div className={`${this.state.className}__body__item bid`}>
                <span className="up">0.0010</span>
                <span>$38.90</span>
              </div>
              <div className={`${this.state.className}__body__item ask`}>
                <span className="down">0.0605</span>
                <span>$2351.70</span>
              </div>
              <div className={`${this.state.className}__body__item size`}>
                <span>-</span>
              </div>
              <div className={`${this.state.className}__body__item iv_ask`}>
                <span>-</span>
              </div>
              <div className={`${this.state.className}__body__item size`}>
                <span>-</span>
              </div>
              <div className={`${this.state.className}__body__item open`}>
                <span>11.3</span>
              </div>
              <div className={`${this.state.className}__body__item mark`}>
                <span>0.0731</span>
                <span>98.18%</span>
              </div>
            </div>
          </div>
        </div>
        <div className={`${this.state.className}__body`}>
          <div className={`${this.state.className}__body__left`}>
            <div>
              <div className={`${this.state.className}__body__item mark`}>
                <span>0.0731</span>
                <span>98.18%</span>
              </div>
              <div className={`${this.state.className}__body__item open`}>
                <span>11.3</span>
              </div>
              <div className={`${this.state.className}__body__item iv_bid`}>
                <span>68.1%</span>
              </div>
              <div className={`${this.state.className}__body__item size`}>
                <span>-</span>
              </div>
              <div className={`${this.state.className}__body__item bid`}>
                <span className="up">0.0010</span>
                <span>$38.90</span>
              </div>
              <div className={`${this.state.className}__body__item ask`}>
                <span className="down">0.0605</span>
                <span>$2351.70</span>
              </div>
              <div className={`${this.state.className}__body__item size`}>
                <span>-</span>
              </div>
              <div className={`${this.state.className}__body__item iv_ask`}>
                <span>-</span>
              </div>
            </div>
          </div>
          <div className={`${this.state.className}__body__center`}>
            <div className={`${this.state.className}__body__item`}>
              <span>30000</span>
            </div>
          </div>
          <div className={`${this.state.className}__body__right`}>
            <div>
              <div className={`${this.state.className}__body__item iv_bid`}>
                <span>68.1%</span>
              </div>
              <div className={`${this.state.className}__body__item size`}>
                <span>-</span>
              </div>
              <div className={`${this.state.className}__body__item bid`}>
                <span className="up">0.0010</span>
                <span>$38.90</span>
              </div>
              <div className={`${this.state.className}__body__item ask`}>
                <span className="down">0.0605</span>
                <span>$2351.70</span>
              </div>
              <div className={`${this.state.className}__body__item size`}>
                <span>-</span>
              </div>
              <div className={`${this.state.className}__body__item iv_ask`}>
                <span>-</span>
              </div>
              <div className={`${this.state.className}__body__item size`}>
                <span>-</span>
              </div>
              <div className={`${this.state.className}__body__item open`}>
                <span>11.3</span>
              </div>
              <div className={`${this.state.className}__body__item mark`}>
                <span>0.0731</span>
                <span>98.18%</span>
              </div>
            </div>
          </div>
        </div>
        {/* </Collapsible> */}
      </>
    );
  }
}

const mapStateToProps = (state, props: Partial<CollasibleDateProps>) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(CollasibleDate);

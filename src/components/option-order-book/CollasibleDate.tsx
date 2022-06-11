import React, { ReactNode } from "react";
import { connect } from "react-redux";
import { Collapsible } from "@/ui-components";
import { showModal } from "@/actions/app.actions";
import { OrderType } from "@/constants/system-enums";
import OrderFormModal from "../order-form/OrderForm.modal";
import { OptionsBookDataItem } from "@/models/book.model";

interface CollasibleDateProps {
  className?: string;
  data: OptionsBookDataItem[];
  showModal: (mid: string, component: ReactNode, props) => void;
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

    this.handleOrderTableClick = this.handleOrderTableClick.bind(this);
  }

  handleOrderTableClick() {
    this.props.showModal("order-tabel-modal-popup", OrderFormModal, {
      popupId: "order-tabel-modal-popup",
      typeId: OrderType.LIMIT,
    });
  }

  render() {
    const { data } = this.props;
    return (
      <>
        {data.map((item, index) => (
          <div className={`${this.state.className}__body`} key={index}>
            <div
              className={`${this.state.className}__body__left`}
              onClick={this.handleOrderTableClick}
            >
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
                  <span>{item.putBid?.size ? item.putBid?.size : "-"}</span>
                </div>
                <div className={`${this.state.className}__body__item bid`}>
                  <span className="up">{item.putBid?.price ? "0.1" : "-"}</span>
                  <span>
                    {item.putBid?.price ? `$${item.putBid?.price}` : "-"}
                  </span>
                </div>
                <div className={`${this.state.className}__body__item ask`}>
                  <span className="down">
                    {item.putAsk?.price ? "0.1" : "-"}
                  </span>
                  <span>
                    {item.putAsk?.price ? `$${item.putAsk?.price}` : "-"}
                  </span>
                </div>
                <div className={`${this.state.className}__body__item size`}>
                  <span>{item.putAsk?.size ? item.putAsk?.size : "-"}</span>
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
            <div
              className={`${this.state.className}__body__right`}
              onClick={this.handleOrderTableClick}
            >
              <div>
                <div className={`${this.state.className}__body__item iv_bid`}>
                  <span>68.1%</span>
                </div>
                <div className={`${this.state.className}__body__item size`}>
                  <span>{item.callBid?.size ? item.callBid?.size : "-"}</span>
                </div>
                <div className={`${this.state.className}__body__item bid`}>
                  <span className="up">
                    {item.callBid?.price ? "0.0010" : "-"}
                  </span>
                  <span>
                    {item.callBid?.price ? `$${item.callBid?.price}` : "-"}
                  </span>
                </div>
                <div className={`${this.state.className}__body__item ask`}>
                  <span className="down">
                    {item.callAsk?.price ? "0.0605" : "-"}
                  </span>
                  <span>
                    {item.callAsk?.price ? `$${item.callAsk?.price}` : "-"}
                  </span>
                </div>
                <div className={`${this.state.className}__body__item size`}>
                  <span>{item.callAsk?.size ? item.callAsk?.size : "-"}</span>
                </div>
                <div className={`${this.state.className}__body__item iv_ask`}>
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
        ))}
      </>
    );
  }
}

const mapStateToProps = (state, props: Partial<CollasibleDateProps>) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {
    showModal: function (id, component, props) {
      // console.log("1111=", component);
      dispatch(showModal(id, component, props));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CollasibleDate);

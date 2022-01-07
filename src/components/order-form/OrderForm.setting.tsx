import {
  Dropdown,
  FixedDropdown,
  InputTextInline,
  Menu,
  MenuItem,
  SelectDropdown,
} from "@/ui-components";
import React from "react";
import { connect } from "react-redux";

const OrderSetting = ({}) => {
  const options = [
    {
      value: "BTCUSDT",
      label: "BTCUSDT",
    },
    {
      value: "ETHUSDT",
      label: "ETHUSDT",
    },
  ];

  return (
    <FixedDropdown
      title={<span className="fa fa-cog p-5 text--white"></span>}
      contentClasses="order-book__setting-menu"
      alignContent="right"
    >
      <Menu>
        <MenuItem
          spaceBottom={true}
          content={
            <div className="orderbook__level-group">
              <div className="orderbook__input-group">
                <label className="label">Option</label>
                <SelectDropdown options={options} />
              </div>
            </div>
          }
        />
      </Menu>
    </FixedDropdown>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({});

export const OrderSettingDropdown = connect(
  mapStateToProps,
  mapDispatchToProps
)(OrderSetting);

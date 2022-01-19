import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { updateOrderEntry } from "@/actions/order.actions";
import {
  Dropdown,
  FixedDropdown,
  InputTextInline,
  Menu,
  MenuItem,
  SelectDropdown,
} from "@/ui-components";
import React from "react";
import { connect, useDispatch } from "react-redux";

const OrderSetting = ({ formSetting }) => {
  const { pair, formId, expiryDate } = formSetting;
  const dispatch = useDispatch();

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

  const selected = options.find((e) => e.value === pair);

  const onOptionChange = ({ value }) => {
    dispatch(updateOrderEntry({ formId, symbol: value, expiryDate }));
  };

  const onChangeExpiryDate = (date) => {
    dispatch(updateOrderEntry({ formId, symbol: pair, expiryDate: date }));
  };

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
            <div className="orderform_setting">
              <div className="orderform_setting__input-group">
                <label className="label">Option</label>
                <SelectDropdown
                  options={options}
                  value={selected}
                  onChange={onOptionChange}
                />
              </div>
              <div className="orderform_setting__input-group">
                <label className="label">Expired Date</label>
                <DatePicker
                  selected={expiryDate}
                  onChange={onChangeExpiryDate}
                />
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

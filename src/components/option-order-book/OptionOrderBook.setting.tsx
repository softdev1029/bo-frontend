import { selectDate, selectOption } from "@/actions/ui-setting.actions";
import { getSetting } from "@/selectors/ui-setting.selectors";
import {
  FixedDropdown,
  InputDatePicker,
  Menu,
  MenuItem,
  SelectDropdown,
  Button,
} from "@/ui-components";
import React, { useCallback, useEffect, useState } from "react";
import { connect } from "react-redux";
import { Symbols } from "@/models/order.model";

interface OptionType {
  value: string;
  label: string;
}
const OptionBookSetting = ({ title, selectedSetting, selectOption }) => {
  const options = [
    {
      value: Symbols.OPTION,
      label: Symbols.OPTION,
    },
    {
      value: Symbols.FUTURES,
      label: Symbols.FUTURES,
    },
    {
      value: Symbols.SPOT,
      label: Symbols.SPOT,
    },
  ];

  const [selected, setSelected] = useState<OptionType | undefined>(undefined);
  const [date, setDate] = useState<string | number>("");

  let titleText = "Order Book";
  if (selectedSetting) {
    titleText = `${selectedSetting.selected?.value} - ${selectedSetting.date}`;
  }

  const handleDateChange = (date: string | number) => {
    setDate(date);
  };

  return (
    <FixedDropdown
      title={titleText}
      contentClasses="order-book__setting-menu"
      alignContent="right"
    >
      <Menu>
        <MenuItem
          content={
            <div>
              <SelectDropdown
                options={options}
                value={selected}
                onChange={(option) => setSelected(option as OptionType)}
              />
            </div>
          }
        />
        <MenuItem
          content={
            <div className="d-flex d-justify-content-space-between w-100">
              <InputDatePicker
                className="w-100"
                onChange={(date) => handleDateChange(date)}
              />
            </div>
          }
        />
        <MenuItem
          content={
            <div className="d-flex d-justify-content-space-between w-100">
              <Button
                classes="btn primary"
                onClick={() => selectOption({ selected, date })}
              >
                Ok
              </Button>
            </div>
          }
        />
      </Menu>
    </FixedDropdown>
  );
};

const mapStateToProps = (state) => ({
  scrollable: getSetting(state)("orderbook_scrollable"),
  selectedSetting: getSetting(state)("option_ordersetting"),
});

const mapDispatchToProps = (dispatch) => ({
  selectOption: function (option, persist?: boolean) {
    console.log(option.date);

    dispatch(
      selectOption({
        key: "option_ordersetting",
        option,
        persist: false,
      })
    );
  },
});

export const OptionBookSettingDropdown = connect(
  mapStateToProps,
  mapDispatchToProps
)(OptionBookSetting);

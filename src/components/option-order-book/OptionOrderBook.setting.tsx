import { selectOption } from "@/actions/ui-setting.actions";
import { getSetting } from "@/selectors/ui-setting.selectors";
import {
  FixedDropdown,
  Menu,
  MenuItem,
  SelectDropdown,
  Button,
} from "@/ui-components";
import React, { useState } from "react";
import { connect } from "react-redux";
import { Options, Symbols } from "@/models/order.model";

interface OptionType {
  value: string;
  label: string;
}
const OptionBookSetting = ({ selectedOption, selectOption }) => {
  const options = [
    {
      value: Options.BTC,
      label: Options.BTC,
    },
    {
      value: Options.ETH,
      label: Options.ETH,
    },
    {
      value: Options.XRP,
      label: Options.XRP,
    },
  ];

  const date_options = [
    {
      value: "01 Feb 2022",
      label: "01 Feb 2022",
    },
    {
      value: "01 Feb 2022",
      label: "01 Feb 2022",
    },
    {
      value: "01 Feb 2022",
      label: "01 Feb 2022",
    },
  ];

  const [selected, setSelected] = useState<OptionType | undefined>(undefined);
  const [date, setDate] = useState<OptionType | undefined>(undefined);

  let titleText = "Order Book";
  if (selectedOption) {
    titleText = `${
      selectedOption.selected === undefined
        ? "Order Book "
        : selectedOption.selected?.value
    } - ${selectedOption.date === undefined ? "" : selectedOption.date.value}`;
  }

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
              <label htmlFor="">Option</label>
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
            <div>
              <label htmlFor="">Expiration Date</label>
              <SelectDropdown
                options={date_options}
                value={date}
                onChange={(option) => setDate(option as OptionType)}
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
  selectedOption: getSetting(state)("option_ordersetting"),
});

const mapDispatchToProps = (dispatch) => ({
  selectOption: function (option, persist?: boolean) {
    dispatch(
      selectOption({
        key: "option_ordersetting",
        option,
        persist: false,
      })
    );
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(OptionBookSetting);

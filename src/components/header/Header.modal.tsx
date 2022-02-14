import { selectOption } from "@/actions/ui-setting.actions";
import { Options, Symbols } from "@/models/order.model";
import { getSetting } from "@/selectors/ui-setting.selectors";
import {
  ConfirmModal,
  Menu,
  MenuItem,
  SelectDropdown,
  toast,
} from "@/ui-components";
import React, { useState } from "react";
import { connect } from "react-redux";

interface HeaderModalProps {
  closePopup?: (id?: string) => void;
  popupId?: string;
  onAccept?: () => void;
  selectOption?: (option) => void;
}

interface OptionType {
  value: string;
  label: string;
}

const HeaderModal = ({ popupId, onAccept, selectOption }: HeaderModalProps) => {
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
      value: "02 Jan 2022",
      label: "02 Jan 2022",
    },
    {
      value: "03 Jan 2022",
      label: "03 Jan 2022",
    },
  ];

  const [selected, setSelected] = useState<OptionType | undefined>(undefined);
  const [date, setDate] = useState<OptionType | undefined>(undefined);

  const renderBody = () => {
    return (
      <div>
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
        </Menu>
      </div>
    );
  };

  const handleAccept = () => {
    if (selected && date) {
      if (onAccept) {
        onAccept();
      }
      selectOption({ selected, date });
    } else {
      toast.error("We need to select Option & Expiration Date as well");
    }
  };

  return (
    <ConfirmModal
      title={"Order Entry"}
      mId={popupId}
      initWidth={280}
      useLegacyBtns={true}
      cancelText="Cancel"
      okText="Save"
      onAccept={handleAccept}
      // popupData={this.getCurrentValue()}
    >
      {renderBody}
    </ConfirmModal>
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
        persist: true,
      })
    );
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(HeaderModal);

import React, { useState } from "react";
import { InputRangeSlider } from "@/ui-components/ui/inputs";
import GroupInput from "./OrderForm.group-input";

const QuantitySlider = ({
  label,
  min,
  max,
  value,
  valueLabel,
  isValueEditable = false,
  numberRegex = null,
  onChange,
}) => {
  const [sliderValue, setSliderValue] = useState(value);

  const handleChange = (value) => {
    setSliderValue(value);
    onChange(value);
  };

  return (
    <div className="order-form__quantity-slider">
      {isValueEditable ? (
        <GroupInput
          type="numeric"
          useHandlers={true}
          pattern={numberRegex}
          value={sliderValue}
          onChange={handleChange}
          addonAfter={"X"}
          addonBefore={"Leverage"}
          step={1}
          min={1}
          max={150}
        />
      ) : (
        <div className="lbl-amount">
          <div>{label}</div>
          <div className="lbl-value">
            {sliderValue}
            {valueLabel}
          </div>
        </div>
      )}

      <InputRangeSlider
        value={sliderValue}
        min={min}
        max={max}
        onChange={handleChange}
      />
    </div>
  );
};

export default React.memo(QuantitySlider);

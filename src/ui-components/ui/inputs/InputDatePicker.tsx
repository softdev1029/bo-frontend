import React, { ChangeEvent } from "react";

interface InputDateProps {
  onChange: (value: string | number) => void;
  className?: string;
}

export const InputDatePicker = ({
  onChange,
  className,
}: Partial<InputDateProps>) => {
  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.validity.valid) {
      let newValue = e.target.value;
      onChange(newValue);
    }
  };

  return (
    <>
      <input
        type="date"
        className={`${className}`}
        onChange={onInputChange as (e: ChangeEvent<HTMLInputElement>) => void}
      />
    </>
  );
};

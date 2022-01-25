import React from "react";
import classNames from "classnames";
import { InputTextInline } from "@/ui-components";

const GroupInput = (props) => {
  const inputGroupWrapperClasses = classNames("form-input__group__container", {
    "form-input__group__container--disabled": props.disabled,
  });

  // const inputProps = _pick(props, ['pattern', 'value', 'onChange', 'disabled'])
  return (
    <div
      className={classNames("form-input", {
        "form-input--no-input": props.noInput,
      })}
    >
      <span className={inputGroupWrapperClasses}>
        <span className="form-input__wrapper">
          {props.addonBefore && (
            <span className="form-input__addonBefore">{props.addonBefore}</span>
          )}
          <InputTextInline
            type="number"
            useHandlers={!props.noInput}
            {...props}
          />
          {props.addonAfter && (
            <span className="form-input__addonAfter">{props.addonAfter}</span>
          )}
        </span>
      </span>
    </div>
  );
};

export default GroupInput;

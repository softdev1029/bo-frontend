import { SymbolType } from "@/constants/symbol-enums";
import React from "react";
import { OrderFormDerivative } from "./OrderForm.derivative";
import OrderFormSpot from "./OrderForm.spot";
import { OrderFormProps } from "./OrderForm.types";

export const OrderForm = (props: OrderFormProps) => {
  let { pair } = props;

  switch (props.wallet) {
    case SymbolType.SPOT: {
      return <OrderFormSpot {...props} pair={pair} />;
    }
    case SymbolType.DERIVATIVE: {
      return <OrderFormDerivative {...props} pair={pair} />;
    }
  }

  return null;
};

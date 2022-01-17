import { createNewOrderEntry } from "@/actions/order.actions";
import { Dropdown, DropdownPosition, Icon, Menu } from "@/ui-components";
import React from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

export const HeaderMenuSection = () => {
  const dispatch = useDispatch();

  const title = (
    <div className="d-flex d-align-items-center cpn-header__menu__button">
      <div className="username">Main Menu</div>
    </div>
  );

  return (
    <Dropdown
      hoverable={true}
      title={title}
      arrowClass="icon-arrow_down_icon font-size-16"
      displayArrow={true}
      contentClasses="cpn-header__account__content"
      position={DropdownPosition.LEFT}
    >
      <Menu>
        <div className="account__content_item">
          <Link to="#">
            <Icon id="wallet" cssmodule="fal" />
            <span
              className="font-bold"
              onClick={() => {
                dispatch(createNewOrderEntry());
              }}
            >
              Order Entry
            </span>
          </Link>
        </div>
        <div className="account__content_item">
          <Link to="#">
            <Icon id="usd-circle" cssmodule="fal" />
            <span className="font-bold">Chart</span>
          </Link>
        </div>
      </Menu>
    </Dropdown>
  );
};

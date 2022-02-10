import { showModal } from "@/actions/app.actions";
import { createNewOrderEntry } from "@/actions/order.actions";
import { Dropdown, DropdownPosition, Icon, Menu, toast } from "@/ui-components";
import React, { useEffect } from "react";
import { connect, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import HeaderModal from "./Header.modal";

import { useBeforeunload } from "react-beforeunload";

const HeaderMenuSectionProvider = ({ showModal }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(createNewOrderEntry());
  }, []);

  const title = (
    <div className="d-flex d-align-items-center cpn-header__menu__button">
      <div className="username">Main Menu</div>
    </div>
  );

  useBeforeunload((ev) => {
    const tabCount = sessionStorage.getItem("tabCount");

    if (tabCount && parseInt(tabCount) > 0) {
      sessionStorage.setItem("tabCount", (parseInt(tabCount) - 1).toString());
    } else {
      sessionStorage.setItem("tabCount", "0");
    }
  });

  const handleAcceptNewTab = () => {
    const tabCount = sessionStorage.getItem("tabCount");

    if (tabCount === "5") {
      toast.error("The maximum tab count is 5");
      return;
    }
    if (!tabCount || tabCount === "0") {
      sessionStorage.setItem("tabCount", "2");
    } else {
      sessionStorage.setItem("tabCount", (parseInt(tabCount) + 1).toString());
    }
    window.open(window.location.pathname, "_blank");
  };

  const handleDisplayModal = () => {
    showModal("option-modal-menu-popup", HeaderModal, {
      popupId: "option-modal-menu-popup",
      onAccept: () => {
        handleAcceptNewTab();
      },
    });
  };

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
        <div className="account__content_item">
          <Link to="#">
            <Icon id="external-link" cssmodule="fal" />
            <span className="font-bold" onClick={handleDisplayModal}>
              Open New Tab
            </span>
          </Link>
        </div>
      </Menu>
    </Dropdown>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => {
  return {
    showModal: function (id, component, props) {
      dispatch(showModal(id, component, props));
    },
  };
};

export const HeaderMenuSection = connect(
  mapStateToProps,
  mapDispatchToProps
)(HeaderMenuSectionProvider);

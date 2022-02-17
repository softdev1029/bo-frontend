/**
 * bring dropdown_content to fixed layer
 * used in overflow: hidden container (table virtualized, resizer sensor for example)
 */
import React, {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import classNames from "classnames";
import _isString from "lodash/isString";
import ReactDOM from "react-dom";
import { getPosition } from "@/exports";
import {
  getCurrentOffset,
  getDimensions,
  getRelativeCoordinates,
} from "@/exports/get-elm-position";
import _isFunction from "lodash/isFunction";

export enum FixedDropdownPosition {
  LEFT = "left",
  TOP = "top",
  BOTTOM = "bottom",
  RIGHT = "right",
}

interface FixedDropdownProps {
  children: Function | ReactNode;
  defaultOpen: boolean;
  title: ReactNode;
  displayArrow: boolean;
  position: FixedDropdownPosition;
  contentHeader: ReactNode;
  contentClasses: string;
  titleClasses: string;
  arrowClass: string;
  offsetLeft: number;
  alignContent: "left" | "right" | "center";
  labelRef?: React.MutableRefObject<HTMLLabelElement>;
}

const stopPropagation = (e) => e.stopPropagation();

export const FixedDropdown = React.memo(
  ({
    children,
    defaultOpen = false,
    title,
    displayArrow = false,
    position = FixedDropdownPosition.BOTTOM,
    contentHeader,
    contentClasses,
    titleClasses,
    arrowClass,
    offsetLeft = 0,
    alignContent,
    labelRef = null,
  }: Partial<FixedDropdownProps>) => {
    const [isOpen, setOpen] = useState(defaultOpen);
    const [stylePos, setStylePos] = useState({ top: 0, left: 0 });
    const [place, setPlace] = useState(position);

    const contentRef = useRef<HTMLDivElement>();

    const checkRefPosition = (e, node) => {
      const { width, height, left, top } = node.getBoundingClientRect();
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      console.log(
        "width: ",
        width,
        "height: ",
        height,
        "left: ",
        left,
        "top: ",
        top,
        "mouseX: ",
        mouseX,
        "mouseY: ",
        mouseY
      );
      return (
        mouseX > left &&
        mouseX < left + width &&
        mouseY > top &&
        mouseY < top + height + 30
      );
    };

    useEffect(() => {
      const checkIfClickedOutside = (e) => {
        // If the menu is open and the clicked target is not within the menu,
        // then close the menu

        const isOutside = checkRefPosition(e, contentRef.current);
        console.log(isOutside);

        if (
          isOpen &&
          contentRef.current &&
          !contentRef.current.contains(e.target) &&
          !isOutside
        ) {
          setOpen(false);
          setStylePos({
            top: 0,
            left: 0,
          });
        }
      };

      document.addEventListener("mousedown", checkIfClickedOutside);

      return () => {
        // Cleanup the event listener
        document.removeEventListener("mousedown", checkIfClickedOutside);
      };
    }, [isOpen]);

    const toggleContent = useCallback(
      (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!contentRef.current) return;

        const result = getPosition(
          e,
          e.target,
          contentRef.current,
          place,
          place,
          alignContent
        );

        //todo update content's dimension from ref, removed hardcoded value
        setOpen(!isOpen);

        if (isOpen) {
          setStylePos({
            top: 0,
            left: 0,
          });
          return;
        }

        // if (result.isNewState) {
        //   setPlace(result.newState.place as FixedDropdownPosition);
        // }
        if (result.position) {
          const { left, top } = result.position;

          setStylePos({
            top,
            left: left - offsetLeft,
          });
        }
      },
      [isOpen, setOpen, setStylePos, contentRef, place, offsetLeft]
    );

    const secondDropdownClass = classNames("cpn-dropdown", {
      "pos-abs": true,
      show: isOpen,
    });

    const contentClsses = classNames(
      "cpn-dropdown__content",
      "hiddencontent",
      contentClasses
    );
    const arrowClsses = !!arrowClass ? arrowClass : "icon-dropdown_arrow_down";

    const _title = _isString(title) ? (
      <span className="text--white">{title}</span>
    ) : (
      title
    );
    const titleCls = `cpn-dropdown__button ${titleClasses}`;

    const content = ReactDOM.createPortal(
      <div className={secondDropdownClass}>
        <div
          style={{ ...stylePos, padding: 0 }}
          className={contentClsses}
          ref={contentRef}
        >
          {contentHeader && (
            <div className="cpn-dropdown__header mb-10">{contentHeader}</div>
          )}
          {_isFunction(children) ? children({ toggleContent }) : children}
        </div>
      </div>,
      document.body
    );

    return (
      <div className="cpn-dropdown">
        <div className="cpn-dropdown__wrapper">
          <label
            ref={labelRef}
            className={titleCls}
            onClick={toggleContent}
            onMouseDown={stopPropagation}
          >
            {_title}
            {displayArrow && (
              <span className="cpn-dropdown__arrow">
                <span className={arrowClsses}></span>
              </span>
            )}
          </label>
          {content}
        </div>
      </div>
    );
  }
);

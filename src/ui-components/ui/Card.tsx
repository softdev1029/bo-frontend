import React, { ReactNode, useCallback } from "react";
import classNames from "classnames";
import IconButton from "./IconButton";

interface CardProps {
  cardIdentify?: any;
  children: ReactNode;
  title?: ReactNode;
  rightTool?: ReactNode;
  resizable?: boolean;
  closable?: boolean;
  transparent?: boolean;
  draggable?: boolean;
  onClose?: (identiy?: any) => void;
  className?: string;
  contentPadding?: boolean;
  titleClickable?: boolean;
}

const iconClass = [];

export const Card = ({
  cardIdentify,
  title = "Title",
  className,
  rightTool,
  children,
  titleClickable = false,
  resizable = true,
  draggable = true,
  closable,
  onClose,
  transparent = true,
  contentPadding = true,
}: CardProps) => {
  const cardClass = classNames("card", className, {
    transparent: resizable && transparent,
  });

  const titleClass = classNames("card__title__ctn", {
    draggable: draggable,
  });

  const contentClass = classNames("card__content", {
    card__content__padding: contentPadding,
  });

  const onCloseBtnClick = useCallback(
    (e: any) => {
      onClose(cardIdentify);
    },
    [onClose, cardIdentify]
  );

  return (
    <div className={cardClass}>
      <div className={titleClass}>
        <div className="card__title h-100 d-flex d-align-items-center">
          {!titleClickable ? (
            title
          ) : (
            <span onClick={() => console.log(title)}>{title}</span>
          )}
        </div>
        <div className="icons-right">
          {rightTool}
          {closable && (
            <IconButton
              id="times"
              classes="clickable p-5"
              onClick={onCloseBtnClick}
            />
          )}
        </div>
      </div>
      <div className={contentClass}>{children}</div>
    </div>
  );
};

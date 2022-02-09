import React, { ReactNode } from "react";
import { Rnd } from "react-rnd";

interface RndBoxProps {
  children: ReactNode;
  dragAxis?: "x" | "y" | "both" | "none";
  disableDragging?: boolean;
}

const RndBox = ({
  children,
  dragAxis,
  disableDragging = false,
}: RndBoxProps) => {
  return (
    <Rnd
      default={{
        x: 0,
        y: 0,
        width: "100%",
        height: 200,
      }}
      disableDragging={disableDragging}
      dragAxis={dragAxis}
      enableResizing={{
        right: false,
        left: false,
        top: true,
        bottom: true,
      }}
    >
      <div
        style={{
          overflow: "scroll",
          height: "100%",
        }}
      >
        {children}
      </div>
    </Rnd>
  );
};

export default RndBox;

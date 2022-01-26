import React from "react";

const LinkTo = ({ to, children, ...props }) => {
  const handleClick = () => {
    window.location.href = to;
  };
  return (
    // eslint-disable-next-line jsx-a11y/anchor-is-valid
    <a href="#" {...props} onClick={handleClick}>
      {children}
    </a>
  );
};

export default LinkTo;

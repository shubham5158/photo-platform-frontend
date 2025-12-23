import React from "react";

const Skeleton = ({
  className = "",
  rounded = "rounded-md",
}) => {
  return (
    <div
      className={`bg-slate-200 animate-pulse ${rounded} ${className}`}
    />
  );
};

export default Skeleton;

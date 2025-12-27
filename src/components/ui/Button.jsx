import React from "react";

const PillButton = ({
  children,
  variant = "light",
  active = false,
  onClick,
  className = "",
}) => {
  const base =
    "px-6 py-2 rounded-full font-semibold text-sm transition-all duration-200";

  const variants = {
    light: active
      ? "bg-white text-black shadow"
      : "bg-white/80 text-black hover:bg-white",
    primary: active
      ? "bg-orange-500 text-white shadow"
      : "bg-orange-500/90 text-white hover:bg-orange-500",
  };

  return (
    <button
      onClick={onClick}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default PillButton;

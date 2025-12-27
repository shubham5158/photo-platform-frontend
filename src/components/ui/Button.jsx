import React from "react";

const PillButton = ({
  children,
  variant = "client",
  onClick,
  className = "",
}) => {
  const base =
    "px-6 py-2 rounded-full text-sm font-medium transition-colors duration-200";

  const styles = {
    client:
      "bg-white text-black border border-gray-300 hover:bg-gray-100",
    admin:
      "bg-orange-500 text-white hover:bg-orange-600",
  };

  return (
    <button
      onClick={onClick}
      className={`${base} ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default PillButton;

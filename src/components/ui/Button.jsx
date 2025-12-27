import React from "react";
import clsx from "clsx";

const Button = ({
  children,
  variant = "primary", // primary | outline | ghost
  size = "md", // sm | md | lg
  loading = false,
  disabled = false,
  className = "",
  onClick,
  type = "button",
}) => {
  const base =
    "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";

  const variants = {
    primary:
      "bg-primary text-primary-foreground hover:bg-primary/90",
    outline:
      "border border-border bg-background hover:bg-muted hover:text-foreground",
    ghost:
      "bg-transparent hover:bg-muted",
  };

  const sizes = {
    sm: "h-9 px-3 text-sm rounded-md",
    md: "h-10 px-4 text-sm rounded-md",
    lg: "h-11 px-8 text-base rounded-lg",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={clsx(base, variants[variant], sizes[size], className)}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
      )}
      {children}
    </button>
  );
};

export default Button;

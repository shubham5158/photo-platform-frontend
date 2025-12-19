import React from "react";

const CustomToast = ({ icon, message, type }) => {
  const base =
    "px-4 py-3 rounded-lg shadow-xl flex items-center gap-3 animate-fade-in-up border backdrop-blur-md";

  const styles = {
    success: "bg-emerald-600/90 border-emerald-300 text-white",
    error: "bg-red-600/90 border-red-300 text-white",
    warning: "bg-yellow-500/90 border-yellow-200 text-black",
    info: "bg-blue-600/90 border-blue-300 text-white",
    loading: "bg-slate-800/90 border-slate-600 text-white",
  };

  return (
    <div className={`${base} ${styles[type]}`}>
      <span className="text-xl">{icon}</span>
      <span className="text-sm">{message}</span>
    </div>
  );
};

export default CustomToast;

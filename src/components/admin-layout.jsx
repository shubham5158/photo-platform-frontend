import React, { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth-context.jsx";

const navItems = [
  { to: "/admin", label: "Dashboard", exact: true },
  { to: "/admin/events", label: "Events" },
  { to: "/admin/discounts", label: "Discounts" },
  { to: "/admin/orders", label: "Orders" },
];

const AdminLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const isActive = (itemTo) => {
    if (itemTo === "/admin") {
      return location.pathname === "/admin" || location.pathname === "/admin/";
    }
    return location.pathname.startsWith(itemTo);
  };

  return (
    <div className="min-h-screen flex bg-slate-100">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-50 flex flex-col">
        <div className="px-6 py-4 border-b border-slate-800">
          <h1 className="text-xl font-semibold tracking-wide">
            Photo Admin
          </h1>
          <p className="text-xs text-slate-400">
            Wedding Delivery System
          </p>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-1">
          {navItems.map((item) => {
            const active = isActive(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`block px-3 py-2 rounded-md text-sm font-medium ${
                  active
                    ? "bg-slate-800 text-amber-300"
                    : "text-slate-200 hover:bg-slate-800 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-4 py-3 border-t border-slate-800">
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-2 text-sm rounded-md"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-lg font-semibold text-slate-900">
              Confirm Logout
            </h2>

            <p className="text-sm text-slate-600 mt-2">
              You are about to log out of the admin panel.
              You will need to log in again to continue managing events.
            </p>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 text-sm rounded-md border border-slate-300 hover:bg-slate-100"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  setShowLogoutConfirm(false);
                  handleLogout();
                }}
                className="px-4 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLayout;

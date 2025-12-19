// src/components/admin-layout.jsx
import React from "react";
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
          <p className="text-xs text-slate-400">Wedding Delivery System</p>
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
            onClick={handleLogout}
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
    </div>
  );
};

export default AdminLayout;

// src/pages/admin/admin-home-page.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getEventsApi } from "../../api/Events.jsx";
import { getAdminOrdersApi } from "../../api/Orders.jsx";
import { toastError } from "../../utils/toast.jsx";
import { useAuth } from "../../context/auth-context.jsx";

const AdminHomePage = () => {
  const { user } = useAuth(); // ⭐ Logged-in user
  const [events, setEvents] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
  try {
    setLoading(true);
    const [eventsData, ordersData] = await Promise.all([
      getEventsApi(),
      getAdminOrdersApi(),
    ]);

    setEvents(eventsData?.events || []);
    setOrders(ordersData || []);
  } catch (err) {
    console.error(err);
    toastError("Failed to load dashboard data");
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    load();
  }, []);

  const totalEvents = events.length;
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce(
    (sum, o) => sum + (o.netAmount || 0),
    0
  );

  const recentEvents = events.slice(0, 5);
  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-8">

      {/* Hero / Portfolio Section */}
      <section className="relative overflow-hidden rounded-2xl bg-slate-900 text-slate-50 p-6 md:p-8">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top,#fbbf24,transparent_60%),radial-gradient(circle_at_bottom,#0f172a,transparent_50%)]" />

        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-amber-300 mb-2">
              Admin Portfolio
            </p>

            {/* ⭐ SHOW LOGGED-IN USER NAME */}
            <h1 className="text-2xl md:text-3xl font-semibold mb-2">
              Welcome back, {user?.name || "Photographer"} 👋
            </h1>

            <p className="text-sm md:text-base text-slate-300 max-w-xl">
              Manage your wedding and event galleries, track client selections,
              and deliver final photos — all from one beautiful dashboard.
            </p>

            <div className="flex flex-wrap gap-3 mt-4">
              <Link
                to="/admin/events"
                className="inline-flex items-center px-4 py-2 rounded-full bg-amber-400 text-slate-900 text-sm font-semibold hover:bg-amber-300"
              >
                Create New Event
              </Link>

              <Link
                to="/admin/orders"
                className="inline-flex items-center px-4 py-2 rounded-full border border-slate-500 text-sm text-slate-100 hover:bg-slate-800"
              >
                View Orders
              </Link>
            </div>
          </div>

          {/* Dashboard Stats */}
          <div className="grid grid-cols-3 gap-3 min-w-[220px] max-w-xs">
            <div className="rounded-xl bg-slate-800/80 p-3 text-center">
              <div className="text-xs text-slate-400 mb-1">Events</div>
              <div className="text-2xl font-semibold text-amber-300">
                {totalEvents}
              </div>
            </div>

            <div className="rounded-xl bg-slate-800/80 p-3 text-center">
              <div className="text-xs text-slate-400 mb-1">Orders</div>
              <div className="text-2xl font-semibold text-emerald-300">
                {totalOrders}
              </div>
            </div>

            <div className="rounded-xl bg-slate-800/80 p-3 text-center">
              <div className="text-xs text-slate-400 mb-1">Revenue</div>
              <div className="text-lg font-semibold text-sky-300">
                ₹{totalRevenue}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats + Recent Activity */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Events */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-slate-900">
              Recent Events
            </h2>
            <Link
              to="/admin/events"
              className="text-xs text-slate-500 hover:text-slate-800"
            >
              View all
            </Link>
          </div>

          {!loading && recentEvents.length ? (
            <ul className="divide-y divide-slate-100">
              {recentEvents.map((e) => (
                <li key={e._id} className="py-2 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-slate-900">
                      {e.name}
                    </div>
                    <div className="text-xs text-slate-500">
                      {e.clientName}
                    </div>
                  </div>
                  <Link
                    to={`/admin/events/${e._id}/photos`}
                    className="text-xs underline text-slate-700"
                  >
                    Photos
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-sm text-slate-500">No events found.</div>
          )}
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <h2 className="text-base font-semibold mb-3">Recent Orders</h2>

          {!loading && recentOrders.length ? (
            <ul className="space-y-2 text-sm">
              {recentOrders.map((o) => (
                <li key={o._id} className="border border-slate-100 rounded-lg px-3 py-2">
                  <div className="text-xs text-slate-600">
                    {o.quantity} photos • ₹{o.netAmount}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-sm text-slate-500">No orders yet.</div>
          )}
        </div>
      </section>
    </div>
  );
};

export default AdminHomePage;

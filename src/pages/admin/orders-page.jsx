import React, { useEffect, useState } from "react";
import { getAdminOrdersApi } from "../../api/Orders.jsx";
import { toastError } from "../../utils/toast.jsx";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const data = await getAdminOrdersApi();
      setOrders(data);
    } catch (err) {
      toastError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900">
          Orders & Downloads
        </h1>
        <p className="text-sm text-slate-600">
          Track which clients have selected and downloaded photos.
        </p>
      </header>

      <section className="bg-white rounded-xl border border-slate-200 p-4">
        {loading && (
          <div className="text-sm text-slate-500 mb-2">
            Loading orders...
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-3 py-2">Order</th>
                <th className="text-left px-3 py-2">Event</th>
                <th className="text-left px-3 py-2">Client</th>
                <th className="text-left px-3 py-2">Qty</th>
                <th className="text-left px-3 py-2">Amount</th>
                <th className="text-left px-3 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id} className="border-b border-slate-100">
                  <td className="px-3 py-2 font-mono text-xs">{o._id}</td>
                  <td className="px-3 py-2">{o.event?.name}</td>
                  <td className="px-3 py-2">{o.clientEmail}</td>
                  <td className="px-3 py-2">{o.quantity}</td>
                  <td className="px-3 py-2">₹{o.netAmount}</td>
                  <td className="px-3 py-2">
                    <span className="inline-flex items-center rounded-full bg-emerald-100 text-emerald-700 px-2 py-0.5 text-xs">
                      {o.status}
                    </span>
                  </td>
                </tr>
              ))}
              {!orders.length && !loading && (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center text-slate-500 text-sm py-4"
                  >
                    No orders yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default OrdersPage;

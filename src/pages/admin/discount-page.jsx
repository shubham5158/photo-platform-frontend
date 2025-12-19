import React, { useEffect, useState } from "react";
import {
  getGlobalDiscountApi,
  updateGlobalDiscountApi,
} from "../../api/Discounts.jsx";
import { toastSuccess, toastError } from "../../utils/toast.jsx";

const DiscountPage = () => {
  const [name, setName] = useState("Default Discounts");
  const [tiers, setTiers] = useState([
    { minQty: 1, maxQty: 1, discountPercent: 0 },
    { minQty: 2, maxQty: 20, discountPercent: 5 },
    { minQty: 21, maxQty: 999, discountPercent: 10 },
  ]);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const rule = await getGlobalDiscountApi();
    if (rule) {
      setName(rule.name);
      setTiers(rule.tiers);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleTierChange = (i, field, value) => {
    setTiers((prev) =>
      prev.map((t, idx) => (idx === i ? { ...t, [field]: Number(value) } : t))
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateGlobalDiscountApi({ name, tiers });
      toastSuccess("Discount rule saved!");
    } catch {
      toastError("Failed to save rule");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900">
          Discount Rules
        </h1>
        <p className="text-sm text-slate-600">
          Configure per-photo quantity discounts for all galleries.
        </p>
      </header>

      <section className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="mb-4">
          <label className="block text-sm mb-1 text-slate-700">Rule name</label>
          <input
            className="border border-slate-300 rounded-md px-3 py-2 text-sm"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <table className="min-w-full text-sm border border-slate-200 rounded-md overflow-hidden">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-3 py-2">Min Qty</th>
              <th className="text-left px-3 py-2">Max Qty</th>
              <th className="text-left px-3 py-2">Discount %</th>
            </tr>
          </thead>
          <tbody>
            {tiers.map((tier, i) => (
              <tr key={i} className="border-b border-slate-100">
                <td className="px-3 py-2">
                  <input
                    type="number"
                    value={tier.minQty}
                    onChange={(e) =>
                      handleTierChange(i, "minQty", e.target.value)
                    }
                    className="border border-slate-300 rounded-md px-2 py-1 text-sm w-24"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    value={tier.maxQty}
                    onChange={(e) =>
                      handleTierChange(i, "maxQty", e.target.value)
                    }
                    className="border border-slate-300 rounded-md px-2 py-1 text-sm w-24"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    value={tier.discountPercent}
                    onChange={(e) =>
                      handleTierChange(i, "discountPercent", e.target.value)
                    }
                    className="border border-slate-300 rounded-md px-2 py-1 text-sm w-24"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button
          onClick={handleSave}
          disabled={saving}
          className="mt-4 px-4 py-2 rounded-md text-sm bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save rule"}
        </button>
      </section>
    </div>
  );
};

export default DiscountPage;

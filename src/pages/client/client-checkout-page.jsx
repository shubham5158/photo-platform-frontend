import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getPricePreviewApi } from "../../api/Gallery.jsx";
import { createOrderFromGalleryApi } from "../../api/Orders.jsx";
import { toastSuccess, toastError } from "../../utils/toast.jsx";
import toast from "react-hot-toast";

const ClientCheckoutPage = () => {
  const { code } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const selectedIds = location.state?.selectedIds || [];
  const [pricing, setPricing] = useState(null);
  const [email, setEmail] = useState("");
  const [loadingPrice, setLoadingPrice] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!selectedIds.length) {
      navigate(`/g/${code}`);
      return;
    }
    const loadPrice = async () => {
      try {
        const price = await getPricePreviewApi(code, selectedIds);
        setPricing(price);
        toastSuccess("Price loaded");
      } catch {
        toastError("Could not load price");
      } finally {
        setLoadingPrice(false);
      }
    };
    loadPrice();
  }, [code, selectedIds]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toastError("Email required");

    const t = toast.loading("Creating order...");
    try {
      const order = await createOrderFromGalleryApi(code, selectedIds, email);
      toast.dismiss(t);
      toastSuccess("Order created!");

      navigate(`/download/${order.downloadToken}`, {
        state: { orderId: order.orderId },
      });
    } catch {
      toast.dismiss(t);
      toastError("Order failed");
    }
  };

  if (loadingPrice)
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-50">
        Calculating price...
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex justify-center items-center px-4">
      <div className="bg-slate-900/80 border border-slate-700 p-6 rounded-xl max-w-lg w-full">
        <h1 className="text-xl font-semibold mb-3">Checkout</h1>

        <p className="text-sm text-slate-300 mb-4">
          You selected {selectedIds.length} photos.
        </p>

        {pricing && (
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm space-y-1">
            <div>Base price: ₹{pricing.basePrice}</div>
            <div>Gross: ₹{pricing.gross}</div>
            <div>Discount: {pricing.discountPercent}% (₹{pricing.discountAmount})</div>
            <div className="font-semibold text-amber-300">
              Total: ₹{pricing.net}
            </div>
          </div>
        )}

        <form className="space-y-3 mt-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm">Your Email</label>
            <input
              type="email"
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>

          <button
            disabled={submitting}
            className="w-full bg-amber-400 text-slate-900 py-2 rounded font-semibold"
          >
            {submitting ? "Processing..." : "Confirm & Get Download Link"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ClientCheckoutPage;

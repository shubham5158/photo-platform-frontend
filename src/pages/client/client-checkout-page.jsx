import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getPricePreviewApi } from "../../api/Gallery.jsx";
import { createOrderFromGalleryApi } from "../../api/Orders.jsx";
import { toastSuccess, toastError } from "../../utils/toast.jsx";
import toast from "react-hot-toast";
import CheckoutSkeleton from "../../components/ui/CheckoutSkeleton.jsx";
import { Lock, Mail, CheckCircle } from "lucide-react";

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
        toastSuccess("Pricing calculated");
      } catch {
        toastError("Could not load pricing");
      } finally {
        setLoadingPrice(false);
      }
    };

    loadPrice();
  }, [code, selectedIds]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toastError("Email required");

    setSubmitting(true);
    const t = toast.loading("Creating secure order...");
    try {
      const order = await createOrderFromGalleryApi(code, selectedIds, email);
      toast.dismiss(t);
      toastSuccess("Order confirmed");

      navigate(`/download/${order.downloadToken}`, {
        state: { orderId: order.orderId },
      });
    } catch {
      toast.dismiss(t);
      toastError("Order failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingPrice)
    return (
      <div className="min-h-screen bg-[#0b0b0d] flex items-center justify-center px-4">
        <CheckoutSkeleton />
      </div>
    );

  return (
    <div className="min-h-screen bg-[#0b0b0d] text-white flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-[#121215] border border-white/10 rounded-2xl shadow-xl p-6 md:p-8">
        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">
            Secure Checkout
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Your selected photos will be delivered in full resolution
          </p>
        </div>

        {/* SUMMARY */}
        <div className="rounded-xl bg-black/40 border border-white/10 p-4 text-sm space-y-1">
          <div className="flex justify-between">
            <span>Selected photos</span>
            <span>{selectedIds.length}</span>
          </div>
          <div className="flex justify-between">
            <span>Base price</span>
            <span>₹{pricing.basePrice}</span>
          </div>
          <div className="flex justify-between">
            <span>Gross</span>
            <span>₹{pricing.gross}</span>
          </div>
          <div className="flex justify-between text-amber-300">
            <span>Discount</span>
            <span>
              {pricing.discountPercent}% (₹{pricing.discountAmount})
            </span>
          </div>
          <div className="flex justify-between text-lg font-semibold text-amber-400 pt-2">
            <span>Total</span>
            <span>₹{pricing.net}</span>
          </div>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm mb-1 block text-neutral-300">
              Email for download link
            </label>
            <div className="relative">
              <Mail
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
              />
              <input
                type="email"
                className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-black/40 border border-white/10 focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <button
            disabled={submitting}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition
              ${
                submitting
                  ? "bg-neutral-600 text-neutral-300"
                  : "bg-amber-400 text-black hover:bg-amber-300"
              }`}
          >
            <Lock size={18} />
            {submitting ? "Processing..." : "Confirm & Get Download Link"}
          </button>
        </form>

        {/* TRUST */}
        <div className="mt-5 flex items-start gap-2 text-xs text-neutral-400">
          <CheckCircle size={16} className="text-amber-400 mt-0.5" />
          <p>
            Photos are delivered securely in original quality after confirmation.
            Links may expire for security.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClientCheckoutPage;

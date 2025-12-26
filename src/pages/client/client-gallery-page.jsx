import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getGalleryByCodeApi } from "../../api/Gallery.jsx";
import { toastError, toastSuccess } from "../../utils/toast.jsx";
import ClientImageGridSkeleton from "../../components/ui/ClientImageGridSkeleton.jsx";
import Skeleton from "../../components/ui/Skeleton.jsx";
import { Heart, ShoppingCart, Check, X } from "lucide-react";

const BRAND = {
  bg: "bg-[#0b0b0d]",
  card: "bg-[#111114]",
  accent: "amber-400",
  accentBg: "bg-amber-400",
  accentText: "text-amber-400",
};

const ClientGalleryPage = () => {
  const { code } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [favorites, setFavorites] = useState(new Set());
  const [activePhoto, setActivePhoto] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD ================= */
  useEffect(() => {
    const load = async () => {
      try {
        const data = await getGalleryByCodeApi(code);
        setEvent(data.event);
        setPhotos(data.photos);

        const fav = localStorage.getItem(`fav-${code}`);
        if (fav) setFavorites(new Set(JSON.parse(fav)));
      } catch {
        toastError("Gallery not available");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [code]);

  /* ================= ACTIONS ================= */
  const toggleSelect = useCallback((id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const toggleFavorite = useCallback(
    (id) => {
      setFavorites((prev) => {
        const next = new Set(prev);
        next.has(id) ? next.delete(id) : next.add(id);
        localStorage.setItem(`fav-${code}`, JSON.stringify([...next]));
        return next;
      });
    },
    [code]
  );

  const handleCheckout = () => {
    if (!selected.size) return toastError("Select at least one photo");
    toastSuccess("Proceeding to checkout");
    navigate(`/g/${code}/checkout`, {
      state: { selectedIds: [...selected] },
    });
  };

  /* ================= LOADING ================= */
  if (loading)
    return (
      <div className={`min-h-screen ${BRAND.bg} text-white p-6`}>
        <div className="max-w-6xl mx-auto">
          <Skeleton className="h-7 w-56 mb-2" />
          <Skeleton className="h-4 w-72 mb-6" />
          <ClientImageGridSkeleton count={12} />
        </div>
      </div>
    );

  return (
    <div className={`min-h-screen ${BRAND.bg} text-white pb-28`}>
      <div className="max-w-6xl mx-auto px-4 pt-6">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">
            {event?.name}
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Tap photo to view • ❤️ favorite • 🛒 add to cart
          </p>
        </div>

        {/* MASONRY GRID */}
        <div className="columns-2 sm:columns-3 md:columns-4 gap-4 space-y-4">
          {photos.map((p) => {
            const isSelected = selected.has(p.id);
            const isFavorite = favorites.has(p.id);

            return (
              <div
                key={p.id}
                className={`break-inside-avoid relative rounded-xl overflow-hidden cursor-pointer
                border transition
                ${
                  isSelected
                    ? "border-amber-400 ring-2 ring-amber-400/40"
                    : "border-white/10 hover:border-white/30"
                }`}
              >
                {/* IMAGE */}
                <img
                  src={p.watermarkedUrl}
                  alt=""
                  onClick={() => setActivePhoto(p)}
                  className="w-full object-cover hover:scale-[1.02] transition"
                />

                {/* WATERMARK */}
                <img
                  src="https://db71fqi33p60s.cloudfront.net/watermarks/logo.jpg"
                  className="absolute bottom-3 right-3 w-12 opacity-40 pointer-events-none z-20"
                />

                {/* FAVORITE */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(p.id);
                  }}
                  className="absolute top-3 right-3 bg-black/60 p-2 rounded-full"
                >
                  <Heart
                    size={16}
                    className={
                      isFavorite ? "fill-red-500 text-red-500" : "text-white"
                    }
                  />
                </button>

                {/* ADD TO CART */}
                <button
                  onClick={() => toggleSelect(p.id)}
                  className={`absolute top-3 left-3 text-xs font-semibold px-2 py-1 rounded
                    ${
                      isSelected
                        ? "bg-amber-400 text-black"
                        : "bg-black/60 text-white"
                    }`}
                >
                  {isSelected ? "Added" : "Add"}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* LIGHTBOX */}
      {activePhoto && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
          {/* CLOSE */}
          <button
            onClick={() => setActivePhoto(null)}
            className="absolute top-6 right-6 text-white z-50"
          >
            <X size={28} />
          </button>

          {/* IMAGE WRAPPER */}
          <div className="relative max-h-[90vh] max-w-[90vw]">
            {/* PHOTO */}
            <img
              src={activePhoto.watermarkedUrl}
              className="max-h-[90vh] max-w-[90vw] object-contain rounded-xl"
            />

            {/* WATERMARK OVERLAY */}
            <img
              src="https://db71fqi33p60s.cloudfront.net/watermarks/logo.jpg"
              className="
          absolute bottom-6 right-6
          w-28 md:w-36
          opacity-50
          pointer-events-none
          select-none
          drop-shadow-lg
        "
            />
          </div>

          {/* ACTIONS */}
          <div className="absolute bottom-6 flex gap-4 z-50">
            <button
              onClick={() => toggleSelect(activePhoto.id)}
              className={`px-6 py-2 rounded-lg font-semibold
          ${
            selected.has(activePhoto.id)
              ? "bg-amber-400 text-black"
              : "bg-white/10 text-white"
          }`}
            >
              {selected.has(activePhoto.id) ? "Added to cart" : "Add to cart"}
            </button>

            <button
              onClick={() => toggleFavorite(activePhoto.id)}
              className="px-4 py-2 rounded-lg bg-white/10"
            >
              <Heart
                className={
                  favorites.has(activePhoto.id)
                    ? "fill-red-500 text-red-500"
                    : "text-white"
                }
              />
            </button>
          </div>
        </div>
      )}

      {/* CART BAR */}
      <div className="fixed bottom-0 inset-x-0 bg-black/80 backdrop-blur border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <p className="text-sm">
            Selected{" "}
            <span className="text-amber-400 font-semibold">
              {selected.size}
            </span>
          </p>

          <button
            onClick={handleCheckout}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold
              ${
                selected.size
                  ? "bg-amber-400 text-black"
                  : "bg-neutral-700 text-neutral-300 cursor-not-allowed"
              }`}
          >
            <ShoppingCart size={18} />
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientGalleryPage;

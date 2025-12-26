import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getGalleryByCodeApi } from "../../api/Gallery.jsx";
import { toastError, toastSuccess } from "../../utils/toast.jsx";
import ClientImageGridSkeleton from "../../components/ui/ClientImageGridSkeleton.jsx";
import Skeleton from "../../components/ui/Skeleton.jsx";
import { Heart, ShoppingCart, Check } from "lucide-react";

const ClientGalleryPage = () => {
  const { code } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [favorites, setFavorites] = useState(new Set());
  const [loading, setLoading] = useState(true);

  /* ================= LOAD GALLERY ================= */
  useEffect(() => {
    const load = async () => {
      try {
        const data = await getGalleryByCodeApi(code);
        setEvent(data.event);
        setPhotos(data.photos);

        const saved = localStorage.getItem(`fav-${code}`);
        if (saved) setFavorites(new Set(JSON.parse(saved)));
      } catch {
        toastError("Gallery not found or expired");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [code]);

  /* ================= TOGGLE SELECT ================= */
  const toggleSelect = useCallback((id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  /* ================= TOGGLE FAVORITE ================= */
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

  /* ================= CHECKOUT ================= */
  const handleCheckout = () => {
    if (!selected.size) return toastError("Select at least one photo");
    toastSuccess("Proceeding to checkout...");
    navigate(`/g/${code}/checkout`, {
      state: { selectedIds: [...selected] },
    });
  };

  /* ================= LOADING ================= */
  if (loading)
    return (
      <div className="min-h-screen bg-neutral-950 text-white p-6">
        <div className="max-w-6xl mx-auto">
          <Skeleton className="h-7 w-56 mb-2" />
          <Skeleton className="h-4 w-72 mb-6" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            <ClientImageGridSkeleton count={12} />
          </div>
        </div>
      </div>
    );

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-neutral-950 text-white pb-28">
      <div className="max-w-6xl mx-auto px-4 pt-6">
        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-3xl font-semibold tracking-tight">
            {event?.name}
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            ❤️ Mark favorites • 🛒 Tap photo to add to cart
          </p>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {photos.map((p) => {
            const isSelected = selected.has(p.id);
            const isFavorite = favorites.has(p.id);

            return (
              <div
                key={p.id}
                onClick={() => toggleSelect(p.id)}
                className={`group relative rounded-xl overflow-hidden cursor-pointer
                  border transition-all duration-200
                  ${
                    isSelected
                      ? "border-amber-400 ring-2 ring-amber-400/40"
                      : "border-white/10 hover:border-white/30"
                  }`}
                style={{ isolation: "isolate" }}
              >
                {/* IMAGE */}
                <img
                  src={p.watermarkedUrl}
                  alt=""
                  className="w-full h-44 object-cover group-hover:scale-[1.03] transition-transform duration-300"
                />

                {/* DARK GRADIENT */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

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
                  className="absolute top-3 right-3 bg-black/60 backdrop-blur p-2 rounded-full z-30"
                >
                  <Heart
                    size={16}
                    className={
                      isFavorite
                        ? "fill-red-500 text-red-500"
                        : "text-white"
                    }
                  />
                </button>

                {/* SELECT BADGE */}
                {isSelected && (
                  <div className="absolute top-3 left-3 bg-amber-400 text-black text-xs font-semibold px-2 py-1 rounded flex items-center gap-1 z-30">
                    <Check size={14} /> Added
                  </div>
                )}

                {/* HOVER CTA */}
                {!isSelected && (
                  <div className="absolute bottom-3 left-3 text-xs bg-black/60 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                    Add to cart
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* STICKY CART BAR */}
      <div className="fixed bottom-0 inset-x-0 bg-black/80 backdrop-blur border-t border-white/10 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-sm space-y-1">
            <p>
              🛒 Selected{" "}
              <span className="text-amber-400 font-semibold">
                {selected.size}
              </span>
            </p>
            <p>
              ❤️ Favorites{" "}
              <span className="text-red-400 font-semibold">
                {favorites.size}
              </span>
            </p>
          </div>

          <button
            onClick={handleCheckout}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold transition
              ${
                selected.size
                  ? "bg-amber-400 text-black hover:bg-amber-300"
                  : "bg-neutral-700 text-neutral-300 cursor-not-allowed"
              }`}
          >
            <ShoppingCart size={18} />
            Continue ({selected.size})
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientGalleryPage;

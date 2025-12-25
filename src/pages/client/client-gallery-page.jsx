import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getGalleryByCodeApi } from "../../api/Gallery.jsx";
import { toastError, toastSuccess } from "../../utils/toast.jsx";
import ClientImageGridSkeleton from "../../components/ui/ClientImageGridSkeleton.jsx";
import Skeleton from "../../components/ui/Skeleton.jsx";
import { Heart } from "lucide-react";

const ClientGalleryPage = () => {
  const { code } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [favorites, setFavorites] = useState(new Set());
  const [loading, setLoading] = useState(true);

  /* =====================================================
     LOAD GALLERY
  ===================================================== */
  useEffect(() => {
    const load = async () => {
      try {
        const data = await getGalleryByCodeApi(code);
        setEvent(data.event);
        setPhotos(data.photos);

        // 🔥 restore favorites
        const saved = localStorage.getItem(`fav-${code}`);
        if (saved) {
          setFavorites(new Set(JSON.parse(saved)));
        }
      } catch {
        toastError("Gallery not found or expired");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [code]);

  /* =====================================================
     TOGGLE SELECT (FOR PURCHASE)
  ===================================================== */
  const toggleSelect = useCallback((id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  /* =====================================================
     TOGGLE FAVORITE (❤️)
  ===================================================== */
  const toggleFavorite = useCallback(
    (id) => {
      setFavorites((prev) => {
        const next = new Set(prev);
        next.has(id) ? next.delete(id) : next.add(id);

        // persist
        localStorage.setItem(
          `fav-${code}`,
          JSON.stringify([...next])
        );

        return next;
      });
    },
    [code]
  );

  /* =====================================================
     CHECKOUT
  ===================================================== */
  const handleCheckout = () => {
    if (!selected.size) return toastError("Select at least one photo");

    toastSuccess("Proceeding to checkout...");
    navigate(`/g/${code}/checkout`, {
      state: { selectedIds: [...selected] },
    });
  };

  /* =====================================================
     LOADING UI
  ===================================================== */
  if (loading)
    return (
      <div className="min-h-screen bg-slate-950 text-slate-50 p-6">
        <div className="max-w-5xl mx-auto">
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-72 mb-6" />

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            <ClientImageGridSkeleton count={12} />
          </div>
        </div>
      </div>
    );

  /* =====================================================
     UI
  ===================================================== */
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-semibold">{event?.name}</h1>
        <p className="text-sm text-slate-400">
          ❤️ Mark favorites • Tap photo to select for purchase
        </p>

        {/* PHOTOS GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-6">
          {photos.map((p) => {
            const isSelected = selected.has(p.id);
            const isFavorite = favorites.has(p.id);

            return (
              <div
                key={p.id}
                className={`relative rounded overflow-hidden border cursor-pointer ${
                  isSelected
                    ? "border-amber-400 ring-2 ring-amber-400/70"
                    : "border-slate-800"
                }`}
                onClick={() => toggleSelect(p.id)}
              >
                <img
                  src={p.watermarkedUrl}
                  className="w-full h-40 object-cover"
                />

                {/* FAVORITE BUTTON */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(p.id);
                  }}
                  className="absolute top-2 right-2 bg-black/60 p-1.5 rounded-full"
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

                {/* LABEL */}
                <span className="absolute bottom-2 left-2 bg-black/70 text-xs px-2 py-1 rounded">
                  {isSelected ? "Selected" : "Tap to select"}
                </span>
              </div>
            );
          })}
        </div>

        {/* FOOTER BAR */}
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm space-y-1">
            <p>
              Selected:{" "}
              <span className="text-amber-300 font-semibold">
                {selected.size}
              </span>
            </p>
            <p>
              Favorites:{" "}
              <span className="text-red-400 font-semibold">
                {favorites.size}
              </span>
            </p>
          </div>

          <button
            onClick={handleCheckout}
            className="px-5 py-2 bg-amber-400 text-slate-900 font-semibold rounded"
          >
            Continue ({selected.size})
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientGalleryPage;

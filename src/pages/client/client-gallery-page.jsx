import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Heart } from "lucide-react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL;
const ASSETS_CDN = "https://db71fqi33p60s.cloudfront.net"; // ASSETS CloudFront

export default function ClientGalleryPage() {
  const { code } = useParams();

  const [event, setEvent] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [favorites, setFavorites] = useState(new Set());
  const [loading, setLoading] = useState(true);

  /* ============================
     LOAD GALLERY
  ============================ */
  useEffect(() => {
    const loadGallery = async () => {
      try {
        const res = await axios.get(
          `${API_BASE}/gallery/${code}`
        );
        setEvent(res.data.event);
        setPhotos(res.data.photos);
      } catch (err) {
        console.error("Gallery load failed", err);
      } finally {
        setLoading(false);
      }
    };

    loadGallery();
  }, [code]);

  /* ============================
     SELECTION HANDLERS
  ============================ */
  const toggleSelect = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleFavorite = (id) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleCheckout = () => {
    alert(`Selected ${selected.size} photos`);
    // next step: price preview / checkout
  };

  /* ============================
     UI STATES
  ============================ */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading gallery…
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400">
        Gallery not found
      </div>
    );
  }

  /* ============================
     RENDER
  ============================ */
  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* HEADER */}
      <header className="px-5 py-4 border-b border-white/10">
        <h1 className="text-lg font-semibold">{event.name}</h1>
        <p className="text-xs text-slate-400">
          Tap photos to select • Watermarked previews
        </p>
      </header>

      {/* GALLERY GRID */}
      <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {photos.map((p) => {
          const isSelected = selected.has(p.id);
          const isFav = favorites.has(p.id);

          return (
            <div
              key={p.id}
              onClick={() => toggleSelect(p.id)}
              className="relative rounded-lg overflow-hidden cursor-pointer border border-white/10 group"
              style={{ isolation: "isolate" }}
            >
              {/* IMAGE */}
              <img
                src={`${ASSETS_CDN}/${p.originalKey}`}
                className="w-full h-44 object-cover transition-transform duration-300 group-hover:scale-105"
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
              />

              {/* SELECT OVERLAY */}
              {isSelected && (
                <div className="absolute inset-0 bg-black/50 z-10" />
              )}

              {/* CHECKBOX */}
              <div className="absolute top-2 left-2 z-20">
                <div
                  className={`w-5 h-5 rounded border flex items-center justify-center
                  ${
                    isSelected
                      ? "bg-amber-400 border-amber-400"
                      : "border-white/70"
                  }`}
                >
                  {isSelected && (
                    <span className="text-black text-xs font-bold">
                      ✓
                    </span>
                  )}
                </div>
              </div>

              {/* FAVORITE */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(p.id);
                }}
                className="absolute top-2 right-2 z-20 bg-black/60 p-1.5 rounded-full"
              >
                <Heart
                  size={16}
                  className={
                    isFav
                      ? "fill-red-500 text-red-500"
                      : "text-white"
                  }
                />
              </button>

              {/* WATERMARK */}
              <img
                src={`${ASSETS_CDN}/watermarks/logo.jpg`}
                className="absolute bottom-2 right-2 w-14 opacity-40 pointer-events-none z-20"
                draggable={false}
              />
            </div>
          );
        })}
      </div>

      {/* STICKY CART BAR */}
      {selected.size > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur border-t border-white/10 z-50">
          <div className="max-w-5xl mx-auto px-5 py-3 flex items-center justify-between">
            <div className="text-sm">
              <p>
                Selected{" "}
                <span className="text-amber-400 font-semibold">
                  {selected.size}
                </span>{" "}
                photos
              </p>
              <p className="text-xs text-slate-400">
                High-resolution downloads after payment
              </p>
            </div>

            <button
              onClick={handleCheckout}
              className="px-6 py-2 rounded bg-amber-400 text-black font-semibold active:scale-95"
            >
              Add to Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

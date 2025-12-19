import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getGalleryByCodeApi } from "../../api/Gallery.jsx";
import { toastError, toastSuccess } from "../../utils/toast.jsx";

const ClientGalleryPage = () => {
  const { code } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getGalleryByCodeApi(code);
        setEvent(data.event);
        setPhotos(data.photos);
      } catch {
        toastError("Gallery not found or expired");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [code]);

  const toggleSelect = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleCheckout = () => {
    if (!selected.size) return toastError("Select at least one photo");

    toastSuccess("Proceeding to checkout...");
    navigate(`/g/${code}/checkout`, {
      state: { selectedIds: [...selected] },
    });
  };

  if (loading)
    return <div className="p-6 text-slate-400">Loading gallery...</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-semibold">{event?.name}</h1>
        <p className="text-sm text-slate-400">
          Tap photos to select. Discounts apply automatically.
        </p>

        {/* Photos grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-6">
          {photos.map((p) => {
            const isSelected = selected.has(p.id);
            return (
              <button
                key={p.id}
                onClick={() => toggleSelect(p.id)}
                className={`relative rounded overflow-hidden border ${
                  isSelected
                    ? "border-amber-400 ring-2 ring-amber-400/70"
                    : "border-slate-800"
                }`}
              >
                <img
                  src={p.watermarkedUrl}
                  className="w-full h-40 object-cover"
                />

                <div
                  className={`absolute inset-0 bg-gradient-to from-black/70 to-transparent ${
                    isSelected ? "" : "hidden group-hover:flex"
                  }`}
                />

                <span className="absolute bottom-2 left-2 bg-black/70 text-xs px-2 py-1 rounded">
                  {isSelected ? "Selected" : "Tap to select"}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex justify-between items-center mt-6">
          <p className="text-sm">
            Selected:{" "}
            <span className="text-amber-300 font-semibold">
              {selected.size}
            </span>
          </p>
          <button
            onClick={handleCheckout}
            className="px-4 py-2 bg-amber-400 text-slate-900 font-semibold rounded"
          >
            Continue ({selected.size})
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientGalleryPage;

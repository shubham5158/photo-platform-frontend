import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { getEventApi } from "../../api/Events.jsx";
import {
  getUploadUrlApi,
  uploadToS3,
  getEventPhotosApi,
  confirmUploadApi,
} from "../../api/Photos.jsx";
import { toastSuccess, toastError } from "../../utils/toast.jsx";
import ImageGridSkeleton from "../../components/ui/ImageGridSkeleton.jsx";
import {
  Upload,
  ArrowLeft,
  Grid2X2,
  LayoutGrid,
  X,
} from "lucide-react";

const PhotosPage = () => {
  const { eventId } = useParams();

  const [event, setEvent] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loadingPhotos, setLoadingPhotos] = useState(true);
  const [preview, setPreview] = useState(null);

  /* UI ONLY */
  const [selected, setSelected] = useState([]);
  const [gridCols, setGridCols] = useState(4); // 4 | 6
  const [showUpload, setShowUpload] = useState(false);

  const CLOUD_FRONT_URL = import.meta.env.VITE_CLOUD_FRONT_URL;

  /* ================= LOAD ================= */
  const load = useCallback(async () => {
    try {
      setLoadingPhotos(true);
      const e = await getEventApi(eventId);
      const p = await getEventPhotosApi(eventId);
      setEvent(e);
      setPhotos(p);
      setSelected([]);
    } catch {
      toastError("Failed to load photos");
    } finally {
      setLoadingPhotos(false);
    }
  }, [eventId]);

  useEffect(() => {
    load();
  }, [load]);

  /* ================= UPLOAD ================= */
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!files.length) return toastError("Select images first");

    setUploading(true);
    try {
      for (const file of files) {
        const { uploadUrl, key } = await getUploadUrlApi({
          eventId,
          filename: file.name,
          contentType: file.type,
        });
        await uploadToS3(uploadUrl, file);
        await confirmUploadApi({ eventId, key });
      }
      toastSuccess("Photos uploaded");
      setFiles([]);
      setShowUpload(false);
      await load();
    } catch {
      toastError("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* HEADER */}
      <header className="border-b bg-card sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <a
              href="/admin"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground mb-1"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </a>

            <h1 className="text-3xl font-extrabold uppercase">
              {event?.name}
            </h1>

            {event && (
              <p className="text-xs text-muted-foreground">
                {new Date(event.date).toLocaleDateString()} •{" "}
                <span className="font-mono bg-muted px-2 py-0.5 rounded">
                  {event.galleryCode}
                </span>
              </p>
            )}
          </div>

          {/* UPLOAD BUTTON */}
          <button
            onClick={() => setShowUpload(true)}
            className="flex items-center gap-2 px-5 py-2 rounded-md 
                       bg-primary text-primary-foreground 
                       hover:bg-black/80 transition"
          >
            <Upload size={18} />
            Upload Photos
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* GRID OPTIONS */}
        <div className="flex justify-between items-center">
          <div className="flex gap-1">
            <button
              onClick={() => setGridCols(4)}
              className={`p-2 rounded border ${
                gridCols === 4 ? "bg-muted" : ""
              }`}
            >
              <Grid2X2 size={18} />
            </button>
            <button
              onClick={() => setGridCols(6)}
              className={`p-2 rounded border ${
                gridCols === 6 ? "bg-muted" : ""
              }`}
            >
              <LayoutGrid size={18} />
            </button>
          </div>

          {selected.length > 0 && (
            <span className="text-sm text-muted-foreground">
              {selected.length} selected
            </span>
          )}
        </div>

        {/* PHOTOS GRID */}
        <section className="bg-card border rounded-xl p-4">
          <div
            className={`grid gap-4 ${
              gridCols === 4
                ? "grid-cols-2 md:grid-cols-4"
                : "grid-cols-3 md:grid-cols-6"
            }`}
          >
            {loadingPhotos ? (
              <ImageGridSkeleton count={12} />
            ) : (
              photos.map((p) => {
                const isSelected = selected.includes(p._id);
                return (
                  <div
                    key={p._id}
                    className={`relative group rounded overflow-hidden border cursor-pointer ${
                      isSelected && "ring-2 ring-primary"
                    }`}
                    onClick={() =>
                      setSelected((s) =>
                        s.includes(p._id)
                          ? s.filter((id) => id !== p._id)
                          : [...s, p._id]
                      )
                    }
                  >
                    <img
                      src={`https://${CLOUD_FRONT_URL}/${p.originalKey}`}
                      className="w-full h-32 object-cover"
                      onClick={() =>
                        setPreview(
                          `https://${CLOUD_FRONT_URL}/${p.originalKey}`
                        )
                      }
                    />

                    {/* HOVER OVERLAY */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition" />

                    {/* EMPTY BOX (HOVER ONLY) */}
                    {!isSelected && (
                      <div className="absolute top-2 left-2 w-4 h-4 border border-white bg-white/70 hidden group-hover:block" />
                    )}

                    {/* CHECKED */}
                    {isSelected && (
                      <div className="absolute top-2 left-2 w-4 h-4 bg-primary text-white text-xs flex items-center justify-center">
                        ✓
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </section>
      </main>

      {/* UPLOAD MODAL */}
      {showUpload && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
          <div className="bg-card w-full max-w-md rounded-xl p-6 relative">
            <button
              onClick={() => setShowUpload(false)}
              className="absolute right-4 top-4"
            >
              <X />
            </button>

            <h2 className="text-xl font-bold mb-1">Upload Photos</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Upload photos from {event?.name}
            </p>

            <form onSubmit={handleUpload} className="space-y-4">
              <label
                htmlFor="upload"
                className="flex flex-col items-center justify-center gap-2 
                           border-2 border-dashed rounded-lg p-6 cursor-pointer
                           hover:bg-black/5"
              >
                <Upload />
                <span className="font-medium">
                  Click to upload or drag and drop
                </span>
                <span className="text-xs text-muted-foreground">
                  JPG, PNG images only
                </span>
              </label>

              <input
                id="upload"
                type="file"
                multiple
                accept="image/*"
                onChange={(e) =>
                  setFiles(Array.from(e.target.files || []))
                }
                className="hidden"
              />

              {files.length > 0 && (
                <button
                  type="submit"
                  disabled={uploading}
                  className="w-full py-2 bg-primary text-primary-foreground rounded"
                >
                  {uploading ? "Uploading..." : "Upload Photos"}
                </button>
              )}
            </form>
          </div>
        </div>
      )}

      {/* PREVIEW */}
      {preview && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
          onClick={() => setPreview(null)}
        >
          <img
            src={preview}
            className="max-h-[90vh] max-w-[90vw] rounded"
          />
        </div>
      )}
    </div>
  );
};

export default PhotosPage;

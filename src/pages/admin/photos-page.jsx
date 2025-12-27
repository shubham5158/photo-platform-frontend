import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { getEventApi } from "../../api/Events.jsx";
import {
  getUploadUrlApi,
  uploadToS3,
  getEventPhotosApi,
  confirmUploadApi,
  deletePhotoApi,
} from "../../api/Photos.jsx";
import { toastSuccess, toastError } from "../../utils/toast.jsx";
import ImageGridSkeleton from "../../components/ui/ImageGridSkeleton.jsx";
import {
  Upload,
  Trash2,
  ArrowLeft,
  LayoutGrid,
  List,
  CheckSquare,
} from "lucide-react";

const PhotosPage = () => {
  const { eventId } = useParams();

  const [event, setEvent] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loadingPhotos, setLoadingPhotos] = useState(true);
  const [dragActive, setDragActive] = useState(false);

  /* UI STATES */
  const [view, setView] = useState("grid");
  const [selected, setSelected] = useState([]);

  const CLOUD_FRONT_URL = import.meta.env.VITE_CLOUD_FRONT_URL;

  /* ================= DRAG FIX ================= */
  useEffect(() => {
    const prevent = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };
    window.addEventListener("dragover", prevent);
    window.addEventListener("drop", prevent);
    return () => {
      window.removeEventListener("dragover", prevent);
      window.removeEventListener("drop", prevent);
    };
  }, []);

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

  /* ================= DRAG ================= */
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const dropped = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith("image/")
    );
    if (!dropped.length) return toastError("Only image files allowed");
    setFiles(dropped);
  };

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
      await load();
    } catch {
      toastError("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (photoId) => {
    try {
      setDeletingId(photoId);
      await deletePhotoApi(photoId);
      toastSuccess("Photo deleted");
      await load();
    } catch {
      toastError("Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  /* ================= BULK DELETE ================= */
  const handleBulkDelete = async () => {
    for (const id of selected) {
      await handleDelete(id);
    }
    setSelected([]);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* HEADER */}
      <header className="border-b bg-card sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <a
            href="/admin"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground mb-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </a>

          <h1 className="text-3xl font-extrabold tracking-wide uppercase">
            {event?.name}
          </h1>

          {event && (
            <p className="text-xs text-muted-foreground mt-1">
              {new Date(event.date).toLocaleDateString()} • Gallery{" "}
              <span className="font-mono bg-muted px-2 py-0.5 rounded">
                {event.galleryCode}
              </span>
            </p>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* TOOLBAR */}
        <div className="flex justify-between items-center">
          <div className="flex gap-1 border rounded-md overflow-hidden">
            <button
              onClick={() => setView("grid")}
              className={`px-3 py-2 ${
                view === "grid"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground"
              }`}
            >
              <LayoutGrid size={18} />
            </button>
            <button
              onClick={() => setView("compact")}
              className={`px-3 py-2 ${
                view === "compact"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground"
              }`}
            >
              <List size={18} />
            </button>
          </div>

          {selected.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
            >
              <Trash2 size={16} />
              Delete ({selected.length})
            </button>
          )}
        </div>

        {/* UPLOAD */}
        <section
          onDragOver={handleDragOver}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-8 text-center transition ${
            dragActive ? "border-primary bg-muted" : "border-border bg-card"
          }`}
        >
          <form onSubmit={handleUpload} className="space-y-4">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) =>
                setFiles(Array.from(e.target.files || []))
              }
              className="hidden"
              id="upload"
            />
            <label
              htmlFor="upload"
              className="cursor-pointer flex flex-col items-center gap-2"
            >
              <Upload />
              <span className="font-medium">Upload Photos</span>
              <span className="text-xs text-muted-foreground">
                Click or drag & drop images
              </span>
            </label>

            {files.length > 0 && (
              <button
                type="submit"
                disabled={uploading}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-md"
              >
                Upload {files.length} Photos
              </button>
            )}
          </form>
        </section>

        {/* GRID */}
        <section className="bg-card border rounded-xl p-4">
          <div
            className={`grid gap-4 ${
              view === "grid"
                ? "grid-cols-2 md:grid-cols-4"
                : "grid-cols-1"
            }`}
          >
            {loadingPhotos ? (
              <ImageGridSkeleton count={8} />
            ) : (
              photos.map((p) => (
                <div
                  key={p._id}
                  className={`relative group rounded overflow-hidden border ${
                    selected.includes(p._id)
                      ? "ring-2 ring-primary"
                      : ""
                  }`}
                >
                  <img
                    src={`https://${CLOUD_FRONT_URL}/${p.originalKey}`}
                    className={`w-full ${
                      view === "grid" ? "h-40" : "h-24"
                    } object-cover cursor-pointer`}
                    onClick={() =>
                      setPreview(
                        `https://${CLOUD_FRONT_URL}/${p.originalKey}`
                      )
                    }
                  />

                  {/* SELECT */}
                  <button
                    onClick={() =>
                      setSelected((s) =>
                        s.includes(p._id)
                          ? s.filter((id) => id !== p._id)
                          : [...s, p._id]
                      )
                    }
                    className="absolute top-2 left-2 bg-white rounded p-1 shadow"
                  >
                    <CheckSquare
                      size={16}
                      className={
                        selected.includes(p._id)
                          ? "text-primary"
                          : "text-muted-foreground"
                      }
                    />
                  </button>
                </div>
              ))
            )}
          </div>
        </section>
      </main>

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

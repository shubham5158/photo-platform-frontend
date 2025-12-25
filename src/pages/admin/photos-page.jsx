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
import { Trash2, Eye, Loader2, UploadCloud } from "lucide-react";

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

  const CLOUD_FRONT_URL = import.meta.env.VITE_CLOUD_FRONT_URL;

  /* ---------------- LOAD ---------------- */
  const load = useCallback(async () => {
    try {
      setLoadingPhotos(true);
      const e = await getEventApi(eventId);
      const p = await getEventPhotosApi(eventId);
      setEvent(e);
      setPhotos(p);
    } catch {
      toastError("Failed to load photos");
    } finally {
      setLoadingPhotos(false);
    }
  }, [eventId]);

  useEffect(() => {
    load();
  }, [load]);

  /* ---------------- DRAG & DROP ---------------- */
  const handleDragOver = (e) => {
    e.preventDefault(); // 🔥 REQUIRED
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault(); // 🔥 REQUIRED
    setDragActive(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    if (!droppedFiles.length) return;

    setFiles(droppedFiles);
  };

  /* ---------------- UPLOAD ---------------- */
  const handleUpload = async () => {
    if (!files.length) return toastError("Select at least 1 photo");

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

      toastSuccess("Photos uploaded successfully");
      setFiles([]);
      load();
    } catch {
      toastError("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  /* ---------------- DELETE ---------------- */
  const handleDelete = async (photoId) => {
    if (!window.confirm("Delete this photo?")) return;

    try {
      setDeletingId(photoId);
      await deletePhotoApi(photoId);
      setPhotos((p) => p.filter((x) => x._id !== photoId));
      toastSuccess("Photo deleted");
    } catch {
      toastError("Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6 relative">

      {/* 🔥 TOP RIGHT GLOBAL LOADER */}
      {(uploading || deletingId) && (
        <div className="fixed top-4 right-4 z-50 bg-white shadow-lg rounded-lg px-4 py-2 flex items-center gap-2">
          <Loader2 className="animate-spin" size={16} />
          <span className="text-sm font-medium">
            {uploading ? "Uploading photos…" : "Deleting photo…"}
          </span>
        </div>
      )}

      {/* HEADER */}
      <header>
        <h1 className="text-2xl font-semibold">Manage Photos</h1>
        {event && (
          <p className="text-sm text-slate-600">
            {event.name} • Gallery{" "}
            <span className="font-mono bg-slate-100 px-2 rounded">
              {event.galleryCode}
            </span>
          </p>
        )}
      </header>

      {/* DRAG & DROP ZONE */}
      <section
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`bg-white border-2 border-dashed rounded-xl p-8 transition ${
          dragActive
            ? "border-slate-900 bg-slate-50"
            : "border-slate-300"
        }`}
      >
        <div className="flex flex-col items-center gap-3 text-center">
          <UploadCloud size={40} className="text-slate-500" />

          <p className="text-sm font-medium">
            Drag photos from your computer here
          </p>

          <p className="text-xs text-slate-500">
            or click to browse (JPG / PNG)
          </p>

          <input
            type="file"
            multiple
            hidden
            id="photo-input"
            onChange={(e) => setFiles([...e.target.files])}
          />

          <label
            htmlFor="photo-input"
            className="px-4 py-2 bg-slate-900 text-white rounded cursor-pointer text-sm"
          >
            Browse Files
          </label>

          {files.length > 0 && (
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="mt-3 px-4 py-2 bg-emerald-600 text-white rounded"
            >
              Upload {files.length} Photo(s)
            </button>
          )}
        </div>
      </section>

      {/* PHOTO GRID */}
      <section className="bg-white border rounded-xl p-4">
        <h2 className="text-lg font-medium mb-4">
          Photos ({photos.length})
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {loadingPhotos ? (
            <ImageGridSkeleton count={8} />
          ) : photos.length ? (
            photos.map((p) => {
              const url = `https://${CLOUD_FRONT_URL}/${p.originalKey}`;

              return (
                <div
                  key={p._id}
                  className="group relative rounded overflow-hidden border cursor-pointer"
                  onClick={() => setPreview(url)}
                >
                  <img src={url} className="w-full h-40 object-cover" />

                  {/* TAP TO VIEW */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                    <div className="flex items-center gap-2 text-white text-xs">
                      <Eye size={14} /> Tap to view
                    </div>
                  </div>

                  {/* DELETE */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(p._id);
                    }}
                    className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded opacity-0 group-hover:opacity-100"
                  >
                    {deletingId === p._id ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Trash2 size={14} />
                    )}
                  </button>
                </div>
              );
            })
          ) : (
            <p className="text-sm text-slate-500 col-span-full">
              No photos uploaded yet.
            </p>
          )}
        </div>
      </section>

      {/* FULLSCREEN PREVIEW */}
      {preview && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
          onClick={() => setPreview(null)}
        >
          <img
            src={preview}
            className="max-h-[90vh] max-w-[90vw] rounded shadow-2xl"
          />
        </div>
      )}
    </div>
  );
};

export default PhotosPage;

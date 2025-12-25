import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import {
  getEventApi
} from "../../api/Events.jsx";
import {
  getUploadUrlApi,
  uploadToS3,
  getEventPhotosApi,
  confirmUploadApi,
  deletePhotoApi, // 👈 make sure this exists
} from "../../api/Photos.jsx";
import { toastSuccess, toastError } from "../../utils/toast.jsx";
import ImageGridSkeleton from "../../components/ui/ImageGridSkeleton.jsx";

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

  /* =====================================================
     🔥 CRITICAL: WINDOWS → CHROME DRAG FIX
  ===================================================== */
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

  /* =====================================================
     LOAD EVENT + PHOTOS
  ===================================================== */
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

  /* =====================================================
     DRAG & DROP HANDLERS
  ===================================================== */
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "copy";
    setDragActive(true);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const dropped = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith("image/")
    );

    if (!dropped.length) {
      toastError("Only image files allowed");
      return;
    }

    setFiles(dropped);
  };

  /* =====================================================
     UPLOAD
  ===================================================== */
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!files.length) return toastError("Select at least one image");

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
      await load();
    } catch (err) {
      console.error(err);
      toastError("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  /* =====================================================
     DELETE PHOTO
  ===================================================== */
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

  /* =====================================================
     UI
  ===================================================== */
  return (
    <div className="space-y-6 relative">
      {/* TOP RIGHT LOADER */}
      {(uploading || deletingId) && (
        <div className="fixed top-4 right-4 z-50 bg-black/80 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span className="text-sm">
            {uploading ? "Uploading..." : "Deleting..."}
          </span>
        </div>
      )}

      {/* HEADER */}
      <header>
        <h1 className="text-2xl font-semibold">Manage Photos</h1>
        {event && (
          <p className="text-sm text-slate-600">
            {event.name} • Gallery{" "}
            <span className="font-mono bg-slate-100 px-2 py-0.5 rounded">
              {event.galleryCode}
            </span>
          </p>
        )}
      </header>

      {/* UPLOAD ZONE */}
      <section
        onDragOver={handleDragOver}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-8 transition cursor-pointer ${
          dragActive
            ? "border-slate-900 bg-slate-50"
            : "border-slate-300 bg-white"
        }`}
      >
        <form onSubmit={handleUpload} className="flex flex-col items-center gap-3">
          <input
            type="file"
            multiple
            accept="image/*"
            disabled={uploading}
            onChange={(e) =>
              setFiles(Array.from(e.target.files || []))
            }
            className="hidden"
            id="fileInput"
          />

          <label
            htmlFor="fileInput"
            className="text-center cursor-pointer"
          >
            <p className="font-medium">
              Drag & drop images here
            </p>
            <p className="text-sm text-slate-500">
              or click to browse
            </p>
          </label>

          {files.length > 0 && (
            <button
              type="submit"
              disabled={uploading}
              className="mt-2 px-5 py-2 bg-slate-900 text-white rounded"
            >
              Upload {files.length} photo{files.length > 1 && "s"}
            </button>
          )}
        </form>
      </section>

      {/* PHOTO GRID */}
      <section className="bg-white border rounded-xl p-4">
        <h2 className="text-lg font-medium mb-4">
          Photos ({photos.length})
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {loadingPhotos ? (
            <ImageGridSkeleton count={8} />
          ) : photos.length ? (
            photos.map((p) => (
              <div key={p._id} className="relative group">
                <img
                  src={`https://${CLOUD_FRONT_URL}/${p.originalKey}`}
                  className="w-full h-40 object-cover rounded cursor-pointer"
                  onClick={() =>
                    setPreview(
                      `https://${CLOUD_FRONT_URL}/${p.originalKey}`
                    )
                  }
                />

                {/* OVERLAY */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3">
                  <button
                    onClick={() =>
                      setPreview(
                        `https://${CLOUD_FRONT_URL}/${p.originalKey}`
                      )
                    }
                    className="px-3 py-1 text-xs bg-white rounded"
                  >
                    View
                  </button>

                  <button
                    onClick={() => handleDelete(p._id)}
                    className="px-3 py-1 text-xs bg-red-600 text-white rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-500">
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

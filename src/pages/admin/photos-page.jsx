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
  deletePhotoApi,
} from "../../api/Photos.jsx";
import { toastSuccess, toastError } from "../../utils/toast.jsx";
import ImageGridSkeleton from "../../components/ui/ImageGridSkeleton.jsx";
import {
  Upload,
  Trash2,
  ArrowLeft,
  Image as ImageIcon,
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
    } catch {
      toastError("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  /* =====================================================
     DELETE
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
    <div className="min-h-screen bg-background">
      {/* LOADER */}
      {(uploading || deletingId) && (
        <div className="fixed top-4 right-4 z-50 bg-black/80 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span className="text-sm">
            {uploading ? "Uploading..." : "Deleting..."}
          </span>
        </div>
      )}

      {/* HEADER */}
      <header className="border-b bg-card sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <a href="/admin" className="inline-flex items-center gap-2 text-sm mb-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </a>

          <h1 className="text-2xl font-bold">Manage Photos</h1>
          {event && (
            <p className="text-sm text-muted-foreground">
              {event.name} • Gallery{" "}
              <span className="font-mono bg-muted px-2 py-0.5 rounded">
                {event.galleryCode}
              </span>
            </p>
          )}
        </div>
      </header>

      {/* UPLOAD ZONE */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <section
          onDragOver={handleDragOver}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-12 text-center transition ${
            dragActive
              ? "border-primary bg-muted"
              : "border-border bg-card"
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
              id="photo-upload"
            />

            <label htmlFor="photo-upload" className="cursor-pointer block">
              <Upload className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
              <p className="font-medium">
                Click to upload or drag & drop
              </p>
              <p className="text-sm text-muted-foreground">
                JPG / PNG images only
              </p>
            </label>

            {files.length > 0 && (
              <button
                type="submit"
                disabled={uploading}
                className="px-6 py-2 bg-primary text-primary-foreground rounded"
              >
                Upload {files.length} photo{files.length > 1 && "s"}
              </button>
            )}
          </form>
        </section>

        {/* PHOTO GRID */}
        <section className="bg-card border rounded-xl p-4">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Photos ({photos.length})
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {loadingPhotos ? (
              <ImageGridSkeleton count={8} />
            ) : photos.length ? (
              photos.map((p) => (
                <div key={p._id} className="relative group rounded-lg overflow-hidden">
                  <img
                    src={`https://${CLOUD_FRONT_URL}/${p.originalKey}`}
                    className="w-full h-40 object-cover cursor-pointer"
                    onClick={() =>
                      setPreview(
                        `https://${CLOUD_FRONT_URL}/${p.originalKey}`
                      )
                    }
                  />

                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3">
                    <button
                      onClick={() =>
                        setPreview(
                          `https://${CLOUD_FRONT_URL}/${p.originalKey}`
                        )
                      }
                      className="px-3 py-1 bg-white text-xs rounded"
                    >
                      View
                    </button>

                    <button
                      onClick={() => handleDelete(p._id)}
                      className="px-3 py-1 bg-red-600 text-white text-xs rounded"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                No photos uploaded yet.
              </p>
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
            className="max-h-[90vh] max-w-[90vw] rounded shadow-2xl"
          />
        </div>
      )}
    </div>
  );
};

export default PhotosPage;

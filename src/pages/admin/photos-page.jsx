import React, { useEffect, useState } from "react";
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
import { Trash2, Eye, Loader2 } from "lucide-react";

const PhotosPage = () => {
  const { eventId } = useParams();

  const [event, setEvent] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loadingPhotos, setLoadingPhotos] = useState(true);

  const CLOUD_FRONT_URL = import.meta.env.VITE_CLOUD_FRONT_URL;

  /* ---------------- LOAD ---------------- */
  const load = async () => {
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
  };

  useEffect(() => {
    load();
  }, [eventId]);

  /* ---------------- UPLOAD ---------------- */
  const handleUpload = async (e) => {
    e.preventDefault();
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
      {/* TOP RIGHT UPLOAD STATUS */}
      {uploading && (
        <div className="fixed top-4 right-4 z-50 bg-white shadow-lg rounded-lg px-4 py-2 flex items-center gap-2">
          <Loader2 className="animate-spin" size={16} />
          <span className="text-sm font-medium">Uploading photos…</span>
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

      {/* UPLOAD */}
      <section className="bg-white border rounded-xl p-4">
        <form onSubmit={handleUpload} className="space-y-4">
          <label className="border-2 border-dashed rounded-xl p-6 flex flex-col items-center cursor-pointer hover:bg-slate-50">
            <input
              type="file"
              multiple
              className="hidden"
              disabled={uploading}
              onChange={(e) => setFiles([...e.target.files])}
            />
            <p className="text-sm font-medium">
              {files.length
                ? `${files.length} photo(s) selected`
                : "Click or drag photos here"}
            </p>
            <p className="text-xs text-slate-500">JPG / PNG supported</p>
          </label>

          <div className="flex justify-end">
            <button
              disabled={!files.length || uploading}
              className="bg-slate-900 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              Upload Photos
            </button>
          </div>
        </form>
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
                  <img
                    src={url}
                    className="w-full h-40 object-cover"
                    alt=""
                  />

                  {/* TAP TO VIEW */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition pointer-events-none">
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
                    disabled={deletingId === p._id}
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

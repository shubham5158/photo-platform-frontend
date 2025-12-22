import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getEventApi } from "../../api/Events.jsx";
import {
  getUploadUrlApi,
  uploadToS3,
  getEventPhotosApi,
  confirmUploadApi,
} from "../../api/Photos.jsx";
import { toastSuccess, toastError } from "../../utils/toast.jsx";
import toast from "react-hot-toast";

const PhotosPage = () => {
  const { eventId } = useParams();

  const [event, setEvent] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);

  const CLOUD_FRONT_URL = import.meta.env.VITE_CLOUD_FRONT_URL;

  const load = async () => {
    try {
      const e = await getEventApi(eventId);
      setEvent(e);

      const p = await getEventPhotosApi(eventId);
      setPhotos(p);
    } catch {
      toastError("Failed to load event photos");
    }
  };

  useEffect(() => {
    load();
  }, [eventId]);

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!files.length) {
      toastError("Select at least 1 file");
      return;
    }

    const t = toast.loading("Uploading...");
    setUploading(true);

    try {
      for (const file of files) {
        // 1️⃣ get upload URL
        const { uploadUrl, key } = await getUploadUrlApi({
          eventId,
          filename: file.name,
          contentType: file.type,
        });

        // 2️⃣ upload to S3
        await uploadToS3(uploadUrl, file);

        // 3️⃣ confirm upload (DB entry)
        await confirmUploadApi({ eventId, key });
      }

      toast.dismiss(t);
      toastSuccess("Photos uploaded successfully!");
      await load();
    } catch (err) {
      console.error(err);
      toast.dismiss(t);
      toastError("Upload failed");
    } finally {
      setUploading(false);
      setFiles([]);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <header>
        <h1 className="text-2xl font-semibold">Manage Photos</h1>
        {event && (
          <p className="text-sm text-slate-600">
            {event.name} • Gallery:{" "}
            <span className="font-mono bg-slate-100 px-2 py-0.5 rounded">
              {event.galleryCode}
            </span>
          </p>
        )}
      </header>

      {/* UPLOAD */}
      <section className="bg-white border rounded-xl p-4">
        <form
          onSubmit={handleUpload}
          className="flex flex-col md:flex-row gap-4"
        >
          <input
            type="file"
            multiple
            onChange={(e) => setFiles([...e.target.files])}
          />

          <button
            type="submit"
            disabled={uploading}
            className="px-4 py-2 bg-slate-900 text-white rounded"
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </form>
      </section>

      {/* PHOTO GRID */}
      <section className="bg-white border rounded-xl p-4">
        <h2 className="text-lg font-medium">Photos ({photos.length})</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          {photos.map((p) => {
            const previewUrl = `https://${CLOUD_FRONT_URL}/${p.previewKey}`;

            return (
              <div
                key={p._id}
                className="group relative border rounded overflow-hidden cursor-pointer"
                onClick={() => setPreview(previewUrl)}
              >
                <img
                  src={previewUrl}
                  alt="photo"
                  className="w-full h-40 object-cover transition-transform group-hover:scale-105"
                  loading="lazy"
                />

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-sm">
                  Tap to view
                </div>
              </div>
            );
          })}

          {!photos.length && (
            <p className="text-sm text-slate-500">No photos uploaded yet.</p>
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

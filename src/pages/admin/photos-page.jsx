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
import ImageGridSkeleton from "../../components/ui/ImageGridSkeleton.jsx";

const PhotosPage = () => {
  const { eventId } = useParams();

  const [event, setEvent] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [loadingPhotos, setLoadingPhotos] = useState(true);

  const CLOUD_FRONT_URL = import.meta.env.VITE_CLOUD_FRONT_URL;
  console.log("CLOUD_FRONT_URL =", CLOUD_FRONT_URL);

  const load = async () => {
    try {
      setLoadingPhotos(true);
      const e = await getEventApi(eventId);
      setEvent(e);
      const p = await getEventPhotosApi(eventId);
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
      {/* UPLOAD */}
<section className="bg-white border rounded-xl p-4">
  <form
    onSubmit={handleUpload}
    className="flex flex-col gap-4"
  >
    {/* DROPZONE */}
    <label
      className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 cursor-pointer transition ${
        uploading
          ? "border-slate-300 bg-slate-50 cursor-not-allowed"
          : "border-slate-400 hover:border-slate-900 hover:bg-slate-50"
      }`}
    >
      <input
        type="file"
        multiple
        disabled={uploading}
        className="hidden"
        onChange={(e) => setFiles([...e.target.files])}
      />

      <div className="text-center space-y-2">
        <div className="text-sm font-medium text-slate-700">
          {files.length
            ? `${files.length} file(s) selected`
            : "Click to select photos"}
        </div>
        <p className="text-xs text-slate-500">
          JPG, PNG • Multiple files supported
        </p>
      </div>
    </label>

    {/* UPLOAD BUTTON */}
    <div className="flex justify-end">
      <button
        type="submit"
        disabled={uploading || !files.length}
        className={`px-4 py-2 rounded text-white flex items-center gap-2 ${
          uploading || !files.length
            ? "bg-slate-400 cursor-not-allowed"
            : "bg-slate-900 hover:bg-slate-800"
        }`}
      >
        {uploading && (
          <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        )}
        {uploading ? "Uploading..." : "Upload Photos"}
      </button>
    </div>
  </form>
</section>


      {/* PHOTO GRID */}
      <section className="bg-white border rounded-xl p-4">
        <h2 className="text-lg font-medium">Photos ({photos.length})</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          {loadingPhotos ? (
            <ImageGridSkeleton count={8} />
          ) : photos.length ? (
            photos.map((p) => (
              <img
                key={p._id}
                src={`https://${CLOUD_FRONT_URL}/${p.originalKey}`}
                className="w-full h-40 object-cover rounded"
              />
            ))
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

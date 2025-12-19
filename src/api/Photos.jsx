import api from "./Client.jsx";

// 1️⃣ Get presigned URL
export const getUploadUrlApi = async ({ eventId, filename, contentType }) => {
  const res = await api.post("/photos/upload-url", {
    eventId,
    filename,
    contentType,
  });
  return res.data; // { uploadUrl, key }
};

// 2️⃣ Upload to S3
export const uploadToS3 = async (uploadUrl, file) => {
  const res = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
    },
    body: file,
  });

  if (!res.ok) {
    throw new Error("S3 upload failed");
  }
};

// 3️⃣ CONFIRM upload (🔥 YOU MISSED THIS)
export const confirmUploadApi = async ({ eventId, key }) => {
  const res = await api.post("/photos/confirm", {
    eventId,
    key,
  });
  return res.data;
};

// 4️⃣ List photos
export const getEventPhotosApi = async (eventId) => {
  const res = await api.get(`/photos/events/${eventId}`);
  return res.data;
};

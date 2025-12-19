import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { getDownloadByTokenApi } from "../../api/Orders.jsx";
import { toastError, toastSuccess } from "../../utils/toast.jsx";

const ClientDownloadPage = () => {
  const { token } = useParams();
  const location = useLocation();
  const orderIdState = location.state?.orderId;

  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getDownloadByTokenApi(token);
        setPhotos(data.photos);
        toastSuccess("Download ready!");
      } catch {
        toastError("Invalid or expired link");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token]);

  if (loading)
    return (
      <div className="min-h-screen text-slate-50 bg-slate-950 flex items-center justify-center">
        Preparing downloads...
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex justify-center p-4">
      <div className="bg-slate-900/80 p-6 border border-slate-800 rounded-xl max-w-xl w-full">
        <h1 className="text-xl font-semibold mb-4">Your Downloads</h1>

        {orderIdState && (
          <p className="text-xs mb-4">
            Order ID:{" "}
            <span className="bg-slate-800 px-2 py-1 rounded font-mono">
              {orderIdState}
            </span>
          </p>
        )}

        <ul className="space-y-2">
          {photos.map((p, index) => (
            <li key={p.id}>
              <a
                href={p.url}
                target="_blank"
                rel="noreferrer"
                className="text-amber-300 underline"
              >
                Download Photo {index + 1}
              </a>
            </li>
          ))}
        </ul>

        {!photos.length && (
          <p className="text-slate-400 mt-3">No photos available.</p>
        )}
      </div>
    </div>
  );
};

export default ClientDownloadPage;

import React from "react";
import QRCode from "react-qr-code";
import { useParams } from "react-router-dom";

const ClientLinkPage = () => {
  const { code } = useParams();

  const galleryUrl = `${window.location.origin}/g/${code}`;

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-xl rounded-xl p-8 max-w-md w-full text-center border border-slate-200">
        
        <h1 className="text-2xl font-bold text-slate-800 mb-2">
          Your Photo Gallery
        </h1>

        <p className="text-slate-600 mb-4 text-sm">
          Share this link or QR code with your clients.  
          They can open their gallery instantly.
        </p>

        <div className="flex justify-center mb-4">
          <QRCode
            value={galleryUrl}
            size={180}
            className="p-2 bg-white rounded-md border border-slate-300"
          />
        </div>

        <div>
          <p className="text-xs text-slate-500 mb-1">
            Gallery Link:
          </p>
          <a
            href={galleryUrl}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 underline break-all"
          >
            {galleryUrl}
          </a>
        </div>

        <button
          onClick={() => window.open(galleryUrl, "_blank")}
          className="mt-6 w-full py-2.5 text-sm rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-800"
        >
          Open Client Gallery
        </button>
      </div>
    </div>
  );
};

export default ClientLinkPage;

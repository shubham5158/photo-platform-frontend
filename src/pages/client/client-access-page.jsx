import React, { useState } from "react";
import { Camera, ArrowLeft } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { toastError } from "../../utils/toast.jsx";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ClientAccessPage = () => {
  const [accessCode, setAccessCode] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAccessCodeSubmit = async (e) => {
    e.preventDefault();

    const code = accessCode.trim();
    if (!code) {
      toastError("Please enter your access code");
      return;
    }

    try {
      setLoading(true);

      // 🔥 VERIFY CODE WITH BACKEND
      const res = await fetch(`${API_BASE_URL}/gallery/${code}`);

      if (!res.ok) {
        if (res.status === 404) {
          toastError("Invalid access code. Please check and try again.");
        } else {
          toastError("Unable to verify access code");
        }
        return; // ❌ DO NOT NAVIGATE
      }

      // ✅ VALID CODE → ALLOW ACCESS
      navigate(`/g/${code}`);
    } catch (err) {
      toastError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-card border border-border rounded-xl shadow-lg p-6">
        {/* HEADER */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <Camera className="h-8 w-8 text-primary" />
          </div>

          <h1 className="text-2xl font-bold mb-2">Access Your Gallery</h1>

          <p className="text-muted-foreground">
            Enter your event access code to view your photos
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleAccessCodeSubmit} className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="access-code" className="text-sm font-medium">
              Access Code
            </label>

            <input
              id="access-code"
              placeholder="e.g., da322f70"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value.toLowerCase())}
              className="w-full text-center text-lg font-mono px-3 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />

            <p className="text-xs text-muted-foreground">
              Find your access code on the card provided at your event
            </p>
          </div>

          <button
            type="submit"
            disabled={!accessCode || loading}
            className="w-full bg-primary text-primary-foreground py-2 rounded-md font-medium disabled:opacity-50"
          >
            {loading ? "Checking..." : "Access Gallery"}
          </button>
        </form>

        {/* FOOTER */}
        <div className="mt-6 pt-6 border-t border-border text-center space-y-3">
          <p className="text-sm text-muted-foreground">
            Don’t have an access code?
          </p>

          {/* 👉 CLIENT LOGIN */}
          <Link
            to="/login"
            className="inline-flex items-center justify-center w-full text-sm font-medium text-primary hover:underline"
          >
            Login as Client
          </Link>

          {/* BACK */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ClientAccessPage;

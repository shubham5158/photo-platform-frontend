import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyOtpApi, resendOtpApi } from "../../api/Auth.jsx";
import { toastSuccess, toastError } from "../../utils/toast.jsx";
import { Loader2 } from "lucide-react";

const RESEND_DELAY = 30;
const OTP_LENGTH = 6;

const VerifyOtpPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const email = state?.email;

  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [timer, setTimer] = useState(RESEND_DELAY);
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);

  const inputsRef = useRef([]);
  const otpIndexes = useMemo(
    () => Array.from({ length: OTP_LENGTH }, (_, i) => i),
    []
  );

  /* 🚨 If page refreshed without email */
  useEffect(() => {
    if (!email) {
      navigate("/register", { replace: true });
    }
  }, [email, navigate]);

  /* ⏱ Resend timer */
  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((t) => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  /* 🔐 VERIFY OTP */
  const handleVerify = useCallback(async () => {
    const otpValue = otp.join("");

    if (otpValue.length !== OTP_LENGTH) {
      toastError("Enter 6 digit OTP");
      return;
    }

    try {
      setVerifying(true);
      await verifyOtpApi(email, otpValue);
      toastSuccess("Email verified successfully!");
      navigate("/admin/login");
    } catch (err) {
      toastError(err?.response?.data?.message || "Invalid or expired OTP");
    } finally {
      setVerifying(false);
    }
  }, [otp, email, navigate]);

  /* 🔁 RESEND OTP */
  const handleResend = useCallback(async () => {
    try {
      setResending(true);
      await resendOtpApi(email);
      toastSuccess("OTP resent successfully");
      setOtp(Array(OTP_LENGTH).fill(""));
      setTimer(RESEND_DELAY);
      inputsRef.current[0]?.focus();
    } catch (err) {
      toastError(err?.response?.data?.message || "Failed to resend OTP");
    } finally {
      setResending(false);
    }
  }, [email]);

  /* ✍ OTP INPUT CHANGE */
  const handleChange = useCallback((e, index) => {
    const value = e.target.value.replace(/\D/g, "");

    if (!value) return;

    setOtp((prev) => {
      const next = [...prev];
      next[index] = value[0];
      return next;
    });

    if (index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  }, []);

  /* ⌫ BACKSPACE HANDLING */
  const handleKeyDown = useCallback((e, index) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      setOtp((prev) => {
        const next = [...prev];
        if (next[index]) {
          next[index] = "";
        } else if (index > 0) {
          next[index - 1] = "";
          inputsRef.current[index - 1]?.focus();
        }
        return next;
      });
    }
  }, []);

  /* 📋 PASTE FULL OTP */
  const handlePaste = useCallback((e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "");
    if (pasted.length !== OTP_LENGTH) return;

    const nextOtp = pasted.split("").slice(0, OTP_LENGTH);
    setOtp(nextOtp);
    inputsRef.current[OTP_LENGTH - 1]?.focus();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-semibold text-center mb-2">
          Email Verification
        </h1>
        <p className="text-center text-gray-400 mb-8">
          Code sent to <span className="font-semibold">{email}</span>
        </p>

        {/* OTP INPUTS */}
        <div
          className="flex justify-center gap-3 mb-8"
          onPaste={handlePaste}
        >
          {otpIndexes.map((i) => (
            <input
              key={i}
              ref={(el) => (inputsRef.current[i] = el)}
              maxLength={1}
              value={otp[i]}
              onChange={(e) => handleChange(e, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              className="w-12 h-12 text-center border rounded-xl text-lg focus:ring-2 focus:ring-blue-600 outline-none"
            />
          ))}
        </div>

        {/* VERIFY BUTTON */}
        <button
          onClick={handleVerify}
          disabled={verifying}
          className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 font-semibold text-white transition ${
            verifying
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-700 hover:bg-blue-800"
          }`}
        >
          {verifying && <Loader2 size={18} className="animate-spin" />}
          {verifying ? "Verifying..." : "Verify Account"}
        </button>

        {/* RESEND */}
        <div className="text-center mt-4 text-sm text-gray-500">
          {timer > 0 ? (
            <span>Resend OTP in {timer}s</span>
          ) : (
            <button
              onClick={handleResend}
              disabled={resending}
              className="text-blue-600 font-medium disabled:opacity-50"
            >
              {resending ? "Resending..." : "Resend OTP"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyOtpPage;

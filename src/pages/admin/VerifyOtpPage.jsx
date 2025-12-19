import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyOtpApi, resendOtpApi } from "../../api/Auth.jsx";
import { toastSuccess, toastError } from "../../utils/toast.jsx";

const RESEND_DELAY = 30;

const VerifyOtpPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const email = state?.email;

  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(RESEND_DELAY);
  const inputsRef = useRef([]);

  const otpIndexes = useMemo(() => [0, 1, 2, 3, 4, 5], []);

  /* ⏱ Timer */
  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((t) => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  /* VERIFY */
  const handleVerify = useCallback(async () => {
    if (otp.length !== 6) {
      toastError("Enter 6 digit OTP");
      return;
    }
    try {
      await verifyOtpApi(email, otp);
      toastSuccess("Email verified successfully!");
      navigate("/admin/login");
    } catch (err) {
      toastError(err?.response?.data?.message || "Invalid or expired OTP");
    }
  }, [otp, email, navigate]);

  /* RESEND */
  const handleResend = useCallback(async () => {
    try {
      await resendOtpApi(email);
      toastSuccess("OTP resent successfully");
      setOtp("");
      setTimer(RESEND_DELAY);
    } catch (err) {
      toastError(err?.response?.data?.message || "Failed to resend OTP");
    }
  }, [email]);

  /* OTP CHANGE */
  const handleChange = useCallback((e, index) => {
    const value = e.target.value.replace(/\D/g, "");
    if (!value) return;

    setOtp((prev) => {
      const arr = prev.split("");
      arr[index] = value;
      return arr.join("").slice(0, 6);
    });

    if (index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-semibold text-center mb-2">
          Email Verification
        </h1>
        <p className="text-center text-gray-400 mb-8">
          Code sent to <span className="font-semibold">{email}</span>
        </p>

        {/* OTP INPUTS */}
        <div className="flex justify-center gap-3 mb-8">
          {otpIndexes.map((i) => (
            <input
              key={i}
              ref={(el) => (inputsRef.current[i] = el)}
              maxLength={1}
              value={otp[i] || ""}
              onChange={(e) => handleChange(e, i)}
              className="w-12 h-12 text-center border rounded-xl text-lg"
            />
          ))}
        </div>

        <button
          onClick={handleVerify}
          className="w-full py-3 rounded-xl bg-blue-700 text-white font-semibold"
        >
          Verify Account
        </button>

        <div className="text-center mt-4 text-sm text-gray-500">
          {timer > 0 ? (
            <span>Resend OTP in {timer}s</span>
          ) : (
            <button
              onClick={handleResend}
              className="text-blue-600 font-medium"
            >
              Resend OTP
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyOtpPage;

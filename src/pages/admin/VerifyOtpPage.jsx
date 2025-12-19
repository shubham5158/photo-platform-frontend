import React, { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyOtpApi } from "../../api/Auth.jsx";
import { toastSuccess, toastError } from "../../utils/toast.jsx";

const VerifyOtpPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const email = state?.email;

  const [otp, setOtp] = useState("");
  const inputsRef = useRef([]);

  const handleVerify = async () => {
    try {
      if (!otp || otp.length !== 6) {
        toastError("Enter 6 digit OTP");
        return;
      }

      await verifyOtpApi(email, otp.trim());
      toastSuccess("Email verified successfully!");
      navigate("/admin/login");
    } catch (err) {
      toastError(err?.response?.data?.message || "Invalid or expired OTP");
    }
  };

  const handleChange = (e, index) => {
    const value = e.target.value.replace(/\D/g, "");
    if (!value) return;

    const newOtp = otp.split("");
    newOtp[index] = value;
    const finalOtp = newOtp.join("").slice(0, 6);
    setOtp(finalOtp);

    // move to next input
    if (index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      const newOtp = otp.split("");
      newOtp[index] = "";
      setOtp(newOtp.join(""));

      if (index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col justify-center bg-gray-50 py-12">
      <div className="bg-white px-6 pt-10 pb-9 shadow-xl mx-auto w-full max-w-lg rounded-2xl">
        <div className="mx-auto flex w-full max-w-md flex-col space-y-14">

          {/* HEADER */}
          <div className="text-center space-y-2">
            <h1 className="font-semibold text-3xl">Email Verification</h1>
            <p className="text-sm text-gray-400">
              We have sent a code to{" "}
              <span className="font-semibold">{email || "your email"}</span>
            </p>
          </div>

          {/* OTP INPUTS */}
          <div className="flex justify-center gap-3">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <input
                key={i}
                ref={(el) => (inputsRef.current[i] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={otp[i] || ""}
                onChange={(e) => handleChange(e, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                className="w-14 h-14 text-center text-lg rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-blue-600"
              />
            ))}
          </div>

          {/* ACTIONS */}
          <div className="space-y-5">
            <button
              onClick={handleVerify}
              className="w-full py-4 rounded-xl bg-blue-700 text-white font-semibold"
            >
              Verify Account
            </button>

            <div className="text-center text-sm text-gray-500">
              Didn’t receive code?{" "}
              <span className="text-blue-600 cursor-pointer">Resend</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default VerifyOtpPage;

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/Common/Breadcrumb";

const VerifyEmailPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!email || !otp) {
      setError("Please enter both email and OTP");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${
          process.env.NODE_ENV === "production"
            ? process.env.NEXT_PUBLIC_BASEURL
            : process.env.NEXT_PUBLIC_BASEURL_LOCAL
        }/verify-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp }),
        }
      );

      const data = await res.json();

      if (res.ok && data.success) {
        setMessage("Verification successful. Redirecting...");
        setTimeout(() => router.replace("/signin"), 3000);
      } else {
        setError(data.message || "Invalid OTP");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!email) {
      setError("Enter your email to resend OTP");
      return;
    }

    setResending(true);
    try {
      const res = await fetch(
        `${
          process.env.NODE_ENV === "production"
            ? process.env.NEXT_PUBLIC_BASEURL
            : process.env.NEXT_PUBLIC_BASEURL_LOCAL
        }/resend-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();
      if (res.ok && data.success) {
        setMessage("OTP resent successfully to your email");
        setError("");
      } else {
        setError(data.message || "Failed to resend OTP");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setResending(false);
    }
  };

  return (
    <>
      <Breadcrumb title="Email Verification" pages={["Verify OTP"]} />
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="max-w-[570px] w-full mx-auto rounded-xl bg-white shadow-1 p-4 sm:p-7.5 xl:p-11">
            <div className="text-center mb-11">
              <h2 className="font-semibold text-xl sm:text-2xl xl:text-heading-5 text-dark mb-1.5">
                Verify Your Email
              </h2>
              <p>We’ve sent an OTP to your email. Enter it below to verify.</p>
            </div>

            <form onSubmit={handleVerify}>
              <div className="mb-5">
                <label htmlFor="email" className="block mb-2.5">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="rounded-lg border border-gray-3 bg-gray-1 w-full py-3 px-5 outline-none focus:ring-2 focus:ring-blue/20"
                  required
                />
              </div>

              <div className="mb-5">
                <label htmlFor="otp" className="block mb-2.5">
                  OTP Code
                </label>
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter the 6-digit code"
                  className="rounded-lg border border-gray-3 bg-gray-1 w-full py-3 px-5 outline-none focus:ring-2 focus:ring-blue/20"
                  required
                />
              </div>

              {message && (
                <p className="text-green-500 text-center mb-4">{message}</p>
              )}
              {error && (
                <p className="text-red-500 text-center mb-4">{error}</p>
              )}

              <button
                type="submit"
                className="w-full flex justify-center font-medium text-white bg-dark py-3 px-6 rounded-lg hover:bg-blue"
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify Email"}
              </button>

              <p className="text-sm mt-4 text-center">
                Didn’t receive OTP?{" "}
                <button
                  type="button"
                  onClick={handleResendOTP}
                  className="text-blue hover:underline"
                  disabled={resending}
                >
                  {resending ? "Sending..." : "Resend OTP"}
                </button>
              </p>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default VerifyEmailPage;

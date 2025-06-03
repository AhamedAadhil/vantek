"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import Breadcrumb from "@/components/Common/Breadcrumb";

const ResetPassword = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const userId = searchParams.get("id");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (password !== confirmPassword) {
      setMessage("");
      setError("Passwords do not match");

      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, userId, password }),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        setError("");
        setMessage("Password reset successful. Redirecting...");

        setTimeout(() => router.replace("/signin"), 3000);
      } else {
        setMessage("");
        setError(data.message || "Reset failed");
      }
    } catch (err) {
      setLoading(false);
      setMessage("");
      setError("Something went wrong");
    }
  };

  return (
    <>
      <Breadcrumb title="Reset Password" pages={["Reset Password"]} />
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="max-w-[570px] w-full mx-auto rounded-xl bg-white shadow-1 p-4 sm:p-7.5 xl:p-11">
            <div className="text-center mb-11">
              <h2 className="font-semibold text-xl sm:text-2xl xl:text-heading-5 text-dark mb-1.5">
                Reset Your Password
              </h2>
              <p>Enter your new password below</p>
            </div>

            <form onSubmit={handleReset}>
              <div className="mb-5">
                <label htmlFor="password" className="block mb-2.5">
                  New Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="New password"
                  className="rounded-lg border border-gray-3 bg-gray-1 w-full py-3 px-5 outline-none focus:ring-2 focus:ring-blue/20"
                  required
                />
              </div>

              <div className="mb-5">
                <label htmlFor="confirmPassword" className="block mb-2.5">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
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
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default ResetPassword;

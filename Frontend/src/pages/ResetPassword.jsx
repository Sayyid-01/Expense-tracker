import { useState, useEffect, React } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      const uuid = window.location.pathname.split("/").pop();
      await axios.post(`${import.meta.env.VITE_BACKEND_API}/users/password/reset_password/${uuid}`, { password });
      alert("Password reset successful. Please log in with your new password.");
      navigate("/");
    } catch (err) {
      setError(err.response.data.message || "An error occurred");
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] px-6 lg:px-12">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center">
        <div className="w-full max-w-md">
          <div className="rounded-3xl border border-gray-200 bg-white p-7 shadow-lg">
            <div className="mb-6">
              <p className="text-xs font-bold tracking-[0.2em] text-gray-400">
                ACCOUNT
              </p>
              <h2 className="mt-1 font-serif text-3xl font-semibold">
                Reset Password
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Create a new password for your account.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-semibold">
                  New Password
                </label>
                <Input
                  type="password"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold">
                  Confirm Password
                </label>
                <Input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              {error && (
                <p className="text-center text-sm font-medium text-red-500">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                text="Reset Password"
              />
            </form>

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-xs text-gray-400">Remembered it?</span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>

            <p className="text-center text-sm text-gray-500">
              Remember your password?{" "}
              <Link
                to="/login"
                className="font-semibold text-black hover:underline"
              >
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
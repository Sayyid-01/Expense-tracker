import React, { useState } from "react";
import axios from "axios";


const ForgotPassword = ({ onClose }) => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            setMessage("Please enter your email.");
            return;
        }
        try {
            setLoading(true);
            setMessage("");
            const response = await axios.post(
                "${import.meta.env.VITE_BACKEND_API}/users/password/forgot_password",
                { email }
            );

            setMessage(response.data.message);
            setEmail("");

        } catch (error) {
            setMessage(
                "Something went wrong. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-7 shadow-xl">
                <div className="mb-5 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold tracking-[0.2em] text-gray-400">
                            ACCOUNT
                        </p>
                        <h2 className="mt-1 font-serif text-3xl font-semibold">
                            Forgot Password
                        </h2>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-xl text-gray-400 hover:bg-gray-100 hover:text-black"
                    >
                        ×
                    </button>
                </div>

                <p className="mb-5 text-sm leading-6 text-gray-500">
                    Enter your email and we'll send you a password reset email.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="mb-1.5 block text-sm font-semibold">
                            Email
                        </label>
                        <input
                            type="email"
                            placeholder="you@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none focus:border-gray-400 focus:bg-white"
                        />
                    </div>

                    <button
                        type="submit"
                        className="h-12 w-full rounded-xl bg-black text-sm font-semibold text-white hover:bg-gray-800"
                    >
                        {loading ? "Sending..." : "Send Email"}
                    </button>
                </form>

                {message && (
                    <p className="mt-4 text-center text-sm text-gray-600">
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
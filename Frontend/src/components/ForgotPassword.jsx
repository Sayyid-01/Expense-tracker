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
                "${import.meta.env.VITE_BACKEND_URL}/users/password/forgot_password",
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
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white w-96 rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">
                        Forgot Password
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-500 hover:text-black text-xl cursor-pointer"
                    >
                        ×
                    </button>
                </div>

                <p className="text-sm text-gray-500 mb-5">
                    Enter your email and we'll send you a password reset email.
                </p>

                <form onSubmit={handleSubmit}>
                    <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:border-blue-500"
                    />
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 cursor-pointer"
                    >
                        {loading ? "Sending..." : "Send Email"}
                    </button>

                </form>

                {message && (
                    <p className="text-sm text-center mt-4 text-gray-600">{message}</p>
                )}
            </div>

        </div>
    );
};

export default ForgotPassword;
import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const EyeIcon = ({ off }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {off ? (
            <>
                <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                <line x1="2" y1="2" x2="22" y2="22" />
            </>
        ) : (
            <>
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
            </>
        )}
    </svg>
);

const PasswordField = ({ label, name, placeholder, value, onChange }) => {
    const [show, setShow] = useState(false);
    return (
        <div>
            <label className="mb-1.5 block text-sm font-semibold">{label}</label>
            <div className="relative">
                <input
                    name={name}
                    type={show ? "text" : "password"}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 pl-4 pr-12 text-sm outline-none focus:border-gray-400 focus:bg-white"
                />
                <button
                    type="button"
                    onClick={() => setShow((s) => !s)}
                    aria-label={show ? "Hide password" : "Show password"}
                    className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-gray-400 hover:text-black"
                >
                    <EyeIcon off={show} />
                </button>
            </div>
        </div>
    );
};

const ResetPassword = () => {
    const [form, setForm] = useState({
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.password !== form.confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        try {
            const uuid = window.location.pathname.split("/").pop();
            await axios.post(
                `${import.meta.env.VITE_BACKEND_API}/users/password/reset_password/${uuid}`,
                { password: form.password }
            );
            alert("Password reset successful. Please log in with your new password.");
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.message || "An error occurred");
        }
    };

    return (
        <div className="min-h-screen px-6 lg:px-12">
            <div className="mx-auto flex min-h-screen max-w-6xl items-center gap-12">

                {/* Left side */}
                <div className="hidden flex-1 lg:block">
                    <div className="mb-10 flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-xs font-bold text-white">
                            ET
                        </div>
                        <span className="font-serif text-2xl italic">Expense</span>
                    </div>

                    <p className="mb-4 text-xs font-bold tracking-[0.3em]">RESET PASSWORD</p>

                    <h1 className="font-serif text-5xl leading-tight">
                        A fresh start
                        <br />
                        for your account.
                    </h1>

                    <p className="mt-5 max-w-lg text-base text-gray-500">
                        Choose a new password and get back to tracking, organizing, and managing your expenses.
                    </p>

                    <div className="mt-7 flex gap-3">
                        <div className="h-36 w-64 overflow-hidden rounded-xl bg-gray-200">
                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtlvaNKi6092OMqVQOne1BJZgAsKiVefUFwSoMfFez52pQy0qxnFswtY0&s=10" alt="" className="h-full w-full object-cover grayscale" />
                        </div>
                        <div className="h-36 w-64 overflow-hidden rounded-xl bg-gray-200">
                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvI69nUzmLHAqXyTZqjICH1C18ESd-Opd14scxvigOvzzRnGvzCMCqlHcJ&s=10" alt="" className="h-full w-full object-cover grayscale" />
                        </div>
                    </div>
                </div>

                {/* Reset form */}
                <div className="w-full max-w-md">
                    <div className="rounded-3xl border border-gray-200 bg-white p-7 shadow-lg">
                        <h2 className="font-serif text-3xl font-semibold">Reset password</h2>
                        <p className="mt-1 text-sm text-gray-500">Create a new password for your account.</p>

                        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                            <PasswordField
                                label="New password"
                                name="password"
                                placeholder="Enter new password"
                                value={form.password}
                                onChange={handleChange}
                            />

                            <PasswordField
                                label="Confirm password"
                                name="confirmPassword"
                                placeholder="Confirm new password"
                                value={form.confirmPassword}
                                onChange={handleChange}
                            />

                            {error && (
                                <p className="text-center text-sm font-medium text-red-500">
                                    {error}
                                </p>
                            )}

                            <button
                                type="submit"
                                className="h-12 w-full rounded-xl bg-black text-sm font-semibold text-white hover:bg-gray-800"
                            >
                                Reset password
                            </button>
                        </form>

                        <div className="my-6 flex items-center gap-3">
                            <div className="h-px flex-1 bg-gray-200" />
                            <span className="text-xs text-gray-400">Remembered it?</span>
                            <div className="h-px flex-1 bg-gray-200" />
                        </div>

                        <p className="text-center text-sm text-gray-500">
                            Remember your password?{" "}
                            <Link to="/login" className="font-semibold text-black hover:underline">
                                Log in here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
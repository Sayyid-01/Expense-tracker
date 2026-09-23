import { useState } from "react";
import { Link, redirect } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";
import { login } from "../services/authService";
import { useNavigate } from "react-router-dom";
import ForgotPassword from "../components/ForgotPassword";
import axios from "axios";



const Login = () => {
    const [form, setForm] = useState({
        email: "",
        password: "",
    });


    const [message, setMessage] = useState("");
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await login(form);
            if (result.message === "Login successful") {
                sessionStorage.setItem("token", result.token);
                setMessage(result.message);
                navigate("/home");
            } else {
                setMessage(result.message || "Login failed");
            }
        } catch (error) {
            setMessage("Unable to connect to the server.");
        }
    };

    return (
        <>

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

                    <p className="mb-4 text-xs font-bold tracking-[0.3em]">WELCOME BACK</p>

                    <h1 className="font-serif text-5xl leading-tight">
                        Back to your
                        <br />
                        finances.
                    </h1>

                    <p className="mt-5 max-w-lg text-base text-gray-500">
                        Continue tracking, organizing, and managing your expenses where you left off.
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

                {/* Login */}
                <div className="w-full max-w-md">
                    <div className="rounded-3xl border border-gray-200 bg-white p-7 shadow-lg">
                        <h2 className="font-serif text-3xl font-semibold">Log in</h2>
                        <p className="mt-1 text-sm text-gray-500">Continue managing your expenses.</p>

                        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                            <div>
                                <label className="mb-1.5 block text-sm font-semibold">Email</label>
                                <input
                                    name="email"
                                    type="email"
                                    placeholder="you@email.com"
                                    value={form.email}
                                    onChange={handleChange}
                                    className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none focus:border-gray-400 focus:bg-white"
                                />
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-semibold">Password</label>
                                <input
                                    name="password"
                                    type="password"
                                    placeholder="Your password"
                                    value={form.password}
                                    onChange={handleChange}
                                    className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none focus:border-gray-400 focus:bg-white"
                                />
                            </div>

                            {message && (
                                <p className="text-center text-sm font-medium text-red-500">
                                    {message}
                                </p>
                            )}

                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => setShowForgotPassword(true)}
                                    className="text-sm font-semibold hover:underline"
                                >
                                    Forgot password?
                                </button>
                            </div>

                            <button
                                type="submit"
                                className="h-12 w-full rounded-xl bg-black text-sm font-semibold text-white hover:bg-gray-800"
                            >
                                Log in
                            </button>
                        </form>

                        <div className="my-6 flex items-center gap-3">
                            <div className="h-px flex-1 bg-gray-200" />
                            <span className="text-xs text-gray-400">New here?</span>
                            <div className="h-px flex-1 bg-gray-200" />
                        </div>

                        <p className="text-center text-sm text-gray-500">
                            Don't have an account?{" "}
                            <Link to="/signup" className="font-semibold text-black hover:underline">
                                Create an account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            {showForgotPassword && (
                <ForgotPassword onClose={() => setShowForgotPassword(false)} />
            )}
        </div>
        
        </>
    );
};

export default Login;
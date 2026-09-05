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
        <div className="flex min-h-screen items-center justify-center bg-slate-100">
            <div className="w-100 rounded-2xl bg-white p-8 shadow-xl">

                <h1 className="mb-6 text-center text-3xl font-bold">
                    Login
                </h1>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <Input label="Email" name="email" type="email" placeholder="Enter your email" value={form.email} onChange={handleChange} />
                    <Input label="Password" name="password" type="password" placeholder="Enter your password" value={form.password} onChange={handleChange} />
                    {message && (
                        <p className="text-center text-red-500 font-medium">
                            {message}
                        </p>
                    )}
                    <Button text="Login" />
                </form>

                <p className="mt-5 text-center">
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-blue-600 font-semibold" >
                        Signup
                    </Link>
                </p>
                <button type="button" onClick={() => setShowForgotPassword(true)} className="text-sm w-full cursor-pointer text-blue-600 hover:underline pointer mt-2 justify-center flex">
                    Forgot Password?
                </button>

            </div>
            <div className="flex items-center justify-center">{showForgotPassword && ( <ForgotPassword onClose={() => setShowForgotPassword(false)}/>)}</div>
            
        </div>

        
    );
};

export default Login;
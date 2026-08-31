import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";
import { signup } from "../services/authService";

const Signup = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await signup(form);

      if (result.message) {
        setMessage(result.message);

        setTimeout(() => {
          navigate("/");
        }, 1000);
      }
    } catch (error) {
      setMessage("Unable to connect to the server.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100">
      <div className="w-100 rounded-2xl bg-white p-8 shadow-xl">
        <h1 className="mb-6 text-center text-3xl font-bold">
          Signup
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Name"
            name="name"
            type="text"
            placeholder="Enter your name"
            value={form.name}
            onChange={handleChange}
          />

          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={handleChange}
          />

          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
          />

          {message && (
            <p className="text-center text-green-600 font-medium">
              {message}
            </p>
          )}

          <Button text="Signup" />
        </form>

        <p className="mt-5 text-center">
          Already have an account?{" "}
          <Link to="/" className="font-semibold text-blue-600">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
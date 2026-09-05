import {useState, useEffect, React} from "react";
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
      await axios.post(`http://localhost:4000/users/password/reset_password/${uuid}`, { password });
      alert("Password reset successful. Please log in with your new password.");
      navigate("/");
    } catch (err) {
      setError(err.response.data.message || "An error occurred");
    }
  };

  return (
    <div className="reset-password-container flex justify-center align-center flex-col gap-4 w-1/3 mx-auto mt-20 p-8 border rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 justify-center align-center w-full">
        <Input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {error && <p className="error">{error}</p>}
        <Button type="submit" text="Reset Password"></Button>
      </form>
      <p className="text-sm text-gray-500">
        Remember your password? <Link to="/login" className="text-blue-500 hover:underline">Login here</Link>
      </p>
    </div>
  );
};

export default ResetPassword;
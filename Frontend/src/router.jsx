import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import ResetPassword from "./pages/ResetPassword";
import ExpenseIncomeReport from "./pages/ExpenseIncomeReport";

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/home" element={<Home />} />
            <Route
                path="/password/reset_password/:uuid"
                element={<ResetPassword />}
            />
            <Route
                path="/expense-income-report"
                element={<ExpenseIncomeReport />}
            />
        </Routes>
    );
}
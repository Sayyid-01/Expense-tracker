import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import ResetPassword from "./pages/ResetPassword";
import ExpenseIncomeReport from "./pages/ExpenseIncomeReport";
import ExpenseBackground from "./components/ExpenseBackground";
import GridBackground from "./components/GridBackground";

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<GridBackground><Login /></GridBackground>} />
            <Route path="/signup" element={<GridBackground><Signup /></GridBackground>} />
            <Route path="/home" element={<ExpenseBackground><Home /></ExpenseBackground>} />
            <Route
                path="/password/reset_password/:uuid"
                element={<ResetPassword />}
            />
            <Route
                path="/expense-income-report"
                element={<ExpenseBackground><ExpenseIncomeReport /> </ExpenseBackground>}
            />
        </Routes>
    );
}
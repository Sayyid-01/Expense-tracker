
import { useEffect, useState } from "react";
import { getExpenses } from "../services/expenseService";
import { data } from "react-router-dom";
import axios from "axios";

const ExpenseIncomeReport = () => {
    const [expenses, setExpenses] = useState([]);
    const [filteredExpenses, setFilteredExpenses] = useState([]);
    const [type, setType] = useState("daily");
    const [totalExpense, setTotalExpense] = useState(0);
    const [showHistory, setShowHistory] = useState(false);
    const [reportHistory, setReportHistory] = useState([]);
    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const data = await getExpenses();
                setExpenses(data.expenses || []);
            } catch (error) {
                console.error("Error fetching expenses:", error);
            }
        };

        fetchExpenses();
    }, []);

    useEffect(() => {
        const now = new Date();

        const filtered = expenses.filter((item) => {
            const date = new Date(item.createdAt);
            if (type === "daily") {
                return (
                    date.getDate() === now.getDate() &&
                    date.getMonth() === now.getMonth() &&
                    date.getFullYear() === now.getFullYear()
                );
            }
            if (type === "weekly") {
                const weekAgo = new Date();
                weekAgo.setDate(now.getDate() - 7);
                return date >= weekAgo && date <= now;
            }
            if (type === "monthly") {
                return (
                    date.getMonth() === now.getMonth() &&
                    date.getFullYear() === now.getFullYear()
                );
            }
            return true;
        });
        setFilteredExpenses(filtered);
        const totalExpense = filtered.reduce((acc, item) => acc + item.amount, 0);
        setTotalExpense(totalExpense);
    }, [type, expenses]);

    const downloadExpenseReport = async () => {
        const token = sessionStorage.getItem("token");
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_API}/expenses/download`,
            {
                params: {
                    expenses: JSON.stringify(filteredExpenses),
                    type: type
                },
                headers: {
                    "Content-Type": "application/JSON",
                    "Authorization": `Bearer ${token}`,
                },
            }
        )
        window.open(res.data.fileUrl, "_blank");
    }

    const getReportHistory = async () => {
        const token = sessionStorage.getItem("token");
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_API}/expenses/reports-history`,
            {
                headers: {
                    "Content-Type": "application/JSON",
                    "Authorization": `Bearer ${token}`,
                },
            }
        )
        setReportHistory(res.data)
        setShowHistory(true);
    }


    return (
        <>
            <div className="min-h-screen bg-[#fafafa] px-6 py-8 lg:px-12">
                <div className="mx-auto max-w-6xl">

                    {/* Report */}
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                        <div className="mb-6">
                            <p className="text-xs font-bold tracking-[0.2em] text-gray-400">REPORTS</p>
                            <h2 className="mt-1 font-serif text-3xl font-semibold">Expense Report</h2>
                        </div>

                        <div className="mb-5 flex justify-center gap-2">
                            <button
                                onClick={() => setType("daily")}
                                className={`rounded-xl border px-4 py-2 text-sm font-medium ${type === "daily"
                                        ? "border-black bg-black text-white"
                                        : "border-gray-200 bg-white hover:bg-gray-50"
                                    }`}
                            >
                                Daily
                            </button>

                            <button
                                onClick={() => setType("weekly")}
                                className={`rounded-xl border px-4 py-2 text-sm font-medium ${type === "weekly"
                                        ? "border-black bg-black text-white"
                                        : "border-gray-200 bg-white hover:bg-gray-50"
                                    }`}
                            >
                                Weekly
                            </button>

                            <button
                                onClick={() => setType("monthly")}
                                className={`rounded-xl border px-4 py-2 text-sm font-medium ${type === "monthly"
                                        ? "border-black bg-black text-white"
                                        : "border-gray-200 bg-white hover:bg-gray-50"
                                    }`}
                            >
                                Monthly
                            </button>
                        </div>

                        <p className="mb-5 text-center text-sm text-gray-500">
                            Showing {type} expenses
                        </p>

                        <div className="overflow-hidden rounded-xl border border-gray-200">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-200 bg-gray-50 text-left">
                                        <th className="px-4 py-3 font-semibold">Date</th>
                                        <th className="px-4 py-3 font-semibold">Description</th>
                                        <th className="px-4 py-3 font-semibold">Category</th>
                                        <th className="px-4 py-3 font-semibold">Amount</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {filteredExpenses.length > 0 ? (
                                        filteredExpenses.map((item) => (
                                            <tr key={item.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                                                <td className="px-4 py-3">
                                                    {new Date(item.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-4 py-3 text-gray-600">{item.description}</td>
                                                <td className="px-4 py-3">
                                                    <span className="rounded-full font-extrabold uppercase font-cursive px-3 py-1 text-xs">
                                                        {item.category}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 font-semibold text-red-600">
                                                    ₹{item.amount.toLocaleString("en-IN")}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="px-4 py-8 text-center text-gray-400">
                                                No expenses found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>

                                <tfoot>
                                    <tr className="bg-gray-50">
                                        <td colSpan="3" className="px-4 py-3 text-right font-semibold">
                                            Total Expense
                                        </td>
                                        <td className="px-4 py-3 font-bold text-red-600">
                                            ₹{totalExpense.toLocaleString("en-IN")}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>

                        <div className="mt-6 flex justify-center">
                            <button
                                onClick={() => downloadExpenseReport()}
                                className="rounded-xl bg-black px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800"
                            >
                                Download Report
                            </button>
                        </div>
                    </div>

                    {/* Report History */}
                    <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold tracking-[0.2em] text-gray-400">HISTORY</p>
                                <h3 className="mt-1 font-serif text-2xl font-semibold">Report History</h3>
                            </div>

                            <button
                                onClick={() => getReportHistory()}
                                className="rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
                            >
                                Check History
                            </button>
                        </div>

                        {showHistory && (
                            <div className="mt-5">
                                <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-3">
                                    <p className="text-sm text-gray-500">Downloaded reports</p>
                                    <span className="text-sm text-gray-500">
                                        {reportHistory.report.length} Reports
                                    </span>
                                </div>

                                {reportHistory.report.length === 0 ? (
                                    <p className="py-6 text-center text-sm text-gray-400">
                                        No reports found.
                                    </p>
                                ) : (
                                    <div className="space-y-3">
                                        {reportHistory.report.map((report) => (
                                            <div
                                                key={report.id}
                                                className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 p-4"
                                            >
                                                <div>
                                                    <p className="font-medium text-gray-900">{report.name}</p>
                                                    <p className="mt-1 text-sm text-gray-500">
                                                        {report.type} Report
                                                    </p>
                                                </div>

                                                <a
                                                    href={report.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
                                                >
                                                    View Report
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </>
    );
};

export default ExpenseIncomeReport;


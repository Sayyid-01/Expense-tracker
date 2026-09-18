
import { useEffect, useState } from "react";
import { getExpenses } from "../services/expenseService";
import { data } from "react-router-dom";
import axios from "axios";

const ExpenseIncomeReport = () => {
    const [expenses, setExpenses] = useState([]);
    const [filteredExpenses, setFilteredExpenses] = useState([]);
    const [type, setType] = useState("daily");
    const [totalExpense, setTotalExpense] = useState(0);

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

    const downloadExpenseReport = async() => {
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


    return (
        <div className="w-2/3 mx-auto mt-20 p-8 border rounded shadow bg-gray-50">
            <h2 className="text-2xl font-bold text-center mb-6">
                Expense Report
            </h2>

            <div className="flex justify-center gap-2 mb-6">
                <button onClick={() => setType("daily")} className={`px-4 py-2 border rounded ${type === "daily" ? "bg-gray-400" : "bg-white"}`}>
                    Daily
                </button>

                <button onClick={() => setType("weekly")} className={`px-4 py-2 border rounded ${type === "weekly" ? "bg-gray-400" : "bg-white"}`} >
                    Weekly
                </button>

                <button onClick={() => setType("monthly")} className={`px-4 py-2 border rounded ${type === "monthly" ? "bg-gray-400" : "bg-white"}`}>
                    Monthly
                </button>
            </div>

            <p className="text-center text-gray-600 mb-4">
                Showing {type} expenses
            </p>

            <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-400">
                        <th className="border p-2">Date</th>
                        <th className="border p-2">Description</th>
                        <th className="border p-2">Category</th>
                        <th className="border p-2">Amount</th>
                    </tr>
                </thead>

                <tbody>
                    {filteredExpenses.length > 0 ? (
                        filteredExpenses.map((item) => (
                            <tr key={item.id}>
                                <td className="border p-2">
                                    {new Date(item.createdAt).toLocaleDateString()}
                                </td>
                                <td className="border p-2">
                                    {item.description}
                                </td>
                                <td className="border p-2">
                                    {item.category}
                                </td>
                                <td className="border p-2 text-red-700">
                                    ₹{item.amount.toLocaleString("en-IN")}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="border p-4 text-center">
                                No expenses found
                            </td>
                        </tr>
                    )}
                </tbody>

                <tfoot>
                    <tr>
                        <td
                            colSpan="3"
                            className="border p-2 text-right font-bold"
                        >
                            Total Expense
                        </td>
                        <td className="border p-2 text-red-700 font-bold">
                            ₹{totalExpense.toLocaleString("en-IN")}
                        </td>
                    </tr>
                </tfoot>
            </table>

            <div className="flex justify-center mt-6">
                <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={() => downloadExpenseReport()}>Download Report</button>
            </div>
        </div>

    );
};

export default ExpenseIncomeReport;


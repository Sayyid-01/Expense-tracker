import { useState } from "react";

const expense = [
    { id: 1, date: "2023-01-01", description: "Lunch", category: "Food", income: 0, expense: 50 },
    { id: 2, date: "2023-01-02", description: "Bus Ticket", category: "Transport", income: 0, expense: 20 },
    { id: 3, date: "2023-01-03", description: "Movie", category: "Entertainment", income: 0, expense: 30 },
    { id: 4, date: "2023-01-04", description: "Electricity Bill", category: "Utilities", income: 0, expense: 100 },
    { id: 5, date: "2023-01-05", description: "House Rent", category: "Rent", income: 0, expense: 500 },
    { id: 6, date: "2023-01-06", description: "Doctor", category: "Health", income: 0, expense: 75 },
    { id: 7, date: "2023-01-07", description: "Course Fee", category: "Education", income: 0, expense: 200 },
    { id: 8, date: "2023-01-05", description: "Monthly Salary", category: "Salary", income: 40000, expense: 0 },
    { id: 9, date: "2023-01-07", description: "Freelance Work", category: "Freelance", income: 5000, expense: 0 }
];
const notes = [
    { id: 1, date: "2023-01-02", notes: "Paid electricity bill" },
    { id: 2, date: "2023-01-04", notes: "Bought groceries" },
    { id: 3, date: "2023-01-06", notes: "Completed course payment" },
];

const ExpenseIncomeReport = () => {
    const [type, setType] = useState("daily");

    const firstDate = new Date(expense[0].date);
    const year = firstDate.getFullYear();
    const month = firstDate.toLocaleString("en-US", { month: "long" });

    const totalIncome = expense.reduce((total, item) => total + item.income, 0);

    const totalExpense = expense.reduce((total, item) => total + item.expense, 0);
    const savings = totalIncome - totalExpense;


    const yearlyReport = {};

    expense.forEach((item) => {
        const date = new Date(item.date);
        const monthName = date.toLocaleString("en-US", { month: "long" });

        if (!yearlyReport[monthName]) {
            yearlyReport[monthName] = { income: 0, expense: 0 };
        }

        yearlyReport[monthName].income += item.income;
        yearlyReport[monthName].expense += item.expense;
    });

    return (
        <div className="expense-income-report-container flex flex-col gap-4 w-2/3 mx-auto mt-20 p-8 border rounded shadow bg-gray-50">
            <h2 className="text-2xl font-bold mb-4 text-center">Day to Day Expenses</h2>
            <div className="flex justify-center">
                <button className="p-2 px-4 text-black border border-gray-300 hover:bg-gray-200 cursor-pointer rounded mr-2" onClick={() => setType("daily")}>Daily</button>
                <button className="p-2 px-4 text-black border border-gray-300 hover:bg-gray-200 cursor-pointer rounded mr-2" onClick={() => setType("weekly")}>Weekly</button>
                <button className="p-2 px-4 text-black border border-gray-300 hover:bg-gray-200 cursor-pointer rounded" onClick={() => setType("monthly")}>Monthly</button>
            </div>

            <span className="text-gray-600">{new Date().toDateString()}</span>

            <div className="expense-report">
                <h3 className="text-xl font-semibold mb-2 text-center">{year}</h3>
                <h3 className="text-lg font-semibold mb-2 text-center">{month}</h3>

                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-400">
                            <th className="border border-gray-300 p-2">Date</th>
                            <th className="border border-gray-300 p-2">Description</th>
                            <th className="border border-gray-300 p-2">Category</th>
                            <th className="border border-gray-300 p-2">Income</th>
                            <th className="border border-gray-300 p-2">Expense</th>
                        </tr>
                    </thead>

                    <tbody>
                        {expense.map((item) => (
                            <tr key={item.id}>
                                <td className="border border-gray-300 p-2">{item.date}</td>
                                <td className="border border-gray-300 p-2">{item.description}</td>
                                <td className="border border-gray-300 p-2">{item.category}</td>
                                <td className="border border-gray-300 p-2">{item.income > 0 ? item.income : ""}</td>
                                <td className="border border-gray-300 p-2">{item.expense > 0 ? item.expense : ""}</td>
                            </tr>
                        ))}
                    </tbody>

                    <tfoot>
                        <tr>
                            <td colSpan="3" className="border border-gray-300 p-2 text-right font-bold">Total</td>
                            <td className="border border-gray-300 p-2 text-green-800 font-bold">{totalIncome}</td>
                            <td className="border border-gray-300 p-2 text-red-800 font-bold">{totalExpense}</td>
                        </tr>
                    </tfoot>
                </table>

                <p className="text-right font-bold mt-2">Savings = {savings}</p>
            </div>

            <div className="yearly-report mt-6">
                <h3 className="text-xl font-semibold mb-2 text-center">Yearly Report</h3>

                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-400">
                            <th className="border border-gray-300 p-2">Month</th>
                            <th className="border border-gray-300 p-2">Income</th>
                            <th className="border border-gray-300 p-2">Expense</th>
                            <th className="border border-gray-300 p-2">Savings</th>
                        </tr>
                    </thead>

                    <tbody>
                        {Object.entries(yearlyReport).map(([month, data]) => (
                            <tr key={month}>
                                <td className="border border-gray-300 p-2">{month}</td>
                                <td className="border border-gray-300 text-green-800 p-2">{data.income}</td>
                                <td className="border border-gray-300 text-red-800 p-2">{data.expense}</td>
                                <td className="border border-gray-300 text-gray-500 p-2">{data.income - data.expense}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="notes-report mt-20">
                <h3 className="text-xl font-semibold mb-2 text-center">Notes Report {year}</h3>

                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-400">
                            <th className="border border-gray-300 p-2">Date</th>
                            <th className="border border-gray-300 p-2">Notes</th>
                        </tr>
                    </thead>

                    <tbody>
                        {notes.map((item) => (
                            <tr key={item.id}>
                                <td className="border border-gray-300 p-2">{item.date}</td>
                                <td className="border border-gray-300 p-2">{item.notes}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>



            <button className="border px-4 py-2 rounded mt-2">
                ↓ Download Expenses
            </button>
        </div>
    );
};

export default ExpenseIncomeReport;
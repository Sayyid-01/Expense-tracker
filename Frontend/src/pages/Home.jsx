
import { useState, useEffect } from "react";
import Input from "../components/Input";
import { Meta, useNavigate } from "react-router-dom";
import {
  addExpense,
  getExpenses,
  deleteExpense
} from "../services/expenseService";
import { load } from "@cashfreepayments/cashfree-js";
import { FcPrevious, FcNext } from "react-icons/fc";

const Home = () => {
  const API = import.meta.env.VITE_BACKEND_API;

  const [form, setForm] = useState({
    amount: "",
    description: "",
    category: "Food",
    note: "",
  });

  const [expenses, setExpenses] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aiCategory, setAiCategory] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(parseInt(localStorage.getItem("Limits")) || 10);
  const [totalExpenses, setTotalExpenses] = useState(0);

  useEffect(() => {
    fetchExpenses();
    checkPremium();
  }, []);


  useEffect(() => {
    fetchExpenses();
  }, [page, limit]);

  useEffect(() => {
    if (form.description.trim()) {
      const timer = setTimeout(() => {
        handleAICategorization();
      }, 700);

      return () => clearTimeout(timer);
    } else {
      setAiCategory("");
      setAiLoading(false);
    }
  }, [form.description]);



  const fetchExpenses = async () => {
    try {
      const data = await getExpenses(page, limit);

      setExpenses(data.expenses || []);
      setTotalPages(data.totalPages);
      setTotalExpenses(data.totalExpenses);
      localStorage.setItem("Limits", limit);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  const checkPremium = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await fetch(`${API}/premium/checkPremium`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setIsPremium(data.isPremium);
    } catch (error) {
      console.error("Premium check error:", error);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleDelete = async (id) => {
    try {
      await deleteExpense(id);
      fetchExpenses();
      handleLeaderboard();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addExpense(form);
      fetchExpenses();

      setForm({
        amount: "",
        description: "",
        category: "Food",
        note: "",
      });
      handleLeaderboard();
    } catch (error) {
      console.error("Error on adding expense:", error);
    }
  };



  const handlePremium = async () => {
    try {
      setLoading(true);

      // Token is from sessionStorage
      const token = sessionStorage.getItem("token");

      // Create order in backend
      const response = await fetch(
        API + "/payment/create_order",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      // Open Cashfree
      const cashfree = await load({
        mode: "sandbox",
      });

      await cashfree.checkout({
        paymentSessionId: data.paymentSessionId,
        redirectTarget: "_modal",
      });

      // Verify payment
      const verifyResponse = await fetch(
        `${API}/payment/verify/${data.orderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await verifyResponse.json();

      if (result.status === "SUCCESSFUL") {
        alert("Transaction successful");

        // Store  premium status in localStorage
        localStorage.setItem("isPremium", "true");

        // Refreshinsg UI
        window.location.reload();

      } else if (result.status === "FAILED") {
        alert("TRANSACTION FAILED.");
      }

    } catch (error) {
      console.error("Payment error:", error);
      alert("Something went wrong");

    } finally {
      setLoading(false);
    }
  };



  const handleLeaderboard = async () => {
    try {

      const token = sessionStorage.getItem("token");
      const response = await fetch(`${API}/premium/showleaderboard`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        alert(data.message || "Failed to load leaderboard");
        return;
      }

      setLeaderboard(data.leaderboard);
      setShowLeaderboard(true);
    } catch (error) {
      console.error("Leaderboard error:", error);
      alert("Somethng went wrong");
    }
  };

  const handleAICategorization = async () => {
    if (!form.description.trim()) {
      setAiCategory("");
      return;
    }

    try {
      setAiLoading(true);

      const token = sessionStorage.getItem("token");
      const response = await fetch(`${API}/expenses/categorize`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ description: form.description }),
      });

      const data = await response.json();
      if (!response.ok) {
        alert(data.message || "Failed to categorize expense");
        return;
      }

      setAiCategory(data.category);

      setForm((prev) => ({
        ...prev,
        category: data.category,
      }));
    } catch (error) {
      console.error("AI server error:", error);
      alert("Something went wrong");
    } finally {
      setAiLoading(false);
    }

  };



  return (
    <div className="min-h-screen px-6 py-8 lg:px-12">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-6 py-5 shadow-sm">
          <div>
            <p className="text-xs font-bold tracking-[0.25em] text-gray-400">EXPENSE TRACKER</p>
            <h1 className="mt-1 font-serif text-3xl font-semibold text-black">Your finances</h1>
          </div>

          {isPremium ? (
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-green-50 px-4 py-2 text-sm font-semibold text-green-700">
                Premium Member
              </span>

              <button
                onClick={handleLeaderboard}
                className="rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
              >
                Leaderboard
              </button>

              <button
                onClick={() => navigate("/expense-income-report")}
                className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-gray-50"
              >
                Reports
              </button>
            </div>
          ) : (
            <button
              onClick={handlePremium}
              disabled={loading}
              className="rounded-xl bg-black px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-50"
            >
              {loading ? "Processing..." : "Buy Premium"}
            </button>
          )}
        </div>

        {/* Main section */}
        <div className="grid gap-6 lg:grid-cols-3">

          {/* Expense form */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <p className="text-xs font-bold tracking-[0.2em] text-gray-400">ADD EXPENSE</p>
              <h2 className="mt-1 font-serif text-2xl font-semibold">New expense</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Amount"
                name="amount"
                type="number"
                placeholder="Enter amount"
                value={form.amount}
                onChange={handleChange}
              />

              <Input
                label="Description"
                name="description"
                type="text"
                placeholder="Enter description"
                value={form.description}
                onChange={handleChange}
              />

              <Input
                label="Note"
                name="note"
                type="text"
                placeholder="Enter note"
                value={form.note}
                onChange={handleChange}
              />

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-900">
                  Category
                </label>

                <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm">
                  {aiLoading ? (
                    <span className="text-gray-500">Analyzing...</span>
                  ) : aiCategory ? (
                    <span className="font-medium text-gray-900">{aiCategory}</span>
                  ) : (
                    <span className="text-gray-400">
                      AI will suggest a category based on description
                    </span>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="mt-2 h-12 w-full rounded-xl bg-black text-sm font-semibold text-white hover:bg-gray-800"
              >
                Add Expense
              </button>
            </form>
          </div>

          {/* Expenses */}
          <div className="lg:col-span-2 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold tracking-[0.2em] text-gray-400">HISTORY</p>
                <h2 className="mt-1 font-serif text-2xl font-semibold">Your expenses</h2>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>Items</span>
                <select
                  value={limit}
                  onChange={(e) => setLimit(parseInt(e.target.value))}
                  className="rounded-lg border border-gray-200 bg-gray-50 px-2 py-1.5 text-sm outline-none"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>

            {/* Pagination */}
            <div className="mb-5 flex items-center justify-between">
              <div className="flex gap-1">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="rounded-lg border border-gray-200 bg-white p-2 text-gray-700 hover:bg-gray-50 disabled:opacity-30"
                >
                  <FcPrevious />
                </button>

                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index}
                    onClick={() => setPage(index + 1)}
                    className={`rounded-lg border px-3 py-1.5 text-sm ${page === index + 1
                        ? "border-black bg-black font-semibold text-white"
                        : "border-gray-200 bg-white hover:bg-gray-50"
                      }`}
                  >
                    {index + 1}
                  </button>
                ))}

                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                  className="rounded-lg border border-gray-200 bg-white p-2 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  <FcNext />
                </button>
              </div>

              <p className="text-sm text-gray-500">
                {(page - 1) * limit + 1}-{Math.min(page * limit, totalExpenses)} of {totalExpenses}
              </p>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 text-left">
                    <th className="px-4 py-3 font-semibold">Amount</th>
                    <th className="px-4 py-3 font-semibold">Description</th>
                    <th className="px-4 py-3 font-semibold">Category</th>
                    <th className="px-4 py-3 font-semibold">Note</th>
                    <th className="px-4 py-3 text-center font-semibold">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {expenses.length > 0 ? (
                    expenses.map((expense) => (
                      <tr key={expense.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                        <td className="px-4 py-3 font-semibold">₹{expense.amount}</td>
                        <td className="px-4 py-3 text-gray-600">{expense.description}</td>
                        <td className="px-4 py-3">
                          <span className="rounded-full  px-3 py-1 text-xs font-extrabold uppercase">
                            {expense.category}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-500">{expense.note}</td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => handleDelete(expense.id)}
                            className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-4 py-8 text-center text-gray-400">
                        No expenses found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Leaderboard */}
        {showLeaderboard && (
          <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-5">
              <p className="text-xs font-bold tracking-[0.2em] text-gray-400">PREMIUM</p>
              <h2 className="mt-1 font-serif text-2xl font-semibold">Leaderboard</h2>
            </div>

            <div className="overflow-hidden rounded-xl border border-gray-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 text-left">
                    <th className="px-4 py-3 font-semibold">Rank</th>
                    <th className="px-4 py-3 font-semibold">Name</th>
                    <th className="px-4 py-3 font-semibold">Total Expense</th>
                  </tr>
                </thead>

                <tbody>
                  {leaderboard.length > 0 ? (
                    leaderboard.map((user, index) => (
                      <tr key={user.userId} className="border-b border-gray-100 last:border-0">
                        <td className="px-4 py-3 font-semibold">{index + 1}</td>
                        <td className="px-4 py-3">{user.name}</td>
                        <td className="px-4 py-3 font-semibold">₹{user.totalExpense}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="px-4 py-6 text-center text-gray-400">
                        No data available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
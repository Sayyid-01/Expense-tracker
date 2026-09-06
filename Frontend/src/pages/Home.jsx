
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
  const API =import.meta.env.VITE_BACKEND_API;

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
      setTotalPages(data.totalPages );
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
    <div className="w-[90%] justify-around mx-auto mt-2 bg-white p-6 rounded-lg shadow">
      <div className="flex justify-around items-center mb-6">
        <h1 className="text-3xl font-bold ">Expense Tracker</h1>
        {isPremium ? (
          <div className="flex items-center justify-between mb-6 p-4 bg-green-50 rounded-lg gap-2">
            <p className="text-green-600 font-semibold pr-3">
              You are a Premium Member
            </p>

            <button
              onClick={handleLeaderboard}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Show Leaderboard
            </button>
            <button
              onClick={() => navigate("/expense-income-report")}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Show Report
            </button>
          </div>


        ) : (
          <div className="flex items-center justify-between mb-6 p-4 bg-yellow-50 rounded-lg">
            <button
              onClick={handlePremium}
              disabled={loading}
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 disabled:opacity-50"
            >
              {loading ? "Process..." : "Buy Premium Membership"}
            </button>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 w-1/2 mx-auto mt-3 border p-8 rounded-2xl shadow bg-gray-50 ">
        <Input label="Amount" name="amount" type="number" placeholder="Enter amount" value={form.amount} onChange={handleChange} />
        <Input label="Description" name="description" type="text" placeholder="Enter description" value={form.description} onChange={handleChange} />
        <Input label="Note" name="note" type="text" placeholder="Enter note" value={form.note} onChange={handleChange} />
        <div>
          <label className="block text-sm font-medium mb-1">
            Category
          </label>
          <div className="w-full border rounded px-3 py-2 bg-gray-50">
            {aiLoading ? (
              <span className="text-gray-500">Analyzing...</span>
            ) : aiCategory ? (
              <span>{aiCategory}</span>
            ) : (
              <span className="text-gray-400">
                Ai will suggested category based on description
              </span>
            )}
          </div>
        </div>
        <div className="flex justify-center">
          <button type="submit" className="w-1/3 bg-green-600 text-white p-2 rounded hover:bg-green-700">
            Add Expense
          </button>
        </div>

      </form>



      <div className="flex w-1/2 justify-between gap-3 m-auto mt-7">
        <div className="flex gap-2">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="bg-gray-300 text-gray-700 p-2 rounded disabled:opacity-30"
          >
            <FcPrevious />
          </button>
          {Array.from({ length: totalPages }, (_, index) => (
            <button onClick={() => setPage(index + 1)} className={`border px-3 py-1 rounded ${page === index + 1 ? "bg-gray-200 font-bold" : ""
              }`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
            className="bg-gray-300 text-gray-700 p-2 rounded disabled:opacity-50"
          >
            <FcNext />
          </button>
        </div>


        <div className="flex items-center">
          <label className="mr-2">Items per page:</label>
          <select value={limit} onChange={(e) => setLimit(parseInt(e.target.value))} className="border rounded px-2 py-1" >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <p className="ml-4">{(page - 1) * limit + 1}-{Math.min(page * limit, totalExpenses)} of {totalExpenses}</p>
        </div>

      </div>

      <table className="w-1/2 mx-auto mt-8 border border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Amount</th>

            <th className="border p-2">Description</th>
            <th className="border p-2">Category</th>
            <th className="border p-2">Action</th>

            <th className="border p-2">Note</th>
          </tr>
        </thead>

        <tbody>
          {expenses.length > 0  ? (
            expenses.map((expense) => (
              <tr key={expense.id}>
                <td className="border p-2">{expense.amount}</td>
                <td className="border p-2">{expense.description}</td>
                <td className="border p-2">{expense.category}</td>
                <td className="border p-2 flex justify-center">
                  <button
                    onClick={() => handleDelete(expense.id)}
                    className="bg-red-600 text-white p-2 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
                <td className="border p-2">{expense.note}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="4"
                className="text-center border p-4 text-gray-500"
              >
                No expenses found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {showLeaderboard && (
        <div className="mt-8 w-1/2 mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Leaderboard</h2>
          </div>

          <table className="w-full border border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Rank</th>
                <th className="border p-2">Name</th>
                <th className="border p-2">Total Expense</th>
              </tr>
            </thead>

            <tbody>
              {leaderboard.length > 0 ? (
                leaderboard.map((user, index) => (
                  <tr key={user.userId}>
                    <td className="border p-2">{index + 1}</td>
                    <td className="border p-2">{user.name}</td>
                    <td className="border p-2">₹{user.totalExpense}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="3"
                    className="text-center border p-4 text-gray-500"
                  >
                    No  data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Home;
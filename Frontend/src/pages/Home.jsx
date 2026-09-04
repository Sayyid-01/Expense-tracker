
import { useState, useEffect } from "react";
import Input from "../components/Input";
import Select from "../components/Select";
import {
  addExpense,
  getExpenses,
  deleteExpense
} from "../services/expenseService";
import { load } from "@cashfreepayments/cashfree-js";

const Home = () => {
  const API = "http://localhost:4000";

  const [form, setForm] = useState({
    amount: "",
    description: "",
    category: "Food",
  });

  const [expenses, setExpenses] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aiCategory, setAiCategory] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    fetchExpenses();
    checkPremium();
  }, []);


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
      const data = await getExpenses();
      setExpenses(data);
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
    <div className="max-w-4xl mx-auto mt-10 bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold ">Expense Tracker</h1>
        {isPremium ? (
          <div className="flex items-center justify-between mb-6 p-4 bg-green-50 rounded-lg">
            <p className="text-green-600 font-semibold pr-3">
              You are a Premium Member
            </p>

            <button
              onClick={handleLeaderboard}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Show Leaderboard
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

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Amount" name="amount" type="number" placeholder="Enter amount" value={form.amount} onChange={handleChange} />
        <Input label="Description" name="description" type="text" placeholder="Enter description" value={form.description} onChange={handleChange} />
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
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Add Expense
        </button>
      </form>

      <table className="w-full mt-8 border border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Amount</th>

            <th className="border p-2">Description</th>
            <th className="border p-2">Category</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>

        <tbody>
          {expenses.length > 0 ? (
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
        <div className="mt-8">
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
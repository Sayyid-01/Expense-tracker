import { useState, useEffect } from "react";
import Input from "../components/Input";
import Select from "../components/Select";
import { addExpense, getExpenses } from "../services/expenseService";

const Home = () => {
  const [form, setForm] = useState({
    amount: "",
    description: "",
    category: "Food",
  });

  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    fetchExpenses();
  }, []);
  const fetchExpenses = async () => {
    try {
      const data = await getExpenses();
      setExpenses(data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
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
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white p-6 rounded-lg shadow">
      <h1 className="text-3xl font-bold text-center mb-6">
        Expense Tracker
      </h1>

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

        <Select
          label="Category"
          name="category"
          value={form.category}
          onChange={handleChange}
          options={[
            "Food",
            "Petrol",
            "Salary",
            "Shopping",
            "Entertainment",
          ]}
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Add Expense
        </button>
      </form>

      <table className="w-full mt-8 border border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Amount</th>
            <th className="border p-2">Description</th>
            <th className="border p-2">Category</th>
          </tr>
        </thead>

        <tbody>
          {expenses.length > 0 ? (
            expenses.map((expense) => (
              <tr key={expense.id}>
                <td className="border p-2">{expense.amount}</td>
                <td className="border p-2">{expense.description}</td>
                <td className="border p-2">{expense.category}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="3"
                className="text-center border p-4 text-gray-500"
              >
                No expenses found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Home;
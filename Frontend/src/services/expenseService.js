const API = "http://localhost:4000/expenses";
import axios from "axios";

export const getExpenses = async () => {
  const response = await axios.get(API);
  return response.data;
};

export const addExpense = async (expense) => {
  const response = await axios.post(API, expense);
  return response.data;
};
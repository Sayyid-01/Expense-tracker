import axios from "axios";
const API = "http://localhost:4000/expenses";

export const getExpenses = async (page = 1) => {
  const token = sessionStorage.getItem("token");
  const response = await axios.get(`${API}?page=${page}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const addExpense = async (expense) => {
  const token = sessionStorage.getItem("token");
  const response = await axios.post(API, expense, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const deleteExpense = async (id) => {
  const token = sessionStorage.getItem("token");
  const response = await axios.delete(`${API}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
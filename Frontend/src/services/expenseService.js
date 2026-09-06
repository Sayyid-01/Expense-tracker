import axios from "axios";
const API = `${import.meta.env.VITE_BACKEND_API}/expenses`;

export const getExpenses = async (page = 1, limit = 10) => {
  const token = sessionStorage.getItem("token");
  const response = await axios.get(`${API}?page=${page}&limit=${limit}`, {
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
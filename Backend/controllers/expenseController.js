import Expense from "../models/Expense.js";

export const addExpense = async (req, res) => {
  try {
    const expense = await Expense.create(req.body);
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.findAll();

    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
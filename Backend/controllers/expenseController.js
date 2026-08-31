import Expense from "../models/Expense.js";

export const addExpense = async (req, res) => {
  try {
    const expense = await Expense.create({
      ...req.body,
      userId: req.user.id,
    });

    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

export const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.findAll({
      where: {
        userId: req.user.id,
      },
    });

    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

export const deleteExpense = async (req, res) => {
  try {
    const deleted = await Expense.destroy({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });
    if (!deleted) {
      return res.status(404).json({
        message: "Expense not found",
      });
    }
    res.json({
      message: "Expense deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
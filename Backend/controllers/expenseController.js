import Expense from "../models/Expense.js";
import User from "../models/User.js";

export const addExpense = async (req, res) => {
  try {

    const { amount } = req.body;
    const expense = await Expense.create({
      ...req.body,
      userId: req.user.id,
    });

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    await user.increment("totalExpense", { by: Number(amount), });
    await user.reload();

    res.status(201).json({
      message: "Expense added successfully",
      expense,
      totalExpense: user.totalExpense,
    });
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
    const expense = await Expense.findByPk(req.params.id);

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
    const user = await User.findByPk(req.user.id);
    await user.decrement("totalExpense", { by: Number(expense.amount) });
    await user.reload();
    res.json({
      message: "Expense deleted successfully",
      totalExpense: user.totalExpense,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
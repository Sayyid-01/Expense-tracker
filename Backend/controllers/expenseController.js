import Expense from "../models/Expense.js";
import User from "../models/User.js";
import { categorizeExpense } from "../services/aiServices.js";
import sequelize from "../config/database.js";

export const addExpense = async (req, res) => {

  const transaction = await sequelize.transaction();
  try {

    const { amount } = req.body;
    const expense = await Expense.create({
      ...req.body,
      userId: req.user.id,
    }, { transaction
    });

    const user = await User.findByPk(req.user.id, { transaction });
    if (!user) {
      await transaction.rollback();
      return res.status(404).json({
        message: "User not found",
      });
    }

    await user.increment("totalExpense", { by: Number(amount), transaction });
    await user.reload({ transaction });

    await transaction.commit();
    res.status(201).json({
      message: "Expense added successfully",
      expense,
      totalExpense: user.totalExpense,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
    await transaction.rollback();
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
   const transaction = await sequelize.transaction();
  try {
   
    const expense = await Expense.findByPk(req.params.id, { transaction });

    const deleted = await Expense.destroy({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
      transaction
    });
    if (!deleted) {
      await transaction.rollback();
      return res.status(404).json({
        message: "Expense not found",
      });
    }
    const user = await User.findByPk(req.user.id, { transaction });
    await user.decrement("totalExpense", { by: Number(expense.amount), transaction });
    await user.reload({ transaction });

    await transaction.commit();
    res.json({
      message: "Expense deleted successfully",
      totalExpense: user.totalExpense,
    });
    
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
    await transaction.rollback();
  }
};


export const categorizeExpenseController = async (req, res) => {
  try {
    const { description } = req.body;
    if (!description) {
      return res.status(400).json({
        message: "Description is required",
      });
    }
    const category = await categorizeExpense(description);
    res.status(200).json({
      category,
    });
  } catch (error) {
    console.error("AI server error:", error);
    res.status(500).json({
      message: "Failed to categorize ",
      error: error.message,
    });

  }
};
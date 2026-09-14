import Expense from "../models/Expense.js";
import User from "../models/User.js";
import { categorizeExpense } from "../services/aiServices.js";
import sequelize from "../config/database.js";
import AWS from "aws-sdk";

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
    const page = parseInt(req.query.page) || 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const offset = (page - 1) * limit;
    const { count, rows: expenses } = await Expense.findAndCountAll({
      where: {
        userId: req.user.id,
      },
      limit,
      offset,
    });

    res.status(200).json({
      expenses,
      totalPages: Math.ceil(count / limit),
      
      currentPage: page,
  
      totalExpenses: count,
    });
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

function uploadToS3(fileContent, filename) {
  const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });
  const params = {
    Bucket: BUCKET_NAME,
    Key: filename,
    Body: fileContent,
  };
  return s3.getSignedUrl("putObject", params);
}

export const downloadExpenseReport = async (req, res) =>{
  try{
    const expenses = await getExpenses();
    const stringifiedExpenses = JSON.stringify(expenses.expenses);
    const filename = "ExpenseReport.txt";
    const fileUrl = uploadToS3(stringifiedExpenses, filename);
    res.status(200).json({
      fileUrl,
    });

  }catch{
    res.status(500).json({
      error: error.message,
    });
  }
}
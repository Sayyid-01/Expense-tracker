import { Router } from "express";
import { addExpense, getExpenses, deleteExpense, categorizeExpenseController, downloadExpenseReport, getExpenseReports } from "../controllers/expenseController.js";
import  protect  from "../middlewares/authMiddleware.js";


const router = Router();

router.post("/",protect, addExpense);
router.get("/",protect, getExpenses);
router.delete("/:id",protect, deleteExpense);
router.post("/categorize",protect, categorizeExpenseController);
router.get("/download", protect, downloadExpenseReport);
router.get("/reports-history", protect,getExpenseReports);
export default router;
import { Router } from "express";
import { addExpense, getExpenses, deleteExpense, categorizeExpenseController, downloadExpenseReport } from "../controllers/expenseController.js";
import  protect  from "../middlewares/authMiddleware.js";


const router = Router();

router.post("/",protect, addExpense);
router.get("/",protect, getExpenses);
router.delete("/:id",protect, deleteExpense);
router.post("/categorize",protect, categorizeExpenseController);
router.get("/download", protect, downloadExpenseReport);
export default router;
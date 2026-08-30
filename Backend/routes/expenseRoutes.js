import { Router } from "express";
import { addExpense, getExpenses } from "../controllers/expenseController.js";


const router = Router();

router.post("/", addExpense);
router.get("/", getExpenses);

export default router;
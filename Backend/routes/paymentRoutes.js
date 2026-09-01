import express from "express";

import {createPayment, verifyPayment} from "../controllers/paymentController.js";
import  protect  from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/create_order", protect, createPayment);
router.get("/verify/:orderId", protect, verifyPayment);

export default router;
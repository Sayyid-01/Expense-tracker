import { Router } from "express";
import { signup, login, forgotPassword, resetPassword } from "../controllers/authController.js";


const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/password/forgot_password", forgotPassword);
router.post("/password/reset_password/:uuid", resetPassword);

export default router;
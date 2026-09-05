import { Router } from "express";
import { signup, login, forgotPassword } from "../controllers/authController.js";


const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/password/forgot_password", forgotPassword);


export default router;
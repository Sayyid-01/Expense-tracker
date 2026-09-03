import { Router } from "express";
import { showLeaderboard, checkPremium } from "../controllers/premiumController.js";

import  protect  from "../middlewares/authMiddleware.js";
const router = Router();

router.get("/showleaderboard",protect,  showLeaderboard);
router.get("/checkPremium", protect, checkPremium);
export default router;
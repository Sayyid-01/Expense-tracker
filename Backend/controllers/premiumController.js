import sequelize  from "../config/database.js";
import User from "../models/User.js";
import Expense from "../models/Expense.js";
export const showLeaderboard = async (req, res) => {
    try {
           const leaderboard = await User.findAll({
            attributes: [
                "id",
                "name",
                [sequelize.fn("SUM", sequelize.col("expenses.amount")), "totalExpense"],
            ],
            include: [
                {
                    model: Expense,
                    attributes: [],
                    required: false,
                },
            ],
            group: ["User.id"],
            order: [["totalExpense", "DESC"]],
        }); 

        res.status(200).json({
            success: true,
            leaderboard
        });

    } catch (error) {
        console.error("Leaderboard error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to load leaderboard"
        });
    }
};

export const checkPremium = async (req, res) => {
  try {
    const user = req.user;
    const userData = await User.findOne({
      where: {
        id: user.id,
      },
      attributes: ["isPremium"],
    });
    res.json({
      isPremium: userData ? userData.isPremium : false,
    });
  } catch (error) {
    console.error("Premium check error:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};
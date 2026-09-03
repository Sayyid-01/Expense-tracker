import sequelize  from "../config/database.js";
import User from "../models/User.js";

export const showLeaderboard = async (req, res) => {
    try {
        const [leaderboard] = await sequelize.query(`
            SELECT
                users.id AS userId,
                users.name AS name,
                SUM(expenses.amount) AS totalExpense
            FROM expenses 
            INNER JOIN users 
                ON expenses.userId = users.id
            GROUP BY
                users.id,
                users.name
            ORDER BY
                totalExpense DESC
        `);

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
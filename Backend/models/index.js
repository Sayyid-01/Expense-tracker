
import User from "./User.js";
import Expense from "./Expense.js";
import expense from "./Expense.js";

expense.belongsTo(User, { foreignKey: "userId" });
User.hasMany(expense , { foreignKey: "userId" });

export { User, Expense };
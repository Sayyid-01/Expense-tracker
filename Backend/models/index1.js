
import User from "./User.js";
import Expense from "./Expense.js";
import expense from "./Expense.js";
import Order from "./Order.js";
import ExpenseReport from "./Expense_Report.js";
import ForgotPasswordRequest from "./ForgotPasswordRequest.js";

expense.belongsTo(User, { foreignKey: "userId" });
User.hasMany(expense , { foreignKey: "userId" });

Order.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Order, { foreignKey: "userId" });

ForgotPasswordRequest.belongsTo(User, { foreignKey: "userId" });
User.hasMany(ForgotPasswordRequest, { foreignKey: "userId" });

User.hasMany(ExpenseReport, { foreignKey: "userId"});
ExpenseReport.belongsTo(User, {foreignKey: "userId"});

export { User, Expense, Order, ForgotPasswordRequest, ExpenseReport };



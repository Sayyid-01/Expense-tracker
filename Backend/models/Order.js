import sequelize from "../config/database.js";
import { DataTypes } from "sequelize";

const Order = sequelize.define("order", {
  orderId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },

  paymentSessionId: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },

  status: {
    type: DataTypes.ENUM("PENDING", "SUCCESSFUL", "FAILED"),
    defaultValue: "PENDING",
  },
});

export default Order;
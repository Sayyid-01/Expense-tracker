import sequelize from "../config/database.js";
import { DataTypes } from "sequelize";

const expense = sequelize.define('expense', {
    amount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false
    },
    note: {
        type: DataTypes.STRING,
    }

})

export default expense;
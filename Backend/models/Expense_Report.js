import sequelize from "../config/database.js";
import { DataTypes } from "sequelize";

const Expense_report = sequelize.define("expense_report", {
    name:{
        type: DataTypes.STRING,
        allowNull: false,
    },  
    url:{
        type: DataTypes.TEXT,
        allowNull: false,
    },
    type:{
        type: DataTypes.STRING,
        allowNull: false,
    }

})

export default Expense_report;
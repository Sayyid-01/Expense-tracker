import sequelize from "../config/database.js";
import { DataTypes } from "sequelize";

const ForgotPasswordRequest = sequelize.define("forgotPasswordRequest", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
})

export default ForgotPasswordRequest;
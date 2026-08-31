import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import userRoutes from "./routes/authRoutes.js";
import sequelize from "./config/database.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import "./models/index.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());


app.use("/users", userRoutes);
app.use("/expenses", expenseRoutes);

sequelize.sync({alter: true})
    .then(() => {
        console.log("Database Connected");

        app.listen(PORT, () => {
            console.log(`Server is running on Port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Database connection failed:", error);
    });
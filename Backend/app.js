import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import userRoutes from "./routes/authRoutes.js";
import sequelize from "./config/database.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use("/users", userRoutes);

sequelize.sync()
    .then(() => {
        console.log("Database Connected");

        app.listen(PORT, () => {
            console.log(`Server is running on Port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Database connection failed:", error);
    });
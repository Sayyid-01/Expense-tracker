import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const categories = [
  "Food",
  "Groceries",
  "Petrol",
  "Transport",
  "Shopping",
  "Bills",
  "Rent",
  "Entertainment",
  "Health",
  "Education",
  "Travel",
  "Subscriptions",
  "Utilities",
  "Salary",
  "Investment",
  "Insurance",
  "Personal Care",
  "Gifts",
  "Home",
  "Electronics",
  "Other"
];


export const categorizeExpense = async (description) => {

    const prompt = ` You are an expense categorization AI. Categorize the expense description into exactly ONE of these categories: ${categories.join(", ")}
                    Expense: "${description}"
                    Rules:
                        - Return ONLY the category name.
                        - Do not return an explanation.
                        - Do not use markdown.
                        - Do not create a new category.
                    `;

    try {

        const interaction = await ai.interactions.create({
            model: "gemini-3.8-flash",
            input: prompt
        });

        const result = interaction.output_text.trim();

        const category = categories.find(
            item => item.toLowerCase() === result.toLowerCase()
        );

        return category || "Other";

    } catch (error) {

        console.error("Gemini Error:", error);

        return "Other";
    }
};


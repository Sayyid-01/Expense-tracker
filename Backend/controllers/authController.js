import User from "../models/User.js";

const sign_Up = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({
            where: { email }
        });

        if (existingUser) {
            return res.status(400).json({
                error: "User already exists"
            });
        }

        const user = await User.create({
            name,
            email,
            password
        });

        res.status(201).json({
            message: "User created successfully",
            user
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

export default sign_Up;
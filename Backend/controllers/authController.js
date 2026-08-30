import User from "../models/User.js";

export const signup = async (req, res) => {
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


export const login = async(req,res) =>{
    const {email, password} = req.body;
    const user = await User.findOne({
        where: {email}
    });
    if(!user){
        return res.status(404).json({
            error: "User not found"
        });
    }
    if(user.password !== password){
        return res.status(401).json({
            error: "User not authorized"
        });
    }
    res.status(200).json({
        message: "Login successful",
        user
    });
}

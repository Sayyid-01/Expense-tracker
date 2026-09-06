import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendForgotPasswordMail } from "../services/emailService.js";
import ForgotPasswordRequest from "../models/ForgotPasswordRequest.js";

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    res.status(201).json({
      message: "Signup successful",
      user: newUser,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      return res.status(401).json({ message: "Wrong password" });
    }
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET
    );
    res.json({
      message: "Login successful",
      token,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } } );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const request = await ForgotPasswordRequest.create({ userId: user.id, isActive: true });
    const resetLink = `${process.env.FRONTEND_URL}/password/reset_password/${request.id}`;
    await sendForgotPasswordMail(user.email, resetLink);
    res.status(200).json({ message: "Email sent successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}



export const resetPassword = async (req, res) => {
  try{
    const {uuid} = req.params;
    const {password} = req.body;
    const request = await ForgotPasswordRequest.findOne({where: {id: uuid, isActive: true}});
    if(!request){
      return res.status(400).json({message: "Invalid or expired request"});
    }
    const user = await User.findOne({where: {id: request.userId}});
    if(!user){
      return res.status(404).json({message: "User not found"});
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();
    request.isActive = false;
    await request.save();
    res.status(200).json({message: "Password reset successful"});
  }catch(err){
    res.status(500).json({message: err.message});
  }

}

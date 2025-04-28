import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
// Register User: /api/user/register
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log(name);
    if (!name || !email || !password) {
      return res.json({
        success: false,
        message: "Missing Details",
      });
    }
    const existingUser = await User.findOne({ email });
    console.log(existingUser, "op");
    if (existingUser) {
      return res.json({
        success: false,
        message: "User already exists with this email ",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      httpOnly: true, // Http Only is used to prevent the js to access the cookie
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.json({
      success: true,
      user: { email: user.email, name: user.name },
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

//Login

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({
        success: false,
        message: "Email and password are required",
      });
    }
  } catch {}
};

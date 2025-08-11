import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import User from "../Models/User.js";

dotenv.config();

//Register or Sign Up
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already registered" });
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res
      .status(200)
      .json({ message: "User Registered Successfully", data: newUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Login or Sign In
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: "User Not Found" });
    }
    const passwordMatch = await bcrypt.compare(password, existingUser.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid Password" });
    }
    const token = jwt.sign(
      { _id: existingUser._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );
    existingUser.token = token;
    await existingUser.save();
    res
      .status(200)
      .json({ message: "User LoggedIn Successfully", token: token });
  } catch (error) {
    res.status(200).json({ message: error.message });
  }
};

//Forgot Password:
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      res.status(404).json({ message: "User not found" });
    }
    const token = jwt.sign(
      { _id: existingUser._id },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );

    await sendEmail(
      existingUser.email,
      "Password Reset Link",
      `You have received this email, because you have requested to reset your password. 
      Please click on the following link or copy & paste the link on your browser to reset your password. 
      https://hostel-management-system.netlify.app/reset-password/${existingUser._id}/${token}
      Please kindly ignore this if you have not requested to reset your password.`
    );

    res.status(200).json({
      message: "Verification email sent successfully. Please check your Email",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Reset Password
export const resetPassword = async (req, res) => {
  try {
    const { id, token } = req.params;
    const { password } = req.body;

    //token verification
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decoded) {
      return res.status(401).json({ message: "Invalid Token" });
    }

    //hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    //update the user's new password in the database
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { password: hashedPassword },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User Not Found" });
    }
    res.status(200).json({ message: "Password Resetted Successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookie from "cookie";

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;


    if (!name || !email || !password || !role) {
      return res.status(400).json({
        message: "Some fields are missing",
        success: false,
      });
    }

    const existUser = await User.findOne({ email });
    if (existUser) {
      return res
        .status(400)
        .json({ message: "Email is already in use", success: false });
    }

  
    const salt = bcrypt.genSaltSync(10);
    const hashPass = bcrypt.hashSync(password, salt);


    await User.create({
      name,
      email,
      password: hashPass,
      role,
    });

    return res
      .status(200)
      .json({ message: "User successfully registered", success: true });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

 
    if (!email || !password || !role) {
      return res.status(400).json({
        message: "Some fields are missing",
        success: false,
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
        success: false,
      });
    }


    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Invalid email or password",
        success: false,
      });
    }


    if (user.role !== role) {
      return res.status(401).json({
        message: "Role does not match",
        success: false,
      });
    }


    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );


    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 1000, 
      });
  

    res.status(200).json({
      token,
      message: `Welcome back ${user.name}`,
      success: true,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({
      message: "Error logging in",
      success: false,
    });
  }
};

export const logOut= async(req,res)=>{
  try {
    return res.status(200).cookie("token", "", {maxAge:0}).json({
      message:"Logged Out Successfully ",
      success:true
    })
  } catch (error) {
    console.log(error)
  }
}
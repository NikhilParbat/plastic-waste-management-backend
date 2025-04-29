const User = require("../models/user");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

createUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      profileImage,
      skills,
      hourlyRate,
      postedJobs,
    } = req.body;

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid email format" });
    }

    // Validate password length
    if (password.length < 8) {
      return res.status(400).json({
        status: false,
        message: "Password must be at least 8 characters long",
      });
    }

    // Check if email already exists
    const emailExist = await User.findOne({ email });
    if (emailExist) {
      return res
        .status(400)
        .json({ status: false, message: "Email already exists" });
    }

    // Validate role
    if (!["freelancer", "client"].includes(role)) {
      return res.status(400).json({
        status: false,
        message: "Role must be either 'freelancer' or 'client'",
      });
    }

    // Encrypt password
    const encryptedPassword = CryptoJS.AES.encrypt(
      password,
      process.env.SECRET
    ).toString();

    // Create new user
    const newUser = new User({
      name,
      email,
      password: encryptedPassword,
      role,
      profileImage,
      skills: role === "freelancer" ? skills || [] : undefined,
      hourlyRate: role === "freelancer" ? hourlyRate || 0 : undefined,
      postedJobs: role === "client" ? postedJobs || [] : undefined,
    });

    await newUser.save();
    res
      .status(201)
      .json({ status: true, message: "User created successfully" });
  } catch (error) {
    console.error("Error in createUser:", error);
    res.status(500).json({ status: false, message: error.message });
  }
};

loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ status: false, message: "Wrong Email Address" });
    }

    // Decrypt password
    const decryptedPass = CryptoJS.AES.decrypt(
      user.password,
      process.env.SECRET
    ).toString(CryptoJS.enc.Utf8);
    if (decryptedPass !== password) {
      return res
        .status(401)
        .json({ status: false, message: "Incorrect password" });
    }

    // Generate JWT token
    const userToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SEC,
      { expiresIn: "21d" }
    );

    // Send response excluding password
    const { password: _, __v, createdAt, updatedAt, ...userData } = user._doc;
    res.status(200).json({ status: true, user: userData, userToken });
  } catch (error) {
    console.error("Error in loginUser:", error);
    res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = { createUser, loginUser };

import userModel from "../model/userModel.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const create = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const createdUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });

    await createdUser.save();

    res.status(201).json({
      success: true,
      message: "Created Successfully",
      data: createdUser,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

const getUsers = asyncHandler(async (req, res) => {
  const users = await userModel.find({});
  if (!users) {
    return res
      .status(404)
      .json({ success: false, messsage: "Users not found" });
  }

  res.status(200).json(users);
});

const getSpecificId = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  console.log(userId);
  try {
    const getId = await userModel.findById(userId);

    if (!getId) {
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });
    }

    res.status(200).json(getId);
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

const deleteUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  try {
    const deleted = await userModel.findByIdAndDelete(userId);

    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });
    }

    res.status(200).json({ success: true, message: "Deleted Successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

const updateUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  try {
    const updatedUser = await userModel.findByIdAndUpdate(userId, req.body, {
      new: true,
    });

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });
    }

    res.status(200).json({
      success: true,
      message: "Updated Successfully",
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error!" });
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email: email });

  // Compare provided password with hashed password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  res
    .status(200)
    .json({ message: "Login successful", user, token: createToken(user._id) });
});

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

export { create, getUsers, getSpecificId, deleteUser, updateUser, loginUser };

import userModel from "../model/userModel.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "../utils/cloudinary.js";
import fs from "fs";
import Counter from "../model/Counter.js";
import accountRequestModel from "../model/accountRequestModel.js";

const create = asyncHandler(async (req, res) => {
  const { fullName, email, password, role, phone, address, accountRequestId } =
    req.body;
  console.log(accountRequestId);

  const deleteAccountRequest = await accountRequestModel.findByIdAndDelete(
    accountRequestId
  );
  if (!deleteAccountRequest) {
    return res
      .status(404)
      .json({ success: false, message: "Account Request Id not found!" });
  }

  const counter = await Counter.findByIdAndUpdate(
    {
      _id: "userNumber",
    },
    {
      $inc: { sequence_value: 1 },
    },
    { new: true, upsert: true }
  );

  const userNumber = counter.sequence_value.toString().padStart(3, "0");

  const reference = `USER-${userNumber}`;

  // Check if the email is already in use
  const existingUser = await userModel.findOne({ email });
  if (existingUser) {
    return res
      .status(400)
      .json({ success: false, message: "Email already in use" });
  }

  // Handle image upload if a file is provided
  let image = null;
  if (req.file) {
    try {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "FREIGHT_USER_PROFILE",
      });

      // Remove the local file after uploading
      fs.unlinkSync(req.file.path);
      image = result.secure_url;
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: "Image upload failed", error });
    }
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create the user
  const createdUser = new userModel({
    userNumber: reference,
    fullName,
    email,
    password: hashedPassword,
    role,
    phone,
    address,
    image,
  });

  await createdUser.save();

  res.status(201).json({
    success: true,
    message: "User created successfully!",
    data: createdUser,
  });
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
  const { userId } = req.body;

  console.log(userId);
  const getId = await userModel.findById(userId);

  if (!getId) {
    return res.status(404).json({ success: false, message: "User not found!" });
  }

  res.status(200).json(getId);
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
  // const { fullName, email, password } = req.body;

  const user = await userModel.findById(userId);
  console.log(user);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found!" });
  }

  // Check if password needs updating
  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
  } else {
    delete req.body.password; // Remove password from update payload if not provided
  }

  let image = null;

  if (req.file) {
    try {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "FREIGHT_USER_PROFILE",
      });

      fs.unlinkSync(req.file.path);
      image = result.secure_url;
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: "Image upload failed", error });
    }
  }

  req.body.image = image;

  const updatedUser = await userModel.findByIdAndUpdate(userId, req.body, {
    new: true,
  });

  res.status(201).json({
    success: true,
    message: "Updated Successfully",
    data: updatedUser,
  });
});
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email: email });

  // Compare provided password with hashed password
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  res
    .status(200)
    .json({ message: "Login successful", user, token: createToken(user._id) });
});

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

const register = asyncHandler(async (req, res) => {
  const { fullName, email, password, confirmPassword, role, phone, address } =
    req.body;

  // Check if password matches
  if (password !== confirmPassword) {
    return res
      .status(400)
      .json({ success: false, message: "Passwords do not match!" });
  }

  const counter = await Counter.findByIdAndUpdate(
    {
      _id: "userNumber",
    },
    {
      $inc: { sequence_value: 1 },
    },
    { new: true, upsert: true }
  );

  const userNumber = counter.sequence_value.toString().padStart(3, "0");

  const reference = `USER-${userNumber}`;
  // Check if email already exists
  const userExists = await userModel.findOne({ email });
  if (userExists) {
    return res
      .status(400)
      .json({ success: false, message: "Email already registered." });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new user
  const createUser = new userModel({
    userNumber: reference,
    fullName,
    email,
    password: hashedPassword,
    role,
    phone,
    address,
  });

  try {
    const savedUser = await createUser.save();
    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        _id: savedUser._id,
        fullName: savedUser.fullName,
        email: savedUser.email,
        role: savedUser.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error, could not create user.",
    });
  }
});

export {
  create,
  getUsers,
  getSpecificId,
  deleteUser,
  updateUser,
  loginUser,
  register,
};

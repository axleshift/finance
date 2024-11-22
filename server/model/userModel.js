import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  name: { type: String },
  email: { type: String, unique: true },
  password: { type: String },
  role: { type: String, enum: ["user", "admin","super-admin","technician"] },
  phone: { type: String },
  address: { type: String },
  image: { type: String },
});

const userModel = mongoose.model("User", userSchema);

export default userModel;

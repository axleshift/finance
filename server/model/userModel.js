import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  userNumber: { type: String },
  fullName: { type: String },
  email: { type: String, unique: true },
  password: { type: String },
  role: {
    type: String,
    enum: ["user", "admin", "staff", "super-admin", "technician"],
  },
  phone: { type: String },
  address: { type: String },
  image: { type: String },
});

const userModel = mongoose.model("User", userSchema);

export default userModel;

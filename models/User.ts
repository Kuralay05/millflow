import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "operator", "warehouse_manager"],
      required: true
    }
  },
  { timestamps: true }
);

const User = models.User || model("User", UserSchema);

export default User;

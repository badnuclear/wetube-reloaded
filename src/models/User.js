import bcrypt from "bcrypt";
import mongoose from "mongoose";

//유져 스키마 생성
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  location: String,
});

userSchema.pre("save", async function () {
  console.log("user password: ", this.password);
  this.password = await bcrypt.hash(this.password, 5);
  console.log("hash password: ", this.password);
});

const User = mongoose.model("User", userSchema);

//유져 익스포트
export default User;

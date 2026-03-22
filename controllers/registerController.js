import userModel from "../models/userModel.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import config from "../config/config.js";

async function registerUser(req, res) {
  const { username, email, password } = req.body;
  
  const isAlreadyExists = await userModel.findOne({
    $or: [{ username }, { email }],
  });

  if (isAlreadyExists) {
    return res.status(409).json({
      message: "User already exits",
    });
  }

  console.log(req.body)

  const hashedPassword = crypto
    .createHash("sha256")
    .update(password)
    .digest("hex");

  const user = await userModel.create({
    username,
    email,
    password: hashedPassword,
  });

  const token = jwt.sign(
    {
      id: user._id,
    },
    config.SECRET_KEY,
    {
      expiresIn: "2h",
    },
  );

  res.status(201).json({
    message : "User registered successfully",
    user : {
        username : user.username,
        email: user.email
    }, 
    token
  })
}

export { registerUser };

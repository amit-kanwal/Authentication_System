import userModel from "../models/userModel.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import sessionModel from "../models/sessionModel.js";

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

  const refreshToken = jwt.sign(
    {
      id: user._id,
    },
    config.SECRET_KEY,
    {
      expiresIn: "1d",
    },
  );

   const refreshTokenHash = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  const session = await sessionModel.create({
    user: user._id,
    refreshTokenHash,
    ip: req.ip,
    userAgent: req.headers["user-agent"] 
  })

  const acessToken = jwt.sign(
    {
      id: user._id,
      sessionId: session._id
    },
    config.SECRET_KEY,
    {
      expiresIn: "15m",
    },
  );

  res.cookie("refreshToken", refreshToken , {
    httpOnly : true,
    secure : true,
    sameSite : 'strict',
    maxAge: 1 * 24 * 60 * 60 * 1000 //1day
  })

  res.status(201).json({
    message : "User registered successfully",
    user : {
        username : user.username,
        email: user.email
    }, 
    acessToken
  })
}

export { registerUser };

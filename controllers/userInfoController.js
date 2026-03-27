import userModel from "../models/userModel.js";
import config from "../config/config.js";
import jwt from "jsonwebtoken";
import sessionModel from "../models/sessionModel.js";

const getMe = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      message: "Token not found",
    });
  }

  const decoded = jwt.verify(token, config.SECRET_KEY);
  console.log(decoded);

  const user = await userModel.findById(decoded.id);

  res.status(200).json({
    message: "User fetched successfully",
    User: {
      username: user.username,
      email: user.email,
    },
  });
};

async function getRefreshToken(req, res) {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({
      message: "Sorry you donot have the refresh token",
    });
  }

  const decoded = jwt.verify(refreshToken, SECRET_KEY);

  const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex")
  

  const session = await sessionModel.findOne({
    refreshTokenHash,
    revoked: false
  })

  if(!session){
    return res.status(401).json({
      message: "Invalid refresh token"
    })
  }

  const accessToken = jwt.sign(
    {
      id: decoded.id,
    },
    SECRET_KEY,
    {
      expiresIn: "15m",
    },
  );

  const newRefreshToken = jwt.sign(
    {
      id: decoded.id,
    },
    SECRET_KEY,
    {
      expiresIn: "7d",
    },
  );

  const newRefreshTokenHash = crypto.createHash("sha256").update(newRefreshToken).digest('hex')

  session.refreshTokenHash = newRefreshToken

  await session.save()

  res.cookie("refreshToken", newRefreshToken , {
    httpOnly : true,
    secure : true,
    sameSite : 'strict',
    maxAge: 1 * 24 * 60 * 60 * 1000 //1day
  })
}

export { getMe, getRefreshToken };

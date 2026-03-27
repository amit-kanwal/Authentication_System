import crypto from 'crypto'
import sessionModel from '../models/sessionModel.js';

const logout = async(req, res)=>{
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken){
        return res.status(400).json({
            message: "Refresh token not found"
        })
    }

    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex")

    const session = await sessionModel.findOne({
        refreshTokenHash,
        revoked: false
    })

    if(!session){
        return res.status(400).json({
            message: "Invalid token"
        })
    }

    session.revoked = true
    await session.save()

    res.clearCookie('refreshToken')
    
    res.status(200).json({
        message: "Logged out sucessfully"
    })
}

export default logout;
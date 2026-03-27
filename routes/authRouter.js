import {Router} from 'express'
import {registerUser} from '../controllers/registerController.js'
import { getMe, getRefreshToken } from '../controllers/userInfoController.js'
import logout from '../controllers/logoutUserController.js'

const authRouter = new Router()

authRouter.post('/register', registerUser)
authRouter.get('/getMe', getMe)
authRouter.get('/refresh', getRefreshToken)
authRouter.get('/logout', logout)

export default authRouter;
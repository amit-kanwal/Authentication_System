import {Router} from 'express'
import {registerUser} from '../controllers/registerController.js'

const authRouter = new Router()

authRouter.post('/register', registerUser)

export default authRouter;
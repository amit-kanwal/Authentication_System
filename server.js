import express from 'express'
import morgan from 'morgan'
import connectDB from './config/db.js'
import authRouter from './routes/authRouter.js'
import cookieParser from 'cookie-parser'

const app = express()
connectDB()

app.use(express.json())
app.use(morgan("dev"))
app.use(cookieParser())
app.use('/api', authRouter)



app.listen(3000, ()=>{
    console.log("Server started at port 3000")
})


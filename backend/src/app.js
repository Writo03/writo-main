import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import bodyParser from 'body-parser'

import userRouter from './routes/user.routes.js'
import {errorHandler} from "./middlewares/error.middleware.js"


const app = express()
const allowedOrigins = ["http://localhost:5173"]
app.use(cors({
    origin : allowedOrigins,
    credentials : true
}))
 
app.use(express.json({
    limit : "16kb"
}))

app.use(cookieParser())

app.use(express.urlencoded({extended: true, limit: "16kb"}))

app.use(express.static("public"))

app.use(bodyParser.json());

app.use('/api/v1/user',userRouter)

app.use(errorHandler)
export {app}
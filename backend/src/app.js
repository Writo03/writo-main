import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

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

export {app}
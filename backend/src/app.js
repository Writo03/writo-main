import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import bodyParser from "body-parser"
import http from "http"
import { Server } from "socket.io"
import { InitializeSocketIO } from "./socket/index.js"

const allowedOrigins = [
  "http://localhost:3001",
  "https://writo-main-bi36.vercel.app",
  "https://www.writo.tech",
  "https://writo-main-for-test.vercel.app",
]
const app = express()
const httpServer = http.createServer(app)

const io = new Server(httpServer, {
  pingTimeout: 60000,
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
})

app.set("io", io)

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
)

app.use(
  express.json({
    limit: "16kb",
  })
)

app.use(cookieParser())

app.use(express.urlencoded({ extended: true, limit: "16kb" }))

app.use(express.static("public"))

app.use(bodyParser.json())

//routes
import userRouter from "./routes/user.routes.js"
import serviceRouter from "./routes/service.routes.js"
import subscriptionRouter from "./routes/subscription.routes.js"
import quizRouter from "./routes/quiz.routes.js"
import resultRouter from "./routes/result.routes.js"
import contactRouter from "./routes/contact.routes.js"
import chatRouter from "./routes/chat.routes.js"
import messageRouter from "./routes/message.routes.js"

import { errorHandler } from "./middlewares/error.middleware.js"

app.use("/api/v1/user", userRouter)
app.use("/api/v1/service", serviceRouter)
app.use("/api/v1/subscription", subscriptionRouter)
app.use("/api/v1/quiz", quizRouter)
app.use("/api/v1/result", resultRouter)
app.use("/api/v1/contact", contactRouter)
app.use("/api/v1/chat", chatRouter)
app.use("/api/v1/message", messageRouter)

InitializeSocketIO(io)

app.use(errorHandler)
export { httpServer }

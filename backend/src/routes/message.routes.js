import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import {
  deleteMessage,
  getAllMessages,
  sendMessage,
} from "../controllers/message.controller.js"

const router = Router()

router.use(verifyJWT)

router.route("/:chatId").get(getAllMessages).post(sendMessage)
router.route("/:chatId/:messageId").delete(deleteMessage)

export default router

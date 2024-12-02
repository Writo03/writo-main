import {Router} from "express"
import {verifyJWT} from "../middlewares/auth.middleware.js"
import { createOrGetMentorChat, getAllChats } from "../controllers/chat.controller.js"

const router = Router()
router.use(verifyJWT)

router.route("/create-or-get-mentor-chat/:subject").post(createOrGetMentorChat)
router.route("/get-all-chats").get(getAllChats)

export default router 
import {Router} from "express"
import {verifyJWT} from "../middlewares/auth.middleware.js"
import {createQuiz} from "../controllers/quiz.controller.js"

const router = Router()

router.use(verifyJWT)

router.route("/create-quiz").post(createQuiz)

export default router

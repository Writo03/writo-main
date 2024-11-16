import {Router} from "express"
import {verifyJWT} from "../middlewares/auth.middleware.js"
import { getLeaderboard, getResult, submitTest } from "../controllers/result.controller.js"

const router = Router()

router.use(verifyJWT)
router.route("/submit-test").post(submitTest)
router.route("/get-result/:quizId").get(getResult)
router.route("/get-leaderboard/:quizId").get(getLeaderboard)

export default router
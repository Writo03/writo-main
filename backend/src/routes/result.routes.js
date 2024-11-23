import {Router} from "express"
import {verifyJWT} from "../middlewares/auth.middleware.js"
import { getAllTestsResult, getLeaderboard, getResult, getResultByid, submitTest } from "../controllers/result.controller.js"

const router = Router()

router.use(verifyJWT)
router.route("/submit-test").post(submitTest) 
router.route("/get-resultbyid/:resultId").get(getResultByid)
router.route("/all-testsresult").get(getAllTestsResult)
router.route("/get-result/:quizId").get(getResult)
router.route("/get-leaderboard/:quizId").get(getLeaderboard)

export default router
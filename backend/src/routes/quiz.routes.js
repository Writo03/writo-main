import {Router} from "express"
import {verifyJWT} from "../middlewares/auth.middleware.js"
import {createQuiz, deleteQuiz, getQuizById, getQuizes, getQuizesAll, updateQuiz} from "../controllers/quiz.controller.js"

const router = Router()

router.use(verifyJWT)

router.route("/create-quiz").post(createQuiz)
router.route("/get-quizes").get(getQuizes)
router.route("/get-quizes-all").get(getQuizesAll)
router.route("/get-quiz/:quizId")
.get(getQuizById)
.patch(updateQuiz)
.delete(deleteQuiz)

export default router

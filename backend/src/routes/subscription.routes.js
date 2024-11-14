import {Router} from "express"
import {verifyJWT} from "../middlewares/auth.middleware.js"
import {createOrder, getUserServices, verifyPayment} from "../controllers/subscription.controller.js"

const router = Router()

router.use(verifyJWT)

router.route("/order").post(createOrder)
router.route("/verify-payment").post(verifyPayment)
router.route("/get-subscriptions").get(getUserServices)

export default router
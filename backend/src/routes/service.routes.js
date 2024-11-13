import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {addService, getServices, getServiceByName, updateService} from "../controllers/service.controller.js"

const router = Router()

router.use(verifyJWT)

router.route("/create-service").post(addService)
router.route("/get-services").get(getServices)
router.route("/get-service/:name").get(getServiceByName)
router.route("/update-service/:serviceId").patch(updateService)

export default router
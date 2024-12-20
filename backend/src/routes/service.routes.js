import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {addService, getServices, getServiceById, updateService, deleteService} from "../controllers/service.controller.js"

const router = Router()


router.route("/create-service").post(verifyJWT, addService)
router.route("/get-services").get(getServices)
router.route("/get-service/:serviceId")
.get(getServiceById)
.delete(verifyJWT,deleteService)
router.route("/update-service/:serviceId").patch(verifyJWT, updateService)

export default router
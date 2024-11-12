import Router from "express";
import { userLogin, userRegister, registerMentor, getAllMentors, deleteMentor, registerAdmin } from "../controllers/user.controller.js";
import {verifyJWT} from "../middlewares/auth.middleware.js"



const router = Router()


router.route('/register').post(userRegister)
router.route('/login').post(userLogin)


router.route("/add-mentor").post(verifyJWT, registerMentor)
router.route("/get-mentors").get(verifyJWT, getAllMentors)
router.route("/delete-mentor/:mentorId").delete(verifyJWT, deleteMentor)
router.route("/add-admin").post(verifyJWT, registerAdmin)





export default router;
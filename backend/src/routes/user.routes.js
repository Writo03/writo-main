import Router from "express";
import { userLogin, userRegister, registerMentor, getAllMentors, deleteMentor, registerAdmin } from "../controllers/user.controller.js";
import {verifyJWT} from "../middlewares/auth.middleware.js"



const router = Router()


router.route('/register').post(userRegister)
router.route('/login').post(userLogin)
router.route('/refresh-token').post(refreshAccessToken)
router.route('/logout').get(verifyJWT,userLogout)
router.route('/self').get(verifyJWT,userSelf)

router.route("/add-mentor").post(verifyJWT, registerMentor)
router.route("/get-mentors").get(verifyJWT, getAllMentors)
router.route("/delete-mentor/:mentorId").delete(verifyJWT, deleteMentor)
router.route("/add-admin").post(verifyJWT, registerAdmin)





export default router;
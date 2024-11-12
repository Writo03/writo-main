import Router from "express";
import { refreshAccessToken, userLogin, userLogout, userRegister, userSelf } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";




const router = Router()


router.route('/register').post(userRegister)
router.route('/login').post(userLogin)
router.route('/refresh-token').post(refreshAccessToken)
router.route('/logout').get(verifyJWT,userLogout)
router.route('/self').get(verifyJWT,userSelf)





export default router;
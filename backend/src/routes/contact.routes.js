import Router from "express";
import {
  createMeggage,
  getMessageById,
  getMessageByEmail,
  getMessageBySubject,
  getAllMessages,
  deleteMessage,
} from "../controllers/contact.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/message").post(createMeggage);

router.use(verifyJWT);

router.route("/message/all").get(getAllMessages);
// router.route("/message/:email").get(getMessageByEmail);
// router.route("/message/:subject").get(getMessageBySubject);
// router.route("/message/:id").get(getMessageById);
// router.route("/message/:id").delete(deleteMessage);

export default router;

import express from "express";
import { userLogin, userRegister } from "../controller/auth.controller";
import { getAllUser } from "../controller/user.controller";

const router = express.Router();

router.post("/register", userRegister);
router.post("/login", userLogin);
router.get("/", getAllUser);

export default router;

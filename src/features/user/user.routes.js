import express from "express";
import {homePage, userLogin,userLogout,userRegisteration,updateUserPassword,getUserLogin,getUserRegistration } from "./user.controller.js";
import { auth } from "../../middlewares/jwtAuth.middleware.js";

const router = express.Router();

router.route("/login").post(userLogin);
router.route("/register").post(userRegisteration);
router.route("/logout").get(userLogout);
// router.route("/update/password").post(auth, updateUserPassword);
router.route("/home").get(auth,homePage);


router.route("/register").get(getUserRegistration);
router.route("/login").get(getUserLogin);

// router.route("/home").get(userHome);
export default router;
//needs testing update/profile
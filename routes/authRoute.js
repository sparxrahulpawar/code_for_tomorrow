// Import dependencies
import express from "express";
import { login, register } from "../controller/authController.js";


// Create an Express router
const router = express.Router();


router.post("/register", register);
router.post("/login", login);


export default router;
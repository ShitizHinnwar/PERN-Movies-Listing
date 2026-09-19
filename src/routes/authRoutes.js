import express from 'express'
import { register, login, logout, getme } from '../controllers/authController.js';

const authRoutes = express.Router();

authRoutes.post("/register", register);
authRoutes.post("/login", login);
authRoutes.get("/getme", getme);
authRoutes.post("/logout", logout);

export default authRoutes;
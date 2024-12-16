import express from "express";
import { logOut, login, register } from "../controllers/userController.js";
import isAuthenticated from '../mddleware/isAuthenticated.js'
const router=express.Router()

router.route('/user/login').post(login)

router.route('/user/register').post(register)
router.route('/user/logout').get(isAuthenticated,logOut)

export default router
import express from "express"
import isAuthenticated from "../mddleware/isAuthenticated";
import { addTimeSlot } from "../controllers/appointmentController";

const router=express.Router();

router.route('/professor/add-slot').post(isAuthenticated,addTimeSlot);
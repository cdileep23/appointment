
import express from 'express';
import connectDB from './db.js';
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import userRoute from "./routes/userRoute.js"
dotenv.config()



const app = express();
app.use(cookieParser())

app.use(express.json())


connectDB();
app.use('/api',userRoute)

const PORT = process.env.PORT || 9090;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

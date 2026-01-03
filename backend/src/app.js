import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.route.js";

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
}));

app.use(cookieParser());

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes)

app.get('/',(req,res)=>{
    res.status(200).json({message:"server for chat app is running"});
})

export default app;



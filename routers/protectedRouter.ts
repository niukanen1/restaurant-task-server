import { Router } from "express";
import { userRouter } from "./userRouter";

const protectedRouter = Router(); 

protectedRouter.use("/user", userRouter); 

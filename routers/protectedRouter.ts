import { Router } from "express";
import { dishRouter } from "./dishRouter";
import { userRouter } from "./userRouter";

export const protectedRouter = Router(); 

protectedRouter.use("/user", userRouter); 
protectedRouter.use("/dishes", dishRouter); 

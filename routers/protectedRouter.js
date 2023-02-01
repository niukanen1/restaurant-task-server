"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userRouter_1 = require("./userRouter");
const protectedRouter = (0, express_1.Router)();
protectedRouter.use("/user", userRouter_1.userRouter);

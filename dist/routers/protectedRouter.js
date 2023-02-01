"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.protectedRouter = void 0;
const express_1 = require("express");
const dishRouter_1 = require("./dishRouter");
const userRouter_1 = require("./userRouter");
exports.protectedRouter = (0, express_1.Router)();
exports.protectedRouter.use("/user", userRouter_1.userRouter);
exports.protectedRouter.use("/dishes", dishRouter_1.dishRouter);

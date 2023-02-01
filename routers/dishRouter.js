"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const responseModel_1 = require("../Models/responseModel");
const dishRouter = (0, express_1.Router)();
dishRouter.post("/createDish", (req, res) => {
    const { dish } = req.body;
    try {
        if (!dish) {
            throw new Error("Provide proper dish object");
        }
        // if dish exists try to add it to databse;
    }
    catch (err) {
        return res.status(403).json(new responseModel_1.ResponseObject(false, err.message, null));
    }
});

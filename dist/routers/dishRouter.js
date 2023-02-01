"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dishRouter = void 0;
const databaseConnector_1 = require("./../database/databaseConnector");
const express_1 = require("express");
const responseModel_1 = require("../Models/responseModel");
const mongodb_1 = require("mongodb");
const express_validator_1 = require("express-validator");
exports.dishRouter = (0, express_1.Router)();
exports.dishRouter.post("/createDish", (0, express_validator_1.body)("newDish.type").isIn(["drink", "dish"]).withMessage(new responseModel_1.ResponseObject(false, "Incorrect type of dish", null)), (0, express_validator_1.body)("newDish.mealTimeType")
    .isIn(["breakfast", "lunch", "dinner", "other", "drinks"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { newDish } = req.body;
    console.log(newDish);
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(new responseModel_1.ResponseObject(false, "New dish data validation failed", null));
    }
    try {
        if (!newDish) {
            throw new Error("Provide proper dish object");
        }
        // if dish exists try to add it to databse;
        yield databaseConnector_1.dishCollection.insertOne(newDish);
    }
    catch (err) {
        return res.status(403).json(new responseModel_1.ResponseObject(false, err.message, null));
    }
    return res.status(200).json(new responseModel_1.ResponseObject(true, "Successfully created dish", null));
}));
exports.dishRouter.post("/updateDish", (0, express_validator_1.body)("updatedDish.type").isIn(["drink", "dish"]), (0, express_validator_1.body)("updatedDish.mealTimeType")
    .isIn(["breakfast", "lunch", "dinner", "other", "drinks"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id, updatedDish } = req.body;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        //   return res.status(400).json(new ResponseObject(false, "Dish data validation failed", null));
        return res.status(403).json({ errors: errors.array() });
    }
    try {
        const existingDish = yield databaseConnector_1.dishCollection.findOne({ _id: new mongodb_1.ObjectId(_id) });
        if (!existingDish) {
            throw new Error("That dish does't exists");
        }
        yield databaseConnector_1.dishCollection.updateOne({ _id: new mongodb_1.ObjectId(_id) }, { $set: updatedDish });
        return res.status(200).json(new responseModel_1.ResponseObject(true, "Successfully updated dish", null));
    }
    catch (err) {
        return res.status(403).json(new responseModel_1.ResponseObject(false, err.message, null));
    }
}));
exports.dishRouter.post("/deleteDish", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.body;
    try {
        const deletion = yield databaseConnector_1.dishCollection.deleteOne({ _id: new mongodb_1.ObjectId(_id) });
        if (deletion.deletedCount == 0) {
            return res.status(403).json(new responseModel_1.ResponseObject(false, "Couldn't find a dish to delete :(", null));
        }
        return res.status(200).json(new responseModel_1.ResponseObject(true, "Successfully deleted dish", null));
    }
    catch (err) {
        return res.status(403).json(new responseModel_1.ResponseObject(false, err.message, null));
    }
}));

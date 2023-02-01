import { dishCollection } from "./../database/databaseConnector";
import { TypedRequest } from "./../index";
import { DishInput } from "./../Models/dishModel";
import { Router, Request } from "express";
import { ResponseObject } from "../Models/responseModel";
import { ObjectId } from "mongodb";
import { body, validationResult } from "express-validator";

export const dishRouter = Router();

dishRouter.post(
	"/createDish",
	body("newDish.type").isIn(["drink", "dish"]).withMessage(new ResponseObject(false, "Incorrect type of dish", null)),
	body("newDish.mealTimeType")
		.isIn(["breakfast", "lunch", "dinner", "other", "drinks"]),
	async (req: TypedRequest<{newDish: DishInput}>, res) => {
		const {newDish} = req.body;
        console.log(newDish)
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json(new ResponseObject(false, "New dish data validation failed", null));
        }
		try {
			if (!newDish) {
				throw new Error("Provide proper dish object");
			}
			// if dish exists try to add it to databse;
			await dishCollection.insertOne(newDish);
		} catch (err) {
			return res.status(403).json(new ResponseObject(false, (err as Error).message, null));
		}
		return res.status(200).json(new ResponseObject(true, "Successfully created dish", null));
	}
);

dishRouter.post(
	"/updateDish",
	body("updatedDish.type").isIn(["drink", "dish"]),
	body("updatedDish.mealTimeType")
		.isIn(["breakfast", "lunch", "dinner", "other", "drinks"]),
	async (req: TypedRequest<{ updatedDish: DishInput; _id: string }>, res) => {
		const { _id, updatedDish } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        //   return res.status(400).json(new ResponseObject(false, "Dish data validation failed", null));
        return res.status(403).json({errors: errors.array()})
        }
		try {
			const existingDish = await dishCollection.findOne({ _id: new ObjectId(_id) });
			if (!existingDish) {
				throw new Error("That dish does't exists");
			}
			await dishCollection.updateOne({ _id: new ObjectId(_id) }, { $set: updatedDish });
			return res.status(200).json(new ResponseObject(true, "Successfully updated dish", null));
		} catch (err) {
			return res.status(403).json(new ResponseObject(false, (err as Error).message, null));
		}
	}
);

dishRouter.post("/deleteDish", async (req: TypedRequest<{ _id: string }>, res) => {
	const { _id } = req.body;

	try {
		const deletion = await dishCollection.deleteOne({ _id: new ObjectId(_id) }); 
        if (deletion.deletedCount == 0) { 
            return res.status(403).json(new ResponseObject(false, "Couldn't find a dish to delete :(", null));
        }
		return res.status(200).json(new ResponseObject(true, "Successfully deleted dish", null));
	} catch (err) {
		return res.status(403).json(new ResponseObject(false, (err as Error).message, null));
	}
});

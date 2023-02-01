import { TypedRequest } from './../index';
import { DishInput } from './../Models/dishModel';
import { Router, Request } from "express";
import { ResponseObject } from '../Models/responseModel';


const dishRouter = Router();

dishRouter.post("/createDish", (req: TypedRequest<{dish: DishInput}>, res) => { 
    const { dish } = req.body
    
    try { 
        if (!dish) { 
            throw new Error("Provide proper dish object")
        }
        // if dish exists try to add it to databse;
        
    } catch (err) { 
        return res.status(403).json(new ResponseObject(false, (err as Error).message, null))
    }


})
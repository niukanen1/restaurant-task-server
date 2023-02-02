import { Router } from "express";
import { ResponseObject } from "../Models/responseModel";
import bcrypt from "bcrypt";
import { userCollection } from "../database/databaseConnector";
import { User } from "../Models/userModel";
import { GenerateToken, SerializeToken } from "../TokenService";

export const userRouter = Router(); 


const SALT_ROUNDS = 10; 

export async function ComparePassword(password: string, hashedPassword: string): Promise<boolean> { 
    return await bcrypt.compare(password, hashedPassword); 
}

export function HashPassword(password: string, completion: (hash: string) => void) { 
    bcrypt.hash(password, SALT_ROUNDS, (err, hash) => { 
        if (err) { 
            console.log("Error hashing the password " + hash);
        }
        completion(hash)
    })
}
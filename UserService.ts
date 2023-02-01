import { userCollection } from './database/databaseConnector';
import { ResponseObject } from './Models/responseModel';
import { User } from './Models/userModel';
import { HashPassword } from './routers/userRouter';
type ResponseType=ResponseObject<any>;

export async function AddUserToDb(UserToAdd: {email: string, password: string}): Promise<ResponseType> { 
    const newUser = UserToAdd;
    try { 
        const existingUser = await userCollection.find({email: newUser.email}).toArray(); 
        if (existingUser.length > 0) { 
            throw new Error("User with this email already exists");
        }
        HashPassword(newUser.password, async (hash: string) => { 
            newUser.password = hash;
            await userCollection.insertOne(newUser);
        }) 
        
    } catch (err: Error | unknown) { 
        return new ResponseObject(false, (err as Error).message, null); 
    }
    return new ResponseObject(true, "Successfully added user", null); 
}
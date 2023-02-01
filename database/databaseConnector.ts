import { MongoClient } from "mongodb"; 
import dotenv from "dotenv"
dotenv.config()

const URI = process.env.MONGO_URI ?? "NONE"; 
console.log(URI)
const client = new MongoClient(URI);


const database = client.db("restaurant-task")

export const userCollection = database.collection("users");
export const dishCollection = database.collection("dishes"); 

client.connect().then(() => { 
    console.log("Database is OK");
}).catch(err => { 
    console.log("Error occured: " + err); 
})
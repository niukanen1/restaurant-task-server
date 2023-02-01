import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { Authenticate, GenerateToken, SerializeToken } from "./TokenService";
import { ResponseObject } from "./Models/responseModel";
import { AddUserToDb } from "./UserService";
import { User } from "./Models/userModel";
import { dishCollection, userCollection } from "./database/databaseConnector";
import { ComparePassword } from "./routers/userRouter";
import { protectedRouter } from "./routers/protectedRouter";

dotenv.config();


export interface TypedRequest<T> extends Express.Request {
	body: T;
}


const app = express();
const PORT = process.env.PORT || 4000;
const corsOptions = {
	origin: true,
	credentials: true,
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(Authenticate);
app.use("/protected", protectedRouter);

app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", req.headers.origin);
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.post("/login", async (req, res) => { 
    const { email, password } = req.body;

    if (!email || !password) { 
        return res.status(403).send(new ResponseObject(false, "Provide all fields", null));
    }

    // try to find user in db; 
    try { 
        console.log(email)
        const user: User = await userCollection.findOne({email: email}) as User; 
        if (!user) { 
            return res.status(403).json(new ResponseObject(false, "User doesn't exists", null)); 
        }
        if (!(await ComparePassword(password, user.password))) { 
            return res.status(403).json(new ResponseObject(false, "Wrong password", null)); 
        }
        
    } catch (err) { 
        console.log("ERROR: " + err);
    }
    const token = GenerateToken({email: email, password: password});

    res.setHeader('Set-Cookie', SerializeToken(token));
	return res
		.status(200)
		.json(new ResponseObject(true, "Successfully logged in", null));
    
})

app.post("/register", async (req, res) => {
	const { email, password } = req.body;

	const token = GenerateToken({ email: email, password: password });
	const userAddingToDbCheck = await AddUserToDb({ email: email, password: password });
	if (!userAddingToDbCheck.success) {
		return res.status(400).json(userAddingToDbCheck);
	}

	res.setHeader("Set-Cookie", SerializeToken(token));
	return res.status(200).json(new ResponseObject(true, "Successfully registered", null));
});
app.get("/getDishes",async (req, res) => { 
    try { 
        const dishes = await dishCollection.find({}).toArray()
        return res.status(200).json(new ResponseObject(true, "Successfully fetched all dishes", dishes));
    } catch (err) { 
        return res.status(403).json(new ResponseObject(false, (err as Error).message, null))
    }
})

app.listen(PORT, () => {
	console.log("Started server");
});

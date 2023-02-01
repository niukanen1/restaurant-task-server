import { serialize } from "cookie";
import { User } from "./Models/userModel";
import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from "express";
import { ResponseObject } from "./Models/responseModel";
import { userCollection } from "./database/databaseConnector";


const SECRET_KEY = process.env.SECRET_KEY ?? "another_Secret_dont_tell_anybody_pls";

export function SerializeToken(token: string, maxAge?: number) {
	const maxAgeParam = maxAge ? maxAge : undefined;
	return serialize("accessToken", token, {
		httpOnly: true,
		secure: true,
		sameSite: "none",
        path:"/",
		maxAge: maxAgeParam,
	});
}
export function GenerateToken(user: {email: string, password: string}, expiration: string | number = "15m") {
	return jwt.sign(user, SECRET_KEY, { expiresIn: expiration });
}

export async function Authenticate(req: Request, res: Response, next: NextFunction) {
	if (!req.path.includes("/protected")) return next();

	const { accessToken: token } = req.cookies;

	if (!token) {
		return res.status(403).json(new ResponseObject(false, "Token should be provided!", null));
	}

	try {
		const decoded = jwt.verify(token, SECRET_KEY) as User;

		const fullUser = await userCollection.findOne({ email: decoded.email });
		req.body.user = fullUser;

		res.setHeader(
			"Set-Cookie",
			SerializeToken(GenerateToken({ email: decoded.email, password: decoded.password }))
		);
		res.status(200);
	} catch (err) {
        const error = err as Error;

        // if jwt token expired, set jwtExpired: true, so client logged current user out.
        if (error.name == "TokenExpiredError") { 
            return res.status(403).json(new ResponseObject(false, error.message, null));
        }
		return res.status(403).json(new ResponseObject(false, error.message, null));
	}
	next();
}
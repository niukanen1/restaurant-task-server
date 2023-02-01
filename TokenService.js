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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Authenticate = exports.GenerateToken = exports.SerializeToken = void 0;
const cookie_1 = require("cookie");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const responseModel_1 = require("./Models/responseModel");
const databaseConnector_1 = require("./database/databaseConnector");
const SECRET_KEY = (_a = process.env.SECRET_KEY) !== null && _a !== void 0 ? _a : "another_Secret_dont_tell_anybody_pls";
function SerializeToken(token, maxAge) {
    const maxAgeParam = maxAge ? maxAge : undefined;
    return (0, cookie_1.serialize)("accessToken", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
        maxAge: maxAgeParam,
    });
}
exports.SerializeToken = SerializeToken;
function GenerateToken(user, expiration = "15m") {
    return jsonwebtoken_1.default.sign(user, SECRET_KEY, { expiresIn: expiration });
}
exports.GenerateToken = GenerateToken;
function Authenticate(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!req.path.includes("/protected"))
            return next();
        const { accessToken: token } = req.cookies;
        if (!token) {
            return res.status(403).json(new responseModel_1.ResponseObject(false, "Token should be provided!", null));
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, SECRET_KEY);
            const fullUser = yield databaseConnector_1.userCollection.findOne({ email: decoded.email });
            req.body.user = fullUser;
            res.setHeader("Set-Cookie", SerializeToken(GenerateToken({ email: decoded.email, password: decoded.password })));
            res.status(200);
        }
        catch (err) {
            const error = err;
            // if jwt token expired, set jwtExpired: true, so client logged current user out.
            if (error.name == "TokenExpiredError") {
                return res.status(403).json(new responseModel_1.ResponseObject(false, error.message, null));
            }
            return res.status(403).json(new responseModel_1.ResponseObject(false, error.message, null));
        }
        next();
    });
}
exports.Authenticate = Authenticate;

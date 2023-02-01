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
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const TokenService_1 = require("./TokenService");
const responseModel_1 = require("./Models/responseModel");
const UserService_1 = require("./UserService");
const databaseConnector_1 = require("./database/databaseConnector");
const userRouter_1 = require("./routers/userRouter");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
const corsOptions = {
    origin: true,
    credentials: true,
};
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)(corsOptions));
app.use(TokenService_1.Authenticate);
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(403).send(new responseModel_1.ResponseObject(false, "Provide all fields", null));
    }
    // try to find user in db; 
    try {
        const user = yield databaseConnector_1.userCollection.findOne({ email: email });
        console.log(user);
        if (!user) {
            return res.status(403).json(new responseModel_1.ResponseObject(false, "User doesn't exists", null));
        }
        if (!(yield (0, userRouter_1.ComparePassword)(password, user.password))) {
            return res.status(403).json(new responseModel_1.ResponseObject(false, "Wrong password", null));
        }
    }
    catch (err) {
        console.log("ERROR: " + err);
    }
    const token = (0, TokenService_1.GenerateToken)({ email: email, password: password });
    res.setHeader('Set-Cookie', (0, TokenService_1.SerializeToken)(token));
    return res
        .status(200)
        .json(new responseModel_1.ResponseObject(true, "Successfully logged in", null));
}));
app.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const token = (0, TokenService_1.GenerateToken)({ email: email, password: password });
    const userAddingToDbCheck = yield (0, UserService_1.AddUserToDb)({ email: email, password: password });
    if (!userAddingToDbCheck.success) {
        return res.status(400).json(userAddingToDbCheck);
    }
    res.setHeader("Set-Cookie", (0, TokenService_1.SerializeToken)(token));
    return res.status(200).json(new responseModel_1.ResponseObject(true, "Successfully registered", null));
}));
app.listen(PORT, () => {
    console.log("Started server");
});

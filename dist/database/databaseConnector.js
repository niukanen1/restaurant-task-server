"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.otherCollection = exports.drinksCollection = exports.lunchCollection = exports.breakfastCollection = exports.userCollection = void 0;
const mongodb_1 = require("mongodb");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const URI = (_a = process.env.MONGO_URI) !== null && _a !== void 0 ? _a : "NONE";
console.log(URI);
const client = new mongodb_1.MongoClient(URI);
const database = client.db("restaurant-task");
exports.userCollection = database.collection("users");
exports.breakfastCollection = database.collection("breakfast");
exports.lunchCollection = database.collection("lunch");
exports.drinksCollection = database.collection("drinks");
exports.otherCollection = database.collection("other");
client.connect().then(() => {
    console.log("Database is OK");
}).catch(err => {
    console.log("Error occured: " + err);
});

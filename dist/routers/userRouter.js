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
exports.HashPassword = exports.ComparePassword = exports.userRouter = void 0;
const express_1 = require("express");
const bcrypt_1 = __importDefault(require("bcrypt"));
exports.userRouter = (0, express_1.Router)();
const SALT_ROUNDS = 10;
function ComparePassword(password, hashedPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_1.default.compare(password, hashedPassword);
    });
}
exports.ComparePassword = ComparePassword;
function HashPassword(password, completion) {
    bcrypt_1.default.hash(password, SALT_ROUNDS, (err, hash) => {
        if (err) {
            console.log("Error hashing the password " + hash);
        }
        completion(hash);
    });
}
exports.HashPassword = HashPassword;

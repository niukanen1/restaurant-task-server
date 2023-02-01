"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseObject = void 0;
class ResponseObject {
    constructor(success, message, data) {
        this.success = success;
        this.message = message;
        this.data = data;
    }
}
exports.ResponseObject = ResponseObject;

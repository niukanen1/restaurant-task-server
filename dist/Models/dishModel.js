"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dish = void 0;
class Dish {
    constructor(id, name, price, description, mass, type) {
        this._id = id;
        this.name = name;
        this.price = price;
        this.description = description;
        this.mass = mass;
        this.type = type;
    }
}
exports.Dish = Dish;

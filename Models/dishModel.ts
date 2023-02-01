type dishType="drink"|"dish";

export class Dish {
	_id: string;
	name: string;
	price: number;
	description: string;
    mass: number;
    type: dishType;
	constructor(id: string, name: string, price: number, description: string, mass: number, type: dishType) {
		this._id = id;
		this.name = name;
		this.price = price;
		this.description = description;
        this.mass = mass; 
        this.type = type 
	}
}
export type DishInput = {
    name: string; 
    preice: number; 
    description: string; 
    mass: number; 
    type: dishType
} 
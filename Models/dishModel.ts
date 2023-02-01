type dishType="drink"|"dish";
type MealTimeType = "breakfast" | "lunch" | "dinner" | "other" | "drinks"
export class Dish {
	_id: string;
	name: string;
	price: number;
	description: string;
    mass: number;
    type: dishType;
    mealTimeType: MealTimeType;
	constructor(id: string, name: string, price: number, description: string, mass: number, type: dishType, mealTimeType: MealTimeType) {
		this._id = id;
		this.name = name;
		this.price = price;
		this.description = description;
        this.mass = mass; 
        this.type = type 
        this.mealTimeType = mealTimeType; 
	}
}
export type DishInput = {
    name: string; 
    price: number; 
    description: string; 
    mass: number; 
    type: dishType
    mealTimeType: MealTimeType
} 
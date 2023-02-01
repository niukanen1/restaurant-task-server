import { WithId, Document, ObjectId } from "mongodb";
// export class User{
// 	_id: string;
// 	email: string;
// 	password: string;
// 	constructor(id: string, email: string, password: string) {
// 		this._id = id;
// 		this.email = email;
// 		this.password = password;
// 	}
// }

export interface User extends WithId<Document> {
	_id: ObjectId;
	email: string;
	password: string;
}

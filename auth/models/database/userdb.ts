import { ObjectId } from "mongodb";

export default class UserDB {
    constructor(
        public ID: string,
        public username: string, 
        public password: string,
        public _id?: ObjectId) {}
}
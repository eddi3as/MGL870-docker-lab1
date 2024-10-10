import { ObjectId } from "mongodb";

export default class Stats {
    constructor(public date: Date, public borne_id: string, public count: Number, public id?: ObjectId) {}
}
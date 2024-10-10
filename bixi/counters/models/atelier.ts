import { ObjectId } from "mongodb";

export default class Atelier {
    constructor(
        public ID: string,
        public arrondissement: string, 
        public nom_lieu: string, 
        public date_installation: string,
        public remarques: string, 
        public adresse: string, 
        public _id?: ObjectId) {}
}
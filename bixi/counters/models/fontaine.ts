import { ObjectId } from "mongodb";

export default class Fontaine {
    constructor(
        public ID: string, 
        public Arrondissement: string, 
        public Nom_parc_lieu: string,
        public Proximite_jeux_repere: string, 
        public Intersection: string, 
        public Date_installation: string,
        public Remarque: string, 
        public Precision_localisation: string, 
        public X: string,
        public Y: string, 
        public Longitude: string, 
        public Latitude: string, 
        public id?: ObjectId) {}
}
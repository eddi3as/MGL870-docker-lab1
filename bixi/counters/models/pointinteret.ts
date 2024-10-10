import { ObjectId } from "mongodb";

export default class PointInteret {
    constructor(
        public ID: number, 
        public Arrondissement: string, 
        public Nom_parc_lieu: string,
        public Proximite_jeux_repere: string, 
        public Intersection: string, 
        public Date_installation: string,
        public Remarque: string, 
        public Precision_localisation: string, 
        public X: number,
        public Y: number, 
        public Longitude: number, 
        public Latitude: number, 
        public Type: string,
        public Adress: string) {}
}
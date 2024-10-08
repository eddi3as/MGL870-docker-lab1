import { ObjectId } from "mongodb";

export default class Compteur {
    constructor(public ID: string, public Ancien_ID: string, public Nom: string,
                public Statut: string, public Latitude: string, public Longitude: string,
                public Annee_implante: string, public id?: ObjectId) {}
}
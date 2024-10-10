import { collections } from '../service/database.service'
import Compteur from '../models/compteur';

export class CompteurCtrl {
    constructor() {}

    public async getCompteur(filter: any, limit: any){
        let compteurs = [];
        if(limit > 0){
            compteurs = (await collections.compteurs.find<Compteur>(filter).limit(limit).toArray()) as Compteur[];
        }else{
            compteurs = (await collections.compteurs.find<Compteur>(filter).toArray()) as Compteur[];
        }
        return JSON.stringify(compteurs);
    }

    public async getCompteurStats(filter: any, limit: any){
        let compteurs = [];
        if(limit > 0){
            compteurs = (await collections.stats.find<Compteur>(filter).limit(limit).toArray()) as Compteur[];
        }else{
            compteurs = (await collections.stats.find<Compteur>(filter).toArray()) as Compteur[];
        }
        return JSON.stringify(compteurs);
    }
}
import { collections } from '../service/database.service'
import Compteur from '../models/compteur';

export class StatsCtrl {
    constructor() {}

    public async getStats(filter: any, limit: any){
        let compteurs = [];
        if(limit > 0){
            compteurs = (await collections.stats.find<Compteur>(filter).limit(limit).toArray()) as Compteur[];
        }else{
            compteurs = (await collections.stats.find<Compteur>(filter).toArray()) as Compteur[];
        }
        return JSON.stringify(compteurs);
    }
}
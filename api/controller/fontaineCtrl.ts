import { collections } from '../service/database.service'
import Fontaine from '../models/fontaine';

export class FontaineCtrl {
    public async getFontaine(filter: any) {
        let fontaines = (await collections.fontaines.find<Fontaine>(filter).toArray()) as Fontaine[];
        return JSON.stringify(fontaines);
    }

    public async insertFontaine(fontaine: Fontaine) {
        await collections.fontaines.insertOne(fontaine);
        return JSON.stringify({msg: "added"});
    }
}
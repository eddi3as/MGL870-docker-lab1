import { collections } from '../service/database.service'
import PointInteret from '../models/pointinteret';

export class PointInteretCtrl {

    public async getPointInteret(filter: any, limit: number) {
        return limit > 0 ? this.getWithLimit(filter, limit) : this.getAll(filter);
    }

    public async addPointInteret(ptint: PointInteret) {
        await collections.pointsinteret?.insertOne(ptint);
        return JSON.stringify({msg: 'added'});
    }

    private async getWithLimit(filter: any, limit: number) {
        let pts = (await collections.pointsinteret?.find<PointInteret>(filter).limit(limit).toArray()) as PointInteret[];
        return JSON.stringify(pts);
    }

    private async getAll(filter: any) {
        let pts = (await collections.pointsinteret?.find<PointInteret>(filter).toArray()) as PointInteret[];
        return JSON.stringify(pts);
    }
}
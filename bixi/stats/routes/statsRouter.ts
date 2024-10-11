import { Router, Request, Response, NextFunction } from 'express';
import { StatsCtrl } from '../controller/statsCtrl'
import { Utils } from '../utils/utils';
import { databaseResponseTimeHistogram } from "../utils/metrics";
import { l_log } from "../utils/logger";

export class StatsRouter {
  private _router: Router;
  private _statsCtrl: StatsCtrl;

  get statsCtrl() {
    return this._statsCtrl;
  }

  get router() {
    return this._router;
  }

  constructor() {
    this._statsCtrl = new StatsCtrl();
    this._router = Router();
    this.init();
  }

  public async getStats(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id;
    const debut = req.query.debut;
    const fin = req.query.fin;
    const limitParam = req.query.limite;
    let limit = 0;
    let filter = { borne_id: id };
    let results = null;
    const metricsLabels = {
      operation: "getStats",
    };

    if(limitParam)
      limit = parseInt(limitParam.toString());

    Utils.setFilterDates(filter, debut, fin);
    const timer = databaseResponseTimeHistogram.startTimer();

    try{
      results = await this._statsCtrl.getStats(filter, limit);
      timer({ ...metricsLabels, success: "true" });
    }catch(e){
      timer({ ...metricsLabels, success: "false" });
      l_log.error({ message: e , origin: 'getStats ', params: req.url.toString()});
      throw e;
    }

    res.status(200)
    .send({
      message: 'Success from getStats',
      status: res.status,
      result: results
    });
  }

  init() {
    this._router.get('/passages/:id', this.getStats.bind(this));
  }
}

export const statsRoutes = new StatsRouter();
statsRoutes.init();
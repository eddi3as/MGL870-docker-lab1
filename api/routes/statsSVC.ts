import { Router, Request, Response, NextFunction } from 'express';
import axios from 'axios';
import * as Auth from '../middleware/auth.middleware'
import { l_log } from "../utils/logger";
import { restResponseTimeHistogram } from "../utils/metrics";

export class StatsRouter {
  private _router: Router;

  get router() {
    return this._router;
  }

  constructor() {
    this._router = Router();
    this.init();
  }
  
  public async getStats(req: Request, res: Response, next: NextFunction) {
    const id = req.query.id;
    const debut = req.query.debut; //YYYY-MM-DD
    const fin = req.query.fin;
    const limitParam = req.query.limite;
    let limit = 0;
    let results = null;

    if(limitParam)
      limit = parseInt(limitParam.toString());
    
    let textreq = process.env.BIXI_STATS_BASE_URL + `/passages/` + id

    const timer = restResponseTimeHistogram.startTimer();
    try {
      const res = await axios.get(textreq, {
        params: { debut: debut, fin: fin, limite: limitParam }
      });
      req.method, 
      results = res.data.result;
    } catch (error) {
      l_log.error({ message: error, origin: 'gateway-getStats', params: req.url.toString() });
      throw error;
      // Handle errors
      /*
      100054073
      2019-01-01
      2019-01-15
      */
    } finally{
      timer({ method: req.method, route: req.route.path });
    }

    res.status(200)
    .send({
      message: 'Success from getStats',
      status: res.status,
      result: results
    });
  }

  init() {
    this._router.get('/passages', Auth.authorize(), this.getStats.bind(this));
  }
}

export const statsRoutes = new StatsRouter();
statsRoutes.init();
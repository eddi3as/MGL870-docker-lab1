import { Router, Request, Response, NextFunction } from 'express';
import axios from 'axios';
import * as Auth from '../middleware/auth.middleware'
import { l_log } from "../utils/logger";
import { restResponseTimeHistogram } from "../utils/metrics";

export class CompteurRouter {
  private _router: Router;

  get router() {
    return this._router;
  }

  constructor() {
    this._router = Router();
    this.init();
  }

  public async allCompteurs(req: Request, res: Response, next: NextFunction) {
    const limitParam = req.query.limite;
    let filter = {};
    let limit = 0;
    let results = null;
    const timer = restResponseTimeHistogram.startTimer();
    if(limitParam)
      limit = parseInt(limitParam.toString());

    try {
      const res = await axios.get(process.env.BIXI_COUNTERS_BASE_URL + `/compteurs`);
      results = res.data.result;
    } catch (error) {
      // Handle errors
        l_log.error({ message: error, origin: 'gateway-allCompteurs', params: req.url.toString() });
        throw error;
    } finally {
        timer({ method: req.method, route: req.route.path });
    }

    res.status(200)
    .send({
      message: 'Success from allCompteurs',
      status: res.status,
      result: results
    });
  }

  public async getCompteur(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id;
    let filter = { ID: parseInt(id) };
    let results = null;
    const timer = restResponseTimeHistogram.startTimer();
    
    let textreq = process.env.BIXI_COUNTERS_BASE_URL + `/compteurs/`+id;
    try {

      const res = await axios.get(textreq);
      results = res.data.result;
    } catch (error) {
      // Handle errors
        l_log.error({ message: error, origin: 'gateway-getCompteur', params: req.url.toString() });
        throw error;
    } finally {
        timer({ method: req.method, route: req.route.path });
    }

    res.status(200)
    .send({
      message: 'Success from getCompteur',
      status: res.status,
      result: results
    });
  }

  init() {
    this._router.get('/compteurs', Auth.authorize(), this.allCompteurs.bind(this));
    this._router.get('/compteurs/:id', Auth.authorize(), this.getCompteur.bind(this));
  }
}

export const compteurRoutes = new CompteurRouter();
compteurRoutes.init();
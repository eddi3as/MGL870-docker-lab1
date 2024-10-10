import { Router, Request, Response, NextFunction } from 'express';
import axios from 'axios';
import * as Auth from '../middleware/auth.middleware'
import { l_log } from "../utils/logger";

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
    if(limitParam)
      limit = parseInt(limitParam.toString());

    try {
      const res = await axios.get(process.env.BIXI_BASE_URL + `/compteurs`);
      results = res.data.result;
    } catch (error) {
      // Handle errors
        l_log.error({ message: error, origin: 'gateway-allCompteurs', params: req.url.toString() });
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
    
    let textreq = process.env.BIXI_BASE_URL + `/compteurs/`+id;
    try {

      const res = await axios.get(textreq);

      results = res.data.result;
    } catch (error) {
      // Handle errors
        l_log.error({ message: error, origin: 'gateway-getCompteur', params: req.url.toString() });
    }

    res.status(200)
    .send({
      message: 'Success from getCompteur',
      status: res.status,
      result: results
    });
  }

  public async getCompteurStats(req: Request, res: Response, next: NextFunction) {
    const id = req.query.id;
    const debut = req.query.debut; //YYYY-MM-DD
    const fin = req.query.fin;
    const limitParam = req.query.limite;
    let limit = 0;
    let results = null;

    if(limitParam)
      limit = parseInt(limitParam.toString());
    
    let textreq = process.env.BIXI_BASE_URL + `/compteurs/` + id + `/passages`
    try {
      const res = await axios.get(textreq, {
        params: { debut: debut, fin: fin, limite: limitParam }
      });

      results = res.data.result;
    } catch (error) {
      l_log.error({ message: error, origin: 'gateway-getCompteurStats', params: req.url.toString() });
      // Handle errors
      /*
      100054073
      2019-01-01
      2019-01-15
      */
    }

    res.status(200)
    .send({
      message: 'Success from getCompteurStats',
      status: res.status,
      result: results
    });
  }

  init() {
    this._router.get('/compteurs', Auth.authorize(), this.allCompteurs.bind(this));
    this._router.get('/compteurs/:id', Auth.authorize(), this.getCompteur.bind(this));
    this._router.get('/passages', Auth.authorize(), this.getCompteurStats.bind(this));
  }
}

export const compteurRoutes = new CompteurRouter();
compteurRoutes.init();
import { Router, Request, Response, NextFunction } from 'express';
import { CompteurCtrl } from '../controller/compteurCtrl'
import { Utils } from '../utils/utils';
import { databaseResponseTimeHistogram } from "../utils/metrics";

import { createLogger, transports, format } from "winston";
import LokiTransport from "winston-loki";

const l_log = createLogger({
  transports: [new LokiTransport({
      host: "http://loki:3100",
      labels: { app: 'nodejs-bixi'},
      json: true,
      format: format.json(),
      replaceTimestamp: true,
      onConnectionError: (err) => console.error(err)
    }),
    new transports.Console({
      format: format.combine(format.simple(), format.colorize())
    })]
})


export class CompteurRouter {
  private _router: Router;
  private _cmptCtrl: CompteurCtrl;

  get compteurCtrl() {
    return this._cmptCtrl;
  }

  get router() {
    return this._router;
  }

  constructor() {
    this._cmptCtrl = new CompteurCtrl();
    this._router = Router();
    this.init();
  }

  public async allCompteurs(req: Request, res: Response, next: NextFunction) {
    const limitParam = req.query.limite;
    let filter = {};
    let limit = 0;
    let results = null;
    const metricsLabels = {
      operation: "getAllCompteurs",
    };

    if(limitParam)
      limit = parseInt(limitParam.toString());

    const timer = databaseResponseTimeHistogram.startTimer();

    try{
      results = await this._cmptCtrl.getCompteur(filter, limit);
      l_log.info({ message: `Hello World`, labels: { 'origin': 'getAllCompteurs' } })
      timer({ ...metricsLabels, success: "true" });
    }catch(e){
      timer({ ...metricsLabels, success: "false" });
      l_log.info({ message: `Hello World`, labels: { 'origin': 'getAllCompteurs' } })
      throw e;
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
    const metricsLabels = {
      operation: "getCompteursID",
    };
    
    const timer = databaseResponseTimeHistogram.startTimer();

    try{
      results = await this._cmptCtrl.getCompteur(filter, 0);
      timer({ ...metricsLabels, success: "true" });
    }catch(e){
      timer({ ...metricsLabels, success: "false" });
      throw e;
    }

    res.status(200)
    .send({
      message: 'Success from getCompteur',
      status: res.status,
      result: results
    });
  }

  public async getCompteurStats(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id;
    const debut = req.query.debut;
    const fin = req.query.fin;
    const limitParam = req.query.limite;
    let limit = 0;
    let filter = { borne_id: id };
    let results = null;
    const metricsLabels = {
      operation: "getCompteurStats",
    };

    if(limitParam)
      limit = parseInt(limitParam.toString());

    Utils.setFilterDates(filter, debut, fin);
    const timer = databaseResponseTimeHistogram.startTimer();

    try{
      results = await this._cmptCtrl.getCompteurStats(filter, limit);
      timer({ ...metricsLabels, success: "true" });
    }catch(e){
      timer({ ...metricsLabels, success: "false" });
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
    this._router.get('/compteurs', this.allCompteurs.bind(this));
    this._router.get('/compteurs/:id', this.getCompteur.bind(this));
    this._router.get('/compteurs/:id/passages', this.getCompteurStats.bind(this));
  }
}

export const compteurRoutes = new CompteurRouter();
compteurRoutes.init();
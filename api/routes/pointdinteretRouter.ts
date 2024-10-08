import { Router, Request, Response, NextFunction } from 'express'
import { PointInteretCtrl } from '../controller/pointinteretCtrl'
import PointInteret from '../models/pointinteret'
import { databaseResponseTimeHistogram } from "../utils/metrics";

export class PointInteretRouter {
  private _router: Router;
  private _pntCtrl: PointInteretCtrl;

  get router() {
    return this._router;
  }

  constructor() {
    this._pntCtrl = new PointInteretCtrl();
    this._router = Router();
    this.init();
  }

  public async getAllPointsInteret(req: Request, res: Response, next: NextFunction) {
    const nom = req.query.nom;
    const limitParam = req.query.limite;
    const type = req.query.type;
    let limit = 0;
    let filter = {};
    let results = null;

    if(limitParam)
      limit = parseInt(limitParam.toString());
    if(type)
      filter["Type"] = type;
    if(nom)
      filter["Nom_parc_lieu"] = nom;

    const metricsLabels = {
      operation: "getAllFontaines",
    };

    const timer = databaseResponseTimeHistogram.startTimer();
    try{
      results = await this._pntCtrl.getPointInteret(filter, limit);
      timer({ ...metricsLabels, success: "true" });
    }catch(e){
      timer({ ...metricsLabels, success: "false" });
      throw e;
    }

    res.status(200)
    .send({
      message: 'Success from getAllPointsInteret',
      status: res.status,
      result: JSON.parse(results)
    });
  }

  public async getPointInteret(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id;
    const limitParam = req.query.limite;
    let limit = 0;
    let filter = { ID: Number.parseFloat(id) };
    let results = null;

    if(limitParam)
      limit = parseInt(limitParam.toString());

    const metricsLabels = {
      operation: "getPointInteret",
    };

    const timer = databaseResponseTimeHistogram.startTimer();
    try{
      results = await this._pntCtrl.getPointInteret(filter, limit);
      timer({ ...metricsLabels, success: "true" });
    }catch(e){
      timer({ ...metricsLabels, success: "false" });
      throw e;
    }

    res.status(200)
    .send({
      message: 'Success from getPointInteret',
      status: res.status,
      result: JSON.parse(results)
    });
  }

  public async addPointInteret(req: Request, res: Response, next: NextFunction) {
    let pointint = new PointInteret(
      parseInt(req.body.id), 
      req.body.neighbourhood, 
      req.body.parc_name,
      "", 
      "", 
      req.body.install_date,
      req.body.comment, 
      "", 
      1,
      1, 
      parseFloat(req.body.longitude), 
      parseFloat(req.body.latitude),
      req.body.type,
      req.body.adress
    );
    const metricsLabels = {
      operation: "addPointInteret",
    };

    const timer = databaseResponseTimeHistogram.startTimer();
    try{
      let msg = await this._pntCtrl.addPointInteret(pointint);
      timer({ ...metricsLabels, success: "true" });
    }catch(e){
      timer({ ...metricsLabels, success: "false" });
      throw e;
    }

    res.status(200)
    .send({
        message: 'Success from addPointInteret',
        status: res.status
    });
  }

  init() {
    this._router.get('/pointsdinteret', this.getAllPointsInteret.bind(this));
    this._router.get('/pointsdinteret/:id', this.getPointInteret.bind(this));
    this._router.post('/pointsdinteret', this.addPointInteret.bind(this));
  }
}

export const pointinteretRoutes = new PointInteretRouter();
pointinteretRoutes.init();
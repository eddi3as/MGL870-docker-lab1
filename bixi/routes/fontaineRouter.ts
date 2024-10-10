import { Router, Request, Response, NextFunction } from 'express'
import { FontaineCtrl } from '../controller/fontaineCtrl'
import Fontaine from '../models/fontaine'
import { databaseResponseTimeHistogram } from "../utils/metrics";

export class FontaineRouter {
  private _router: Router;
  private _fntCtrl: FontaineCtrl;

  get fontaineCtrl() {
    return this._fntCtrl;
  }

  get router() {
    return this._router;
  }

  /**
   * Initialiser le router
   */
  constructor() {
    this._fntCtrl = new FontaineCtrl();
    this._router = Router();
    this.init();
  }

  public async getAllFontaines(req: Request, res: Response, next: NextFunction) {
    let filter = {};
    let results = null;
    const metricsLabels = {
      operation: "getAllFontaines",
    };

    const timer = databaseResponseTimeHistogram.startTimer();
    try{
      results = await this._fntCtrl.getFontaine(filter);
      timer({ ...metricsLabels, success: "true" });
    }catch(e){
      timer({ ...metricsLabels, success: "false" });
      throw e;
    }
    
    res.status(200)
    .send({
      message: 'Success from getAllFontaines',
      status: res.status,
      result: JSON.parse(results)
    });
  }

  public async getFontaine(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id
    let filter = { ID: Number.parseFloat(id) }
    let results = null;
    const metricsLabels = {
      operation: "getFontaine",
    };

    const timer = databaseResponseTimeHistogram.startTimer();
    try{
      results = await this._fntCtrl.getFontaine(filter);
      timer({ ...metricsLabels, success: "true" });
    }catch(e){
      timer({ ...metricsLabels, success: "false" });
      throw e;
    }
    res.status(200)
    .send({
      message: 'Success from getFontaine',
      status: res.status,
      result: JSON.parse(results)
    });
  }

  public async ajoutFontaine(req: Request, res: Response, next: NextFunction) {
    let fontaine = new Fontaine(
        req.body.id,
        req.body.arrondissement,
        req.body.nom_parc_lieu,
        "",
        "",
        req.body.date_installation,
        req.body.remarques,
        "",
        "",
        "",
        req.body.latitude,
        req.body.longitude
    )
    const metricsLabels = {
      operation: "ajoutFontaine",
    };

    const timer = databaseResponseTimeHistogram.startTimer();
    try{
      let msg = await this._fntCtrl.insertFontaine(fontaine);
      timer({ ...metricsLabels, success: "true" });
    }catch(e){
      timer({ ...metricsLabels, success: "false" });
      throw e;
    }

    res.status(200)
    .send({
      message: 'Success from ajoutFontaine',
      status: res.status
    });
  }

  /**
     * Take each handler, and attach to one of the Express.Router's
     * endpoints.
     */
  init() {
    this._router.get('/fontaines', this.getAllFontaines.bind(this));
    this._router.get('/fontaines/:id', this.getFontaine.bind(this));
    this._router.post('/fontaines', this.ajoutFontaine.bind(this));
  }

}

// exporter its configured Express.Router
export const fontaineRoutes = new FontaineRouter();
fontaineRoutes.init();
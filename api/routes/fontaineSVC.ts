import { Router, Request, Response, NextFunction } from 'express'
import axios from 'axios';
import Fontaine from '../models/fontaine'
import { l_log } from "../utils/logger";
import * as Auth from '../middleware/auth.middleware'

export class FontaineRouter {
  private _router: Router;
  private auth_url: string;

  get router() {
    return this._router;
  }

  /**
   * Initialiser le router
   */
  constructor() {
    this._router = Router();
    this.init();
  }

  public async getAllFontaines(req: Request, res: Response, next: NextFunction) {
    let results = null;

    try {
      const resdata = await axios.get(process.env.BIXI_STATIONS_BASE_URL + `/fontaines`);
      results = resdata.data.result;
    } catch (error) {
      // Handle errors
        l_log.error({ message: error, origin: 'gateway-getAllFontaines', params: req.url.toString() });
    }

    res.status(200)
    .send({
      message: 'Success from getAllFontaines',
      status: res.status,
      result: results
    });
  }

  public async getFontaine(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id
    let results = null;
    
    let textreq = process.env.BIXI_STATIONS_BASE_URL + `/fontaines/`+ id;

    try {
      const res = await axios.get(textreq);
      results = res.data.result;
    } catch (error) {
      // Handle errors
        l_log.error({ message: error, origin: 'gateway-getFontaine', params: req.url.toString() });
    }

    res.status(200)
    .send({
      message: 'Success from getFontaine',
      status: res.status,
      result: results
    });
  }

  public async ajoutFontaine(req: Request, res: Response, next: NextFunction) {
    let resdata = null;
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
    try {
      resdata = await axios.post(process.env.BIXI_STATIONS_BASE_URL + `/fontaines`, { 
        id: fontaine.ID, arrondissement: fontaine.Arrondissement, 
        nom_parc_lieu: fontaine.Nom_parc_lieu, date_installation: fontaine.Date_installation,
        remarques: fontaine.Remarque, latitude: fontaine.Latitude, longitude: fontaine.Longitude });
    } catch (error) {
      // Handle errors
        l_log.error({ message: error, origin: 'gateway-ajoutFontaine', params: req.url.toString() });
    }


      

    res.status(200)
    .send({
      message: 'Success from ajoutFontaine',
      status: resdata.status
    });
  }

  /**
     * Take each handler, and attach to one of the Express.Router's
     * endpoints.
     */
  init() {
    this._router.get('/fontaines', Auth.authorize(), this.getAllFontaines.bind(this));
    this._router.get('/fontaines/:id', Auth.authorize(), this.getFontaine.bind(this));
    this._router.post('/fontaines', Auth.authorize(), this.ajoutFontaine.bind(this));
  }

}

// exporter its configured Express.Router
export const fontaineRoutes = new FontaineRouter();
fontaineRoutes.init();
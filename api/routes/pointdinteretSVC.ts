import { Router, Request, Response, NextFunction } from 'express'
import axios from 'axios';
import PointInteret from '../models/pointinteret'
import * as Auth from '../middleware/auth.middleware'
import { l_log } from "../utils/logger";

export class PointInteretRouter {
  private _router: Router;

  get router() {
    return this._router;
  }

  constructor() {
    this._router = Router();
    this.init();
  }

  public async getAllPointsInteret(req: Request, res: Response, next: NextFunction) {
    const nom = req.query.nom;
    const limitParam = req.query.limite;
    const type = req.query.type;
    let results = null;

    try {
      const resdata = await axios.get(process.env.BIXI_BASE_URL + `/pointsdinteret`, 
        { params: { nom: nom, limite: limitParam, type: type} });
      results = resdata.data.result;
    } catch (error) {
      // Handle errors
        l_log.error({ message: error, origin: 'gateway-getAllPointsInteret', params: req.url.toString() });
    }

    res.status(200)
    .send({
      message: 'Success from getAllPointsInteret',
      status: res.status,
      result: results
    });
  }

  public async getPointInteret(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id;
    const limitParam = req.query.limite;
    let results = null;
    
    let textreq = process.env.BIXI_BASE_URL + `/pointsdinteret/`+id;

    try {
      const res = await axios.get(textreq);
      results = res.data.result;
    } catch (error) {
      // Handle errors
        l_log.error({ message: error, origin: 'gateway-getPointInteret', params: req.url.toString() });
    }

    res.status(200)
    .send({
      message: 'Success from getPointInteret',
      status: res.status,
      result: results
    });
  }

  public async addPointInteret(req: Request, res: Response, next: NextFunction) {
    let resdata = null;
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

    
    try {
      resdata = await axios.post(process.env.BIXI_BASE_URL + `/pointsdinteret`, { 
        id: req.body.id, neighbourhood: pointint.Arrondissement, 
        parc_name: pointint.Nom_parc_lieu, install_date: pointint.Date_installation,
        comment: pointint.Remarque, latitude: req.body.latitude, longitude: req.body.longitude,
        type: pointint.Type, adress: pointint.Adress });
    } catch (error) {
      // Handle errors
        l_log.error({ message: error, origin: 'gateway-addPointInteret', params: req.url.toString() });
    }

    res.status(200)
    .send({
        message: 'Success from addPointInteret',
        status: res.status
    });
  }

  init() {
    this._router.get('/pointsdinteret', Auth.authorize(), this.getAllPointsInteret.bind(this));
    this._router.get('/pointsdinteret/:id', Auth.authorize(), this.getPointInteret.bind(this));
    this._router.post('/pointsdinteret', Auth.authorize(), this.addPointInteret.bind(this));
  }
}

export const pointinteretRoutes = new PointInteretRouter();
pointinteretRoutes.init();
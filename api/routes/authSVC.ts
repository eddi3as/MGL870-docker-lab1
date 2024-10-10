import { Router, Request, Response, NextFunction } from 'express';
import axios from 'axios';
import { l_log } from "../utils/logger";

export class AuthRouter {
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
    this.auth_url = process.env.BASE_AUTH_URL || 'http://apiauth:4001/api';
  }

  /**
   * Authentifier l'usager
   */
  public async authentifier(req: Request, res: Response, next: NextFunction){
    const uname = req.body.uname;
    const pswd = req.body.pswd;
    let token = null;
    try {
        const res = await axios.post(this.auth_url + `/authentifier`, { uname: uname, pswd: pswd });
        token = res.data;
        l_log.info({ message: 'Login success' , origin: 'gateway-authentifier', params: req.url.toString() });
    } catch (e) {
        // Handle errors
        l_log.error({ message: e , origin: 'gateway-authentifier', params: req.url.toString() });
    }
      
    
      res.status(200)
      .send({
        message: 'Success',
        status: res.status,
        data: token
      });
  }
  
  /**
   * Verifier token JWT
   */
  public async verifyToken(req: Request, res: Response, next: NextFunction){
    const uname = req.body.uname;
    const token = req.body.token;
    let result = null;
    try {
        const res = await axios.post(this.auth_url + `/verifiertoken`, { uname: uname, token: token });
        result = res.data;
    } catch (e) {
        // Handle errors
        l_log.error({ message: e , origin: 'gateway-verifyToken', params: req.url.toString() });
    }

    res.status(200)
    .send({
        message: 'Success',
        status: res.status,
        data: result
    });

  }
  
  /**
   * Logout l'usager
   */
  public async logout(req: Request, res: Response, next: NextFunction){
    let msg = null;
    try {
        const res = await axios.post(this.auth_url + `/logout`, { session: null });
        msg = res.data.result;
        l_log.info({ message: 'Logout success' , origin: 'gateway-authentifier', params: req.url.toString() });
    } catch (e) {
        // Handle errors
        l_log.error({ message: e , origin: 'gateway-logout', params: req.url.toString() });
    }

    res.status(200)
    .send({
        message: 'Success',
        status: res.status,
        data: msg
    });
  }
  
  /**
  * Take each handler, and attach to one of the Express.Router's
  * endpoints.
  */
  init() {
    this.router.post('/authentifier', this.authentifier.bind(this));
    this.router.post('/verifiertoken', this.verifyToken.bind(this));
    this.router.post('/logout', this.logout.bind(this));
  }
}

// exporter its configured Express.Router
export const authRoutes = new AuthRouter();
authRoutes.init();
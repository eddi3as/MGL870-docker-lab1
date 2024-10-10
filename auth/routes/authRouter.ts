import { Router, Request, Response, NextFunction } from 'express';
import { InvalidParameterError } from '../utils/errors/invalidParameterError';
import { AuthCtrl } from '../controllers/authCtrl';
import { userCounter } from "../utils/metrics";
import { l_log } from "../utils/logger";

export class AuthRouter {
  private _router: Router;
  private _authCtrl: AuthCtrl;  // contrôleur GRASP

  get router() {
    return this._router;
  }

  
  /**
   * Initialiser le router
   */
   constructor() {
    this._authCtrl = new AuthCtrl(); // un routeur pointe vers au moins un contrôleur GRASP
    this._router = Router();
    this.init();
  }
  
  /**
   * Authentifier l'usager
   */
  public async authentifier(req: Request, res: Response, next: NextFunction){
    const uname = req.body.uname;
    const pswd = req.body.pswd;
    try {
      this.verifyParams(uname, "uname");
      this.verifyParams(pswd, "pswd");
      let token = await this._authCtrl.login(uname, pswd);
      l_log.info({ message: 'Login success: ' + uname , origin: 'authentifier', params: req.url.toString() });
      userCounter.inc();
      
      res.status(200)
      .send({
        message: 'Success',
        status: res.status,
        data: token
      });
    } catch (error) {
      l_log.error({ message: error, origin: 'authentifier', params: req.url.toString() });
      this._errorCode500(error, req, res);
    }
  }
  
  /**
   * Verifier token JWT
   */
  public async verifyToken(req: Request, res: Response, next: NextFunction){
    const uname = req.body.uname;
    const token = req.body.token;
    try {
      this.verifyParams(uname, "uname");
      this.verifyParams(token, "token");
      let result = this._authCtrl.verifyToken(uname, token);
    
      res.status(200)
      .send({
        message: 'Success',
        status: res.status,
        data: result
      });
    } catch (error) {
      l_log.error({ message: error, origin: 'verifyToken', params: req.url.toString() });
      this._errorCode500(error, req, res);
    }
  }
  
  /**
   * Logout l'usager
   */
  public logout(req: Request, res: Response, next: NextFunction){
    const session = req.body.sesssion;
    const uname = req.query.uname;
    let msg = null;
    
    try {
      msg = this._authCtrl.logout(session);
      l_log.info({ message: 'Logout success: ' + uname , origin: 'logout', params: req.url.toString() });
      userCounter.dec();
    } catch (error) {
      l_log.error({ message: error, origin: 'logout', params: req.url.toString() });
      this._errorCode500(error, req, res);
    }
    
    res.status(200)
    .send({
        message: 'Success',
        status: res.status,
        data: msg
    });
  }

  private verifyParams(param: string, errorMsg: string){
    if (!param) {
      throw new InvalidParameterError('Le paramètre' + errorMsg + ' est absent');
    }
  }

  private _errorCode500(error: any, req: Request, res: Response<any, Record<string, any>>) {
    res.status(error.code).json({ error: error.toString() });
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
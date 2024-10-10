import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import { authRoutes } from "./routes/authRouter";
import { userCounter } from "./utils/metrics";
import client from 'prom-client';

const path = __dirname + '/views/';
const corsOptions = {
  origin: "*"
};

const register = new client.Registry();

register.setDefaultLabels({
  app: "node-auth",
});

register.registerMetric(userCounter);

const collectDefaultMetrics = client.collectDefaultMetrics;

collectDefaultMetrics({
    register: register, prefix: 'api_auth_metric_'
});

class App {
  public expressApp: express.Application;

  constructor() {
    this.expressApp = express();
    this.middleware();
    this.routes();
  }

  private middleware(): void {
    this.expressApp.use(logger('dev') as express.RequestHandler);
    this.expressApp.use(express.json() as express.RequestHandler);
    this.expressApp.use(express.urlencoded({ extended: true }) as express.RequestHandler);
    //this.expressApp.use(express.static(path) as express.RequestHandler);
    this.expressApp.use(cors());
  }
  
  // Configure API endpoints.
  private routes(): void {
    let router = express.Router();
    router.get('/', (req, res, next) => {
        console.log('App running...');
        res.send('App running...');
    });

    router.get("/metrics", async (req, res) => {
      res.setHeader("Content-Type", client.register.contentType);
      let metrics = await register.metrics();
      res.send(metrics);
    });

    this.expressApp.use('/', router);  // routage de base
    this.expressApp.use('/api', authRoutes.router); //auth route
  }

}

export default new App().expressApp;
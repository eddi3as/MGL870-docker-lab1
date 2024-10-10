import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import { fontaineRoutes } from './routes/fontaineRouter';
import { restResponseTimeHistogram } from "./utils/metrics";
import client from "prom-client";

const path = __dirname + '/views/';
const corsOptions = {
  origin: "*"
};

const register = new client.Registry();

register.setDefaultLabels({
  app: "node-bixi-streams",
});

register.registerMetric(restResponseTimeHistogram);

const collectDefaultMetrics = client.collectDefaultMetrics;

collectDefaultMetrics({
    register: register, prefix: 'node_bixi_stations_metric_'
});
// Creates and configures an ExpressJS web server.
class App {
  public expressApp: express.Application;
  private BASE_API =  '/gti525/v1';

  constructor() {
    this.expressApp = express();
    this.middleware();
    this.routes();
  }

  private middleware(): void {
    this.expressApp.use(logger('dev') as express.RequestHandler);
    this.expressApp.use(express.json() as express.RequestHandler);
    this.expressApp.use(express.urlencoded({ extended: true }) as express.RequestHandler);
    this.expressApp.use(express.static(path) as express.RequestHandler);
    if(this.isInProd()){
      this.expressApp.use(cors(corsOptions));
    }else{
      this.expressApp.use(cors());
    }
  }

  private isInProd(){
    return process.env.NODE_ENV.trim() == 'production';
  }

  // Configure API endpoints.
  private routes(): void {
    let router = express.Router();
    router.get('/', (req, res, next) => {
        res.sendFile(path + "index.html");
    });

    router.get("/metrics", async (req, res) => {
      res.set("Content-Type", client.register.contentType);
      return res.send(await client.register.metrics());
    });

    this.expressApp.use('/', router);  // routage de base
    this.expressApp.use(this.BASE_API, fontaineRoutes.router);
  }

}

export default new App().expressApp;
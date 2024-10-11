import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import client from 'prom-client';
import api from '@opentelemetry/api';
import { compteurRoutes } from './routes/compteurSVC';
import { authRoutes } from './routes/authSVC';
import { fontaineRoutes } from './routes/fontaineSVC';
import { pointinteretRoutes } from './routes/pointdinteretSVC';
import { statsRoutes } from './routes/statsSVC';
import { restResponseTimeHistogram } from "./utils/metrics";

const path = __dirname + '/views/';
const corsOptions = {
  origin: "*"
};

const register = new client.Registry();

register.setDefaultLabels({
  app: "node-api-gateway",
});

const http_request_counter = new client.Counter({
  name: 'node_api_gateway_http_request_count',
  help: 'Count of HTTP requests',
  labelNames: ['method', 'route', 'statusCode']
});

register.registerMetric(http_request_counter);
register.registerMetric(restResponseTimeHistogram);


const collectDefaultMetrics = client.collectDefaultMetrics;

collectDefaultMetrics({
    register: register, prefix: 'api_gateway_metric_'
});

class App {
  public expressApp: express.Application;
  private BASE_API =  '/api/v1';

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
      res.setHeader("Content-Type", client.register.contentType);
      let metrics = await register.metrics();
      res.send(metrics);
    });

    router.use("/*", function(req, res, next) {
        http_request_counter.labels({
            method: req.method,
            route: req.originalUrl,
            statusCode: res.statusCode
        }).inc();

        const activeSpan = api.trace.getSpan(api.context.active());
        res.header("trace-id", activeSpan?.spanContext().traceId);
        
        console.log(register.metrics());
        next();
    });

    this.expressApp.use('/', router);
    this.expressApp.use(this.BASE_API, authRoutes.router);
    this.expressApp.use(this.BASE_API, compteurRoutes.router);
    this.expressApp.use(this.BASE_API, fontaineRoutes.router);
    this.expressApp.use(this.BASE_API, pointinteretRoutes.router);
    this.expressApp.use(this.BASE_API, statsRoutes.router);
  }

}

export default new App().expressApp;


import { createLogger, transports, format } from "winston";
import LokiTransport from "winston-loki";
const { combine, timestamp, printf } = format;

const myFormat = printf(({ level, origin, params, message, timestamp}) => {
    return `${timestamp} ${origin} ${level}: ${message} ${params} `;
  });
  
export const l_log = createLogger({
  transports: [new LokiTransport({
      host: "http://loki:3100",
      labels: { app: 'node-bixi-stations'},
      json: true,
      format: combine(
        timestamp(),
        myFormat
      ),
      onConnectionError: (err) => console.error(err)
    }),
    new transports.Console({
      format: format.combine(format.simple(), format.colorize())
    })]
})
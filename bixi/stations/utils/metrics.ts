import client from "prom-client";

export const restResponseTimeHistogram = new client.Histogram({
  name: "bixistations_response_time_duration_seconds",
  help: "Bixi stations API response time in seconds",
  labelNames: ["method", "route"],
});

export const databaseResponseTimeHistogram = new client.Histogram({
  name: "bixistations_db_response_time_duration_seconds",
  help: "Bixi stations Database response time in seconds",
  labelNames: ["operation", "success"],
});
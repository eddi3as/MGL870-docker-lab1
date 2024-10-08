import client from "prom-client";

export const restResponseTimeHistogram = new client.Histogram({
  name: "api_bixi_response_time_duration_seconds",
  help: "Bixi API response time in seconds",
  labelNames: ["method", "route"],
});

export const databaseResponseTimeHistogram = new client.Histogram({
  name: "bixi_db_response_time_duration_seconds",
  help: "Bixi Database response time in seconds",
  labelNames: ["operation", "success"],
});
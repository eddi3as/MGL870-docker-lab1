import client from "prom-client";

export const restResponseTimeHistogram = new client.Histogram({
  name: "bixicounters_response_time_duration_seconds",
  help: "Bixi counters API response time in seconds",
  labelNames: ["method", "route"],
});

export const databaseResponseTimeHistogram = new client.Histogram({
  name: "bixicounters_db_response_time_duration_seconds",
  help: "Bixi counters Database response time in seconds",
  labelNames: ["operation", "success"],
});
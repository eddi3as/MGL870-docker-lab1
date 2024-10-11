import client from "prom-client";

export const databaseResponseTimeHistogram = new client.Histogram({
  name: "bixi_stats_db_response_time_duration_seconds",
  help: "Bixi stats Database response time in seconds",
  labelNames: ["operation", "success"],
});
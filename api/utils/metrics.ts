import client from "prom-client";

export const restResponseTimeHistogram = new client.Histogram({
  name: "api_gateway_response_time_duration_seconds",
  help: "Gateway API response time in seconds",
  labelNames: ["method", "route"],
});

export const countersResponseTimeHistogram = new client.Histogram({
  name: "api_gateway_counters_response_time_duration_seconds",
  help: "Gateway counters API response time in seconds",
  labelNames: ["method", "route"],
});

export const sitesResponseTimeHistogram = new client.Histogram({
  name: "api_gateway_sites_response_time_duration_seconds",
  help: "Gateway sites API response time in seconds",
  labelNames: ["method", "route"],
});

export const stationsResponseTimeHistogram = new client.Histogram({
  name: "api_gateway_stations_response_time_duration_seconds",
  help: "Gateway stations API response time in seconds",
  labelNames: ["method", "route"],
});

export const statsResponseTimeHistogram = new client.Histogram({
  name: "api_gateway_stats_response_time_duration_seconds",
  help: "Gateway API response time in seconds",
  labelNames: ["method", "route"],
});
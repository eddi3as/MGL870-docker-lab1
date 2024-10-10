import client from "prom-client";

export const userCounter = new client.Gauge({
  name: "user_counter",
  help: "User counter for my application"
});

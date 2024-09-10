const { Redis } = require("ioredis");
const { Worker } = require("bullmq");
const express = require("express");
const { WebSocketServer } = require("ws");

const app = express();
const PORT = 12356;

const server = app.listen(PORT, () =>
  console.log(`Server started at port ${PORT}.`)
);

const ws = new WebSocketServer({ server });

const connection = new Redis({
  host: "96.9.212.53",
  password: "Iamnumber!23",
  port: 2030,
  username: "default",
  maxRetriesPerRequest: null,
});

ws.on("connection", (client) => {
  console.log("A new client connected...");

  globalThis.wsClient = client;
  globalThis.wsClient.send("Connected");
});

const worker = new Worker(
  "test_queue",
  async (job) => {
    console.log("Sending job");

    globalThis.wsClient.send(JSON.stringify(job.data));
  },
  {
    connection,
    limiter: { max: 2, duration: 1000 },
    maxStalledCount: 2,
    removeOnComplete: { count: 0 },
  }
);

worker.on("completed", (job) =>
  console.log(`Job Id: ${job.id} has been completed!!`)
);

worker.on("failed", (job) => console.log(job));

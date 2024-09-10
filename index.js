const { Redis } = require("ioredis");
const { Queue } = require("bullmq");

const connection = new Redis({
  host: "96.9.212.53",
  password: "Iamnumber!23",
  port: 2030,
  username: "default",
  maxRetriesPerRequest: null,
});

const myQueue = new Queue("test_queue", { connection });

async function addJobToQueue() {
  await myQueue.add("job", { name: "gaurav" },{removeOnComplete});
}

addJobToQueue();

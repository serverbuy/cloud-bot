import app from "./app";
import { logger } from "./lib/logger";
import { startBot } from "./bot/index";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");
});

// In development the deployed production bot (VM) is already running 24/7 with
// the same token. Starting a second instance here causes every Discord message
// to be answered twice. Only start the bot when:
//   a) we are in production (NODE_ENV !== "development"), OR
//   b) the developer explicitly sets BOT_DEV=true to test locally.
const isDev = process.env["NODE_ENV"] === "development";
const forceDev = process.env["BOT_DEV"] === "true";

if (!isDev || forceDev) {
  startBot().catch((err) => {
    logger.error({ err }, "Failed to start Discord bot");
  });
} else {
  logger.info("Dev mode: Discord bot disabled (production VM handles commands). Set BOT_DEV=true to run locally.");
}

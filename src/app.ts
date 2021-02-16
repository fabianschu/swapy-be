import "module-alias/register";
import "reflect-metadata";
import config from "./config";
import express from "express";
import Logger from "./loaders/logger";
import loader from "./loaders";

async function startServer() {
  const app = express();
  await loader({ expressApp: app });

  app
    .listen(config.port, () => {
      Logger.info(`
      ###############################################
      🛡️  Server listening on port: ${config.port} 🛡️
      ###############################################
    `);
    })
    .on("error", (err) => {
      Logger.error(err);
      process.exit(1);
    });
}

startServer();

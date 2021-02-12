import expressLoader from "./express";
import dependencyInjectorLoader from "./dependencyInjector";
import Logger from "./logger";
import postgresLoader from "./postgres";

export default async ({ expressApp }) => {
  postgresLoader();
  Logger.info("✌️ DB loaded and connected!");

  dependencyInjectorLoader();

  expressLoader({ app: expressApp });
  Logger.info("✌️ Express loaded");
};

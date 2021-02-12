import expressLoader from "./express";
import dependencyInjectorLoader from "./dependencyInjector";
import Logger from "./logger";
import typeormLoader from "./typeorm";

export default async ({ expressApp }) => {
  const connection = await typeormLoader();
  Logger.info("✌️ DB loaded and connected!");

  dependencyInjectorLoader(connection);

  expressLoader({ app: expressApp });
  Logger.info("✌️ Express loaded");
};

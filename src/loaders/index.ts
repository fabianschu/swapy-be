import expressLoader from "./express";
import dependencyInjectorLoader from "./dependencyInjector";
import Logger from "./logger";
import typeormLoader from "./typeorm";
import { User } from "../entity/User";

export default async ({ expressApp }) => {
  await typeormLoader();
  Logger.info("✌️ DB loaded and connected!");

  const userModel = {
    name: "userRepository",
    model: User,
  };

  const models = [userModel];

  dependencyInjectorLoader({ models });

  expressLoader({ app: expressApp });
  Logger.info("✌️ Express loaded");
};

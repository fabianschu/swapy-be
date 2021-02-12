import { Container } from "typedi";
import { Connection } from "typeorm";
import LoggerInstance from "./logger";

export default (connection: Connection) => {
  try {
    Container.set("logger", LoggerInstance);
    Container.set("connection", connection);
  } catch (e) {
    LoggerInstance.error("🔥 Error on dependency injector loader: %o", e);
    throw e;
  }
};

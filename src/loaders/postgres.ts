import { Sequelize } from "sequelize-typescript";
import config from "../config";

export default async () => {
  const sequelize = new Sequelize(config.databaseURL);
  return sequelize;
};

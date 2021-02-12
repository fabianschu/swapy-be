import "reflect-metadata";
import { createConnection } from "typeorm";

export default async () => {
  try {
    return await createConnection();
  } catch (err) {
    console.log(err);
  }
};

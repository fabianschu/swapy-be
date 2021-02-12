import { Router, Request, Response } from "express";
import { Container } from "typedi";
import { Logger } from "winston";
import { Connection } from "typeorm";

const route = Router();

export default (app: Router) => {
  app.use(route);

  route.get("/users", (req: Request, res: Response) => {
    // const logger: Logger = Container.get("logger");
    // logger.debug("Calling Sign-Up endpoint with body: %o", req.body);
    const connection: Connection = Container.get("connection");
    console.log("asdasdasdasdasdasd");
    console.log(connection);
    return res.json("users 1,2,3").status(200);
  });
};

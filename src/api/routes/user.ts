import { Router, Request, Response } from "express";
import { Container } from "typedi";
import { Logger } from "winston";

const route = Router();

export default (app: Router) => {
  app.use(route);

  route.get("/users", (req: Request, res: Response) => {
    const logger: Logger = Container.get("logger");
    logger.debug("Calling Sign-Up endpoint with body: %o", req.body);

    return res.json("users 1,2,3").status(200);
  });
};

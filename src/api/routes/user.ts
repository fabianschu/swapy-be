import { Router, Request, Response, NextFunction } from "express";
import { Container } from "typedi";
import { Connection } from "typeorm";
import { User } from "../../entity/User";

const route = Router();

export default (app: Router) => {
  app.use(route);
  const connection: Connection = Container.get("connection");

  route.get(
    "/users",
    async (req: Request, res: Response, next: NextFunction) => {
      const users = await connection.manager.find(User);
      return res.json(users).status(200);
    }
  );

  route.post(
    "/users",
    async (req: Request, res: Response, next: NextFunction) => {
      let user = new User();
      user.nonce = req.body.nonce;
      user.pubAddr = req.body.pubAddr;
      try {
        const { id } = await connection.manager.save(user);
        return res.json(id).status(200);
      } catch (e) {
        next(e);
      }
    }
  );
};

import { Router, Request, Response, NextFunction } from "express";
import { Container } from "typedi";
import { Connection } from "typeorm";
import AuthService from "../../services/auth";
import { User } from "../../entity/User";
import { IUserInputDTO } from "../../interfaces/IUser";

const route = Router();

export default (app: Router) => {
  app.use(route);
  const userRepository: any = Container.get("userRepository");

  route.get(
    "/users",
    async (req: Request, res: Response, next: NextFunction) => {
      const users = await userRepository.find();
      return res.json(users).status(200);
    }
  );

  route.post(
    "/users",
    async (req: Request, res: Response, next: NextFunction) => {
      const authServiceInstance = Container.get(AuthService);
      try {
        const { user, token } = await authServiceInstance.SignUp(
          req.body as IUserInputDTO
        );
        // const { id } = await connection.manager.save(user);
        // return res.json(id).status(200);
      } catch (e) {
        next(e);
      }
    }
  );
};

import { Router, Request, Response, NextFunction } from "express";
import { Container } from "typedi";
import AuthService from "../../services/auth";
import { IUserInputDTO } from "../../interfaces/IUser";

const route = Router();

export default (app: Router) => {
  app.use(route);
  const userRepository: any = Container.get("userRepository");

  route.get(
    "/users/:pubAddr",
    async (req: Request, res: Response, next: NextFunction) => {
      const { pubAddr } = req.params;
      const user = await userRepository.findOne({ pubAddr });
      if (!user) return res.status(400).json({ error: "User not found" });
      return res.json({ pubAddr, nonce: user.nonce }).status(200);
    }
  );

  route.post(
    "/users",
    async (req: Request, res: Response, next: NextFunction) => {
      const authServiceInstance = Container.get(AuthService);
      const { user, token } = await authServiceInstance.SignUp(
        req.body as IUserInputDTO
      );
      // return res.json(id).status(200);
    }
  );
};

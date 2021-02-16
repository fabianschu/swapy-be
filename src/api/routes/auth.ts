import { Router, Request, Response, NextFunction } from "express";
import { Container } from "typedi";
import AuthService from "../../services/auth";
import { IUserInputDTO } from "../../interfaces/IUser";

const route = Router();

export default (app: Router) => {
  app.use(route);
  const userRepository: any = Container.get("userRepository");
  const authServiceInstance = Container.get(AuthService);

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
    "/users/signup",
    async (req: Request, res: Response, next: NextFunction) => {
      if (!req.body.pubAddr)
        return res.status(400).json({ error: "Public Address required" });
      const { pubAddr, nonce, message } = await authServiceInstance.SignUp(
        req.body as IUserInputDTO
      );
      if (message) return res.status(409).json(message);
      return res.json({ pubAddr, nonce }).status(200);
    }
  );

  route.post(
    "/users/signin",
    async (req: Request, res: Response, next: NextFunction) => {
      const { user, token, message } = await authServiceInstance.SignIn(
        req.body as IUserInputDTO
      );
      if (message) return res.status(400).json(message);
      // return res.json(id).status(200);
    }
  );
};

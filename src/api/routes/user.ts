import { Router, Request, Response } from "express";
const route = Router();

export default (app: Router) => {
  app.use(route);

  route.get("/users", (req: Request, res: Response) => {
    return res.json("users 1,2,3").status(200);
  });
};

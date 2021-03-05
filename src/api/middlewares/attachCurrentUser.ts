import { Container } from "typedi";
import { Repository } from "typeorm";
import { User } from "../../entity/User";
import { Logger } from "winston";

/**
 * Attach user to req.currentUser
 * @param {*} req Express req Object
 * @param {*} res  Express res Object
 * @param {*} next  Express next Function
 */
const attachCurrentUser = async (req, res, next) => {
  const Logger: Logger = Container.get("logger");
  try {
    const userRepository = Container.get("userRepository") as Repository<User>;
    console.log(req.token);
    const userRecord = await userRepository.find(req.token.pubAddr);
    if (!userRecord) {
      return res.sendStatus(401);
    }
    req.currentUser = { ...userRecord };
    return next();
  } catch (e) {
    Logger.error("🔥 Error attaching user to req: %o", e);
    return next(e);
  }
};

export default attachCurrentUser;
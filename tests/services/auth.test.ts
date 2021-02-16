import {
  getRepository,
  createConnection,
  Repository,
  Connection,
} from "typeorm";
import { privateToAddress } from "ethereumjs-util";
import AuthService from "../../src/services/auth";
import { User } from "../../src/entity/User";
import user from "../../src/api/routes/user";

const hexString =
  "c87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3";
const privateKey = Buffer.from(hexString, "hex");
const publicAddress = privateToAddress(privateKey).toString("hex");

describe("AuthService", () => {
  let authServiceInstance: AuthService;
  let connection: Connection;
  let userRepository: Repository<User>;

  const mockLoggerInstance = {
    error() {},
  };

  beforeAll(async () => {
    connection = await createConnection();
    userRepository = getRepository(User);
    authServiceInstance = new AuthService(userRepository, mockLoggerInstance);
  });

  afterAll(async () => {
    await connection.close();
  });

  describe("#SignUp", () => {
    afterEach(async () => {
      const user = await userRepository.findOne();
      await userRepository.delete(user.id);
    });

    it("creates a new user", async () => {
      const userInputDTO = {
        pubAddr: publicAddress,
      };
      const { id } = await authServiceInstance.SignUp(userInputDTO);
      const newUser = await userRepository.findOne(id);
      expect(newUser.pubAddr).toBe(publicAddress);
    });

    it("doesn't create the same user a second time", async () => {
      const userInputDTO = {
        pubAddr: "123456789",
      };
      await authServiceInstance.SignUp(userInputDTO);
      const newUser = await authServiceInstance.SignUp(userInputDTO);
      expect(newUser).toBeUndefined();
    });
  });

  describe("#SignIn", () => {
    afterEach(async () => {
      const user = await userRepository.findOne();
      user && (await userRepository.delete(user.id));
    });

    it("throws an error if the public address does not exist", async () => {
      const userInputDTO = {
        pubAddr: publicAddress,
      };
      try {
        await authServiceInstance.SignIn(userInputDTO);
      } catch (e) {
        expect(e.message).toMatch("User not registered");
      }
    });
  });
});

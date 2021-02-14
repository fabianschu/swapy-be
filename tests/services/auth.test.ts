import {
  getRepository,
  createConnection,
  Repository,
  Connection,
} from "typeorm";
import AuthService from "../../src/services/auth";
import { User } from "../../src/entity/User";

describe("#SignUp", () => {
  let authServiceInstance: AuthService;
  let connection: Connection;
  let userRepository: Repository<User>;

  const mockLoggerInstance = {
    info() {},
  };

  beforeAll(async () => {
    connection = await createConnection();
    userRepository = getRepository(User);
    authServiceInstance = new AuthService(userRepository, mockLoggerInstance);
  });

  afterEach(async () => {
    console.log("after each");
    const user = await userRepository.findOne();
    console.log(user);
    await userRepository.delete(user.id);
  });

  afterAll(async () => {
    await connection.close();
  });

  it("creates a new user", async () => {
    const userInputDTO = {
      pubAddr: "123456789",
    };
    const { id } = await authServiceInstance.SignUp(userInputDTO);
    const newUser = await userRepository.findOne(id);
    expect(newUser.pubAddr).toBe("123456789");
  });
});

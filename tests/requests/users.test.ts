import request from "supertest";
import express from "express";
import { getConnection, getRepository, Repository } from "typeorm";
import { privateToAddress } from "ethereumjs-util";
import loader from "../../src/loaders";
import { User } from "../../src/entity/User";

const hexString =
  "c87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3";
const privateKey = Buffer.from(hexString, "hex");
const publicAddress = privateToAddress(privateKey).toString("hex");
const app = express();

describe("GET /users", () => {
  beforeAll(async () => {
    await loader({ expressApp: app });
  });

  afterAll(async () => {
    const dbConnection = getConnection("default");
    await dbConnection.close();
  });

  describe("without parameter", () => {
    it("should return 404", (done) => {
      request(app).get(`/api/users`).send().expect(404).end(done);
    });
  });

  describe("without valid public address", () => {
    it("should return 400", (done) => {
      request(app)
        .get(`/api/users/lala`)
        .send()
        .expect(400)
        .expect({ error: "User not found" })
        .end(done);
    });
  });

  describe("with valid public address", () => {
    let userRepository: Repository<User>;

    beforeAll(() => {
      userRepository = getRepository(User);
    });

    beforeEach(async () => {
      await userRepository.save({ pubAddr: publicAddress, nonce: "123456" });
    });

    afterEach(async () => {
      const user = await userRepository.findOne();
      await userRepository.delete(user.id);
    });

    it("should return the user", async (done) => {
      request(app)
        .get(`/api/users/${publicAddress}`)
        .send()
        .expect(200)
        .expect({ pubAddr: publicAddress, nonce: "123456" })
        .end(done);
    });
  });
});

import request from "supertest";
import express from "express";

let expressApp = null;

beforeAll(async (done) => {
  expressApp = express();
  await require("../../src/loaders").default({ expressApp });
  done();
});

describe("GET /users", () => {
  it("should return 404", async () => {
    const res = await request(expressApp).get("/api/users").send();
    expect(res.status).toEqual(200);
  });
});

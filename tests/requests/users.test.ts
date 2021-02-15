import request from "supertest";
import express from "express";

let expressApp = null;

beforeAll(async () => {
  expressApp = express();
  await require("../../src/loaders").default({ expressApp });
});

describe("GET /users", () => {
  it("should return 200", async () => {
    const res = await request(expressApp).get("/api/users").send();
    expect(res.status).toEqual(200);
  });
});

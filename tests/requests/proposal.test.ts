import request from "supertest";
import express from "express";
import { getConnection, getRepository, Repository } from "typeorm";
import loader from "../../src/loaders";
import { Proposal } from "../../src/entity/Proposal";

const app = express();

describe("/proposals route", () => {
  let proposalRepository: Repository<Proposal>;

  beforeAll(async () => {
    await loader({ expressApp: app });
    proposalRepository = getRepository(Proposal);
  });

  afterAll(async () => {
    const dbConnection = getConnection("default");
    await dbConnection.close();
  });

  describe("POST /proposals", () => {
    describe("without parameter", () => {
      it("should return 400", (done) => {
        request(app).post(`/api/proposals`).send().expect(400).end(done);
      });
    });

    describe("with valid parameters", () => {
      afterEach(async () => {
        const proposal = await proposalRepository.findOne();
        proposal && (await proposalRepository.delete(proposal.id));
      });

      it("creates a proposal", async (done) => {
        const proposal = {
          offerAddress: "abc123",
        };
        await request(app).post(`/api/proposals`).send(proposal);
        const savedProposal = await proposalRepository.findOne(proposal);
        expect(savedProposal.offerAddress).toBe(proposal.offerAddress);
        done();
      });
    });
  });
});

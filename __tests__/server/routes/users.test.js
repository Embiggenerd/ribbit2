const chai = require("chai");
const chaiHTTP = require("chai-http");
const faker = require("faker");
const mongoose = require('mongoose');
const { expect } = chai;

const server = require("../../../server/app");

chai.use(chaiHTTP);

let token;

describe("Users route", () => {
  const signup = "/api/users/signup";
  const login = "/api/users/signin";
  const secret = "/api/users/secret";
  const user = {
    email: faker.internet.email(),
    password: faker.internet.password()
  };

  const preSave = {
    email: "iggles@internet.com",
    password: faker.internet.password()
  };

  before(async () => {
    const result = await chai
      .request(server)
      .post(signup)
      .send(preSave);
    expect(result.status).to.equal(200);
    token = result.body.token;
  });

  after("droping test db", async () => {
    await mongoose.connection.dropDatabase(() => {
      console.log("\n Test database dropped");
    });
    await mongoose.connection.close();
  });

  describe("Signup", () => {
    it("Should create new user if email not found in database", async () => {
      try {
        const result = await chai
          .request(server)
          .post(signup)
          .send(user);
        expect(result.status).to.equal(200);
        expect(result.body).not.to.empty;
        expect(result.body).to.have.property("token");
      } catch (e) {
        console.log(e);
      }
    });

    it("Should return 403 if email was found", async () => {
      try {
        await chai
          .request(server)
          .post(signup)
          .send(preSave);
      } catch (e) {
        expect(e.status).to.equal(403);
        expect(error.response.text).to.equal(
          '{"error":"Email is already in use."}'
        );
      }
    });
  });

  describe("Secret", () => {
    it("Should return 401 without token in request", async () => {
      try {
        await chai.request(server).get(secret);
      } catch (e) {
        expect(e.status).to.equal(401);
        expect(e.response.text).to.equal("Unauthorized");
      }
    });

    it("Should return 200 with correct token", async () => {
      try {
        const result = await chai
          .request(server)
          .get(secret)
          .set("Authorization", token);

        expect(result.status).to.equal(200);
        expect(result.body).to.deep.equal({ secret: "resource" });
      } catch (e) {
        throw new Error(e);
      }
    });
  });

  describe("Login", () => {
    it("Should respond with error 400 if email and password empty", async () => {
      let user = {};
      try {
        const result = await chai
          .request(server)
          .post(login)
          .send(user);
      } catch (e) {
        expect(e.status).to.be.equal(400);
      }
    });

    it("Should respond 200 and token", async () => {
      try {
        const result = await chai
          .request(server)
          .post(login)
          .send(preSave);

        expect(result.status).to.be.equal(200);
        expect(result.body).not.to.be.empty;
        expect(result.body).to.have.property("token");
      } catch (e) {
        throw new Error(e);
      }
    });
  });
});

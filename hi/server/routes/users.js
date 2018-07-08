const chai = require("chai");
const chaiHTTP = require("chai-http");
const faker = require("faker");
const mongoose = require("mongoose");
const { expect } = chai;

const server = require("../../../server/app");

chai.use(chaiHTTP);

let token;

describe("Users route", function() {
  this.timeout(10000);
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

  before("Assigning to token.", async () => {
    try {
      const result = await chai
        .request(server)
        .post(signup)
        .send(preSave);
      expect(result.status).to.equal(200);
      token = result.body.token;
      await mongoose.connection.dropDatabase(() => {
        console.log("\n Test database dropped2");
      });
    } catch (e) {
      console.log(e)
      throw new Error(e);
    }
  });

  after("Stopping test db.", async () => {
    // await mongoose.connection.dropDatabase(() => {
    //   console.log('\n Test database dropped2');
    // });
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
        throw new Error(e);
      }
    });

    it("Should return 403 if email was found", async () => {
      try {
        const result = await chai
          .request(server)
          .post(signup)
          .send(preSave);

        expect(result.status).to.equal(403);
        expect(result.text).to.contain(
          `${preSave.email} already exists in the database.`
        );
      } catch (e) {
        throw new Error(e);
      }
    });
  });

  describe("Secret", () => {
    it("Should return 401 without token in request", async () => {
      try {
        const result = await chai.request(server).get(secret);
        expect(result.status).to.equal(401);
        expect(result.text).to.equal("Unauthorized");
      } catch (e) {
        throw new Error(e);
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
        expect(result.status).to.be.equal(400);
      } catch (e) {
        throw new Error(e);
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

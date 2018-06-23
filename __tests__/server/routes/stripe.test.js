const chai = require("chai");
const chaiHTTP = require("chai-http");
const faker = require("faker");
const mongoose = require("mongoose");
const { expect } = chai;
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const rewire = require("rewire");
const passport = require("passport");

//let route = require('../../../routes/api/stripe');

const server = require("../../../server/app");

chai.use(chaiHTTP);

let token;

describe("Stripe route", () => {
  const stripe = "/api/stripe/";
  const unauthedUser = {
    user: {},
    id: "token"
  };
  const authedUser = {
    user: "xyz"
  };

  it("Should return 401 if user not authenticated.", async () => {
    try {
      const result = await chai
        .request(server)
        .post(stripe)
        .send(unauthedUser);
      expect(result.status).to.equal(401);
    } catch (e) {
      throw new Error(e);
    }
  });

  // it('Should respond with 200 if req authentic.', async () => {
  //   const sandbox = sinon.createSandbox();
  //   sandbox.stub(passport, 'authenticate').returns((req.user = 'user'));

  //   sandbox.restore();
  //   // let
  //   // try {
  //   //   const result = await chai
  //   //     .request(server)
  //   //     .post(stripe)
  //   //     .set(authedUser);
  //   //   expect(result.status).to.equal(200);
  //   // } catch (e) {
  //   //   throw new Error(e);
  //   // }
  // });
  describe("When user is authenticated,", () => {
    beforeEach(() => {
      this.authenticate = sinon
        .stub(passport, "authenticate")
        .returns(() => {});
    });

    afterEach(() => {
      this.authenticate.restore();
    });

    describe("nested", () => {
      beforeEach(() => {
        this.authenticate.yields(null, { id: 1 });
      });
      it("responds with status 200", async () => {
        try {
          const result = await chai
            .request(server)
            .post(stripe)
            .send({});
          expect(result.status).to.equal(200);
        } catch (e) {
          throw new Error(e);
        }
      });
    });
  });
});

// send post req with user object to fake signed in user

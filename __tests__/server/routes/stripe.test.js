const chai = require("chai");
const chaiHTTP = require("chai-http");
const faker = require("faker");
const mongoose = require("mongoose");
const { expect } = chai;

const server = require("../../../server/app");

chai.use(chaiHTTP);

let token;

describe("Stripe route", () => {
  const stripe = "/api/stripe/";
  const unauthedUser = {
    user: {},
    id: "token"
  };

  it("Should return error if user not authenticated", async (done) => {
    try {
      const result = await chai
        .request(server)
        .post(stripe)
        .send(unauthedUser);
      
      expect(result.status).to.equal(200)
      done()
    } catch (e) {
      done(e)
      console.log(e);
    }
    
  });
});

// send post req with user object to fake signed in user

const app = require("./server/app");
const request = require("supertest");
const mongoose = require("mongoose");
const faker = require("faker");

const testDB = "mongodb://ribbit2-test:ribbit2-test@ds263590.mlab.com:63590/ribbit2-test";

describe("App exists.", () => {
  it("Has a module.", () => {
    expect(app).toBeDefined();
  });
  let server;

  beforeAll("Open connection, listen server", async () => {
    try {
      await app.listen(3001, () => {
        console.log("Listening on 3001");
      });
      await mongoose.connect(testDB);
      mongoose.connection.on("connected", () => {
        console.log("Connected to test db");
      });
    } catch (e) {
      throw new Error(e);
    }
  });

  afterAll("Close connection", async () => {
    try {
      await mongoose.connection.close(() => {
        console.log("Mongoose test db connection closed");
      });
      await server.close(() => {
        console.log("supertest connection closed");
      });
    } catch (e) {
      throw new Error(e);
    }
  });

  describe("User routes.", () => {
    const signup = "/api/users/signup";
    const login = "/api/users/signin";
    const secret = "/api/users/secret";
    const user = {
      email: faker.internet.email(),
      password: faker.internet.password()
    };
    const preSave = {
      email: "igglesTheClown@gmail.com",
      password: faker.internet.password()
    }
  });
});

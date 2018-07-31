const request = require("supertest");
const mongoose = require("mongoose");
const faker = require("faker");

const UserModel = require("../../../server/models/Users");
const app = require("../../../server/app.js");


const testDB =
  "mongodb://ribbit2-test:ribbit2-test@ds263590.mlab.com:63590/ribbit2-test";
const localTestDB = "mongodb://localhost/ribbit2-test";

describe("App exists", () => {
  test("Has a module.", () => {
    expect(app).toBeDefined();
  });
});

let server;

beforeAll(async () => {
  console.log("Open connection, listen server");
  try {
    server = await app.listen(3001, () => {
      console.log("Listening on 3001");
    });
    await mongoose.connect(localTestDB);
    mongoose.connection.on("connected", () => {
      console.log("Connected to test db");
    });
    await UserModel.remove({});
  } catch (e) {
    throw new Error(e);
  }
});

afterAll(done => {
  mongoose.connection.close();
  server.close(done());
});

let token;
let userID;
describe("User routes.", () => {
  const signup = "/api/users/signup";
  const login = "/api/users/signin";
  const secret = "/api/users/secret";
  const user = {
    email: faker.internet.email(),
    password: faker.internet.password()
  };
 
  const newUserData = {
    email: faker.internet.email(),
    password: faker.internet.password()
  };

  describe("Signup", () => {
    it("Should create new user if email unique", async () => {
      try {
        const res = await request(server)
          .post(signup)
          .send(user);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeTruthy();
        expect(res.body).toHaveProperty("token");

        token = res.body.token;
        console.log('rez',res.body)
      } catch (e) {
        throw new Error(e);
      }
    });

    it("Should return error if email not unique", async () => {
      try {
        const res = await request(server)
          .post(signup)
          .send(user);
        expect(res.statusCode).toEqual(403);
        expect(res.body).toMatchObject({
          error: `${user.email} already exists in the database.`
        });
      } catch (e) {
        throw new Error(e);
      }
    });
  });

  describe("Login", () => {
    it("should login with valid password", async () => {
      try {
        const res = await request(server)
          .post(login)
          .send(user);
        expect(res.statusCode).toEqual(200);
      } catch (e) {
        throw new Error(e);
      }
    });

    it("should return error if password invalid", async () => {
      try {
        const res = await request(server)
          .post(login)
          .send(Object.assign(user, { password: "123" }));
        expect(res.statusCode).toEqual(401);
        expect(res).toMatchObject({ text: "Unauthorized" });
      } catch (e) {
        throw new Error(e);
      }
    });
  });

  describe("Secret", () => {
    it("should return secret resource if token valid", async () => {
      try {
        const res = await request(server)
          .get(secret)
          .set("Authorization", token);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toMatchObject({ secret: "resource" });
      } catch (e) {
        throw new Error(e);
      }
    });

    it("should return 401 if token invalid", async () => {
      try {
        const res = await request(server)
          .get(secret)
          .set("Authorization", "abc");
        expect(res.statusCode).toEqual(401);
      } catch (e) {
        throw new Error(e);
      }
    });
  });
  describe('stripe test', async () => {
    try{
      const res = await request(server)
        .post('/stripe')
        // .send({id:})
    } catch(e){
      throw new Error(e)
    }
  })
});

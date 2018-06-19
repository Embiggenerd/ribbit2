const chai = require("chai");
const faker = require("faker");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const rewire = require("rewire");
const { expect } = chai;

const User = require("../../../server/models/Users");
const userController = rewire("../../../server/controllers/users");

chai.use(sinonChai);

let sandbox = null;
let fakeEmail = faker.internet.email();

describe("Users controller", () => {
  let req = {
    user: { id: faker.random.number() },
    value: {
      body: {
        email: fakeEmail,
        password: faker.internet.password()
      }
    }
  };

  /**
   * Allows us to chain other methods onto res.json later on.
   * Whatever the next instance of this object's .json method does,
   * it also returns the object itself.
   */
  let res = {
    json: function() {
      return this;
    },
    status: function() {
      return this;
    }
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe("secret", () => {
    it("Should return {secret: resource} when called", () => {
      sandbox.spy(console, "log");
      sandbox.spy(res, "json");

      return userController.secret(req, res).then(() => {
        expect(console.log).to.have.been.called;
        expect(res.json).to.have.been.calledWith({ secret: "resource" });
      });
    });
  });

  describe("signIn", () => {
    it("should return token when signIn called", () => {
      sandbox.spy(res, "json");
      sandbox.spy(res, "status");
      return userController.signIn(req, res).then(() => {
        expect(res.status).to.have.been.calledWith(200);
        expect(res.json.callCount).to.equal(1);
      });
    });

    /**
     * Replace signToken with () => '...'.
     * Confirm output is attached to response
     */
    it("should return fake token using rewire", () => {
      sandbox.spy(res, "json");
      sandbox.spy(res, "status");
      let signToken = userController.__set__("signToken", () => "fakeToken");
      return userController.signIn(req, res).then(() => {
        expect(res.json).to.have.been.calledWith({ token: "fakeToken" });
        signToken();
      });
    });
  });
  describe("signUp", () => {
    it("should return 403 if the user is already save in the db.", async () => {
      sandbox.spy(res, "json");
      sandbox.spy(res, "status");
      sandbox.stub(User, "findOne").returns(
        Promise.resolve({
          id: faker.random.number()
        })
      );

      try {
        await userController.signUp(req, res);
        console.log("test req, res", req, res);

        expect(res.status).to.have.been.calledWith(403);
        expect(res.json).to.have.been.calledWith({
          error: `${fakeEmail} already exists in the database.`
        });
      } catch (error) {
        throw new Error(error);
      }
    });

    /**
     * Make findOne return false to mimick new user.
     * Stub User.save() method to only return object with id
     * Invoke controller's signUp to spy if json and status of response correct
     */
    it("should return 200 if user is not in db and it was saved", () => {
      sandbox.spy(res, "json");
      sandbox.spy(res, "status");
      sandbox.stub(User, "findOne").returns(Promise.resolve(false));
      sandbox
        .stub(User.prototype, "save")
        .returns(Promise.resolve({ id: faker.random.number() }));

      return userController.signUp(req, res).then(() => {
        expect(res.status).to.have.been.calledWith(200);
        expect(res.json.callCount).to.equal(1);
      });
    });

    /**
     * Users.findOne returns false so our mock user is treated as new. 
     * userController's signup is async, and is passed done in callback
     * so we can test spied functions with confidence.
     */
    it("should return 200 if user is not in db using callback done", done => {
      
      sandbox.spy(res, "json");
      sandbox.spy(res, "status");
      sandbox.stub(User, "findOne").returns(Promise.resolve(false));
      sandbox
        .stub(User.prototype, "save")
        .returns(Promise.resolve({ id: faker.random.number() }));

      userController.signUp(req, res).then(done());

      expect(res.status).to.have.been.calledWith(200);
      expect(res.json.callCount).to.equal(1);
    });

    /**
     * User's findOne again stubbed to return false.
     * signToken is stubbed to only return a string. 
     * signUp is then invoked, and it's res is tested to be
     * called with our fake token string
     */
    it("Should return fake token in res.json.", async () => {
      sandbox.spy(res, "json");
      sandbox.spy(res, "status");
      sandbox.stub(User, "findOne").returns(Promise.resolve(false));
      sandbox
        .stub(User.prototype, "save")
        .returns(Promise.resolve({ id: faker.random.number() }));

      let signToken = userController.__set__(
        "signToken",
        () => "fakeTokenNumberTwo"
      );

      try {
        await userController.signUp(req, res)
        expect(res.json).to.have.been.calledWith({
          token: "fakeTokenNumberTwo"
        })
      } catch(e) {
        throw new Error(e)
      } 
    });
  });
});

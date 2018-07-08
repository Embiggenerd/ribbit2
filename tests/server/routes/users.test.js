const app = require('../../../server/app');
const request = require('supertest');
const mongoose = require('mongoose');
const faker = require('faker');

/**
 * First describe layer for encapsulatig before/after hooks for
 * starting app and connectign to test db.
 * Second layer begins by defining token for future use,
 */

const testDB =
  'mongodb://ribbit2-test:ribbit2-test@ds263590.mlab.com:63590/ribbit2-test';

describe('App exists.', () => {
  test('Has a module.', () => {
    expect(app).toBeDefined();
  });

  let server;

  beforeAll(async () => {
    console.log('Open connection, listen server');
    try {
      server = await app.listen(3001, () => {
        console.log('Listening on 3001');
      });
      await mongoose.connect(testDB);
      mongoose.connection.on('connected', () => {
        console.log('Connected to test db');
      });
    } catch (e) {
      throw new Error(e);
    }
  });

  afterAll(done => {
    console.log('Close connection');
    mongoose.connection.close();
    server.close(done());
  });

  let token;

  describe('User routes.', () => {
    const signUp = '/api/users/signup';
    const login = '/api/users/signin';
    const secret = '/api/users/secret';
    const user = {
      email: faker.internet.email(),
      password: faker.internet.password()
    };
    const preSave = {
      email: 'igglesTheClown@gmail.com',
      password: faker.internet.password()
    };

    beforeAll(async () => {
      console.log('Defining token.');
      try {
        const res = await request(server)
          .post(signUp)
          .send(preSave);
        expect(res.statusCode).toEqual(200);
        expect(response.type).toEqual('application/json');
        token = result.body.token;
        console.log('token', token);
      } catch (e) {
        throw new Error(e);
      }
    });

    describe('Signup', () => {
      it('Should crate new user if email unique', async () => {
        try {
          const res = await request(server)
            .post(signUp)
            .send(user);
          expect(res.statusCode).toEqual(200);
          expect(result.body).toBeTruthy();
          expect(result.body).toHaveProperty('token');
        } catch (e) {
          throw new Error(e);
        }
      });
    });
  });
});

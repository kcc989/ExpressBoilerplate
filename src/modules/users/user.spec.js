import 'babel-polyfill'

import express from 'express';
import mongoose from 'mongoose';
import moment from 'moment';
import request from 'supertest';
import { expect } from 'chai';

import appConfig from '../../config/appConfig';
import UserModel from './user.model';

function generateEmail() {
  const time = moment().valueOf();
  return `user-${time}@company.com`;
}

describe('User Tests', () => {
  const firstName = "Casey";
  const lastName = "Collins";
  const password = "P@ssw0rd!";

  describe('Model Tests', () => {
    it('returns true when password matches', async () => {
      const user = await UserModel.create({
        firstName,
        lastName,
        password,
        email: generateEmail()
      });

      expect(user).not.to.be.null;
      expect(user.authenticateUser(password)).to.be.true;
    });
    
    it('returns false when passwords do not match', async () => {
      const user = await UserModel.create({
        firstName,
        lastName,
        password,
        email: generateEmail()
      });

      expect(user).not.to.be.null;
      expect(user.authenticateUser("blahblahblah")).to.be.false;
    });
  })

  describe('Integration Tests', () => {

    let server;
    let app;
    before((done) => {
      app = express();
      appConfig(app);
      done();
    });

    beforeEach((done) => {
      UserModel.ensureIndexes();
      done();
    });

    afterEach((done) => {
      mongoose.connection.dropDatabase(done);
    })

    after((done) => {
      mongoose.connection.close(done);
    })

    it('creates user', (done) => {
      const email = generateEmail();

      const body = {
        email,
        firstName,
        lastName,
        password
      };

      request(app)
        .post("/api/v1/users/signup")
        .send(body)
        .expect(201)
        .end((err, res) => {
          const user = res.body;
          expect(user.email).to.equal(email);
          expect(user.firstName).to.equal(firstName);
          expect(user.lastName).to.equal(lastName);
          expect(user.password).not.to.equal(password);
          done();
        });
    });

    it('fails signup when email already exists', (done) => {
      const email = generateEmail();

      const body = {
        email,
        firstName,
        lastName,
        password
      };

      request(app)
        .post("/api/v1/users/signup")
        .send(body)
        .expect(201)
        .then((res) =>  {
          request(app)
            .post("/api/v1/users/signup")
            .send(body)
            .expect(500)
            .end((err, res) => {
              done()
            });
        })
    });

    it('signs up user and then logs them in', async () => {
      const email = generateEmail();

      const body = {
        email,
        firstName,
        lastName,
        password
      };

      const user = await request(app)
        .post("/api/v1/users/signup")
        .send(body)
        .expect(201);

      const res = await request(app)
        .post("/api/v1/users/login")
        .send({email, password})
        .expect(200);

      const token = res.headers.token;

      await request(app)
        .get("/api/v1/users/test")
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });
    
    it('it fails on invalid password', async () => {
      const email = generateEmail();

      const body = {
        email,
        firstName,
        lastName,
        password
      };

      const user = await request(app)
        .post("/api/v1/users/signup")
        .send(body)
        .expect(201);

      const res = await request(app)
        .post("/api/v1/users/login")
        .send({email, password: "fakePassword"})
        .expect(401);
    });

    it('it throws error for invalid token', async () => {
      await request(app)
        .get("/api/v1/users/test")
        .expect(401);
    });
  });
});
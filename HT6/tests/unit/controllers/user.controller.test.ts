import express from 'express';
import { agent } from 'supertest';
import jwt from 'jsonwebtoken';
import { setup } from '../../../src/utils/setup';
import sinon from 'sinon';
import UserService from '../../../src/services/user.service';


const app = express();
setup(app);
const server = app.listen(3000);
const request = agent(server);
const mockToken = jwt.sign({}, 'secret');

const mockUserResponse = { login: 'login', password: 'pass', age: 123 };


describe('UserController tests', () => {
  afterEach(() => {
    sinon.restore();
  });
  describe('GET /', () => {
    it("route authorization works", async done => {
      await request.get("/users").expect(401);
      await request.get("/users").set('Authorization', 'invalidToken').expect(403);
      done();
    });
    it("route returns controller value", async done => {
      sinon.stub(UserService.prototype, 'getUsers').returns(new Promise((res) => res([mockUserResponse] as any)));

      await request
        .get("/users")
        .set('Authorization', `$Bearer ${mockToken}`)
        .expect([mockUserResponse])
        .expect(200);

      done();
    });
    it("controller calls method with query vars", async done => {
      const stub = sinon.stub(UserService.prototype, 'getUsers').returns(new Promise((res) => res([mockUserResponse] as any)));

      await request
        .get("/users?limit=1&loginSubstring=string")
        .set('Authorization', `$Bearer ${mockToken}`)
        .expect([mockUserResponse])
        .expect(200);
      expect(stub.getCall(0).args).toEqual(['string', 1]);
      done();
    });
    it("route accepts only valid queries", async done => {
      await request
        .get("/users?some=value")
        .set('Authorization', `$Bearer ${mockToken}`)
        .expect(400);

      await request
        .get("/users?limit=o")
        .set('Authorization', `$Bearer ${mockToken}`)
        .expect(400);

      await request
        .get("/users?limit=0")
        .set('Authorization', `$Bearer ${mockToken}`)
        .expect(400);

      await request
        .get("/users?limit=-1")
        .set('Authorization', `$Bearer ${mockToken}`)
        .expect(400);

      await request
        .get("/users?limit=1")
        .set('Authorization', `$Bearer ${mockToken}`)
        .expect(200);

      await request
        .get("/users?loginSubstring=string")
        .set('Authorization', `$Bearer ${mockToken}`)
        .expect(200);

      await request
        .get("/users?limit=aaa&loginSubstring=string")
        .set('Authorization', `$Bearer ${mockToken}`)
        .expect(400);

      await request
        .get("/users?limit=1&loginSubstring=string")
        .set('Authorization', `$Bearer ${mockToken}`)
        .expect(200);

      done();
    });
    it("route returns 500 on controller error", async done => {
      sinon.stub(UserService.prototype, 'getUsers').rejects(new Error());

      await request
        .get("/users")
        .set('Authorization', `$Bearer ${mockToken}`)
        .expect(500);
      done();
    });
  });

  describe('GET /:id', () => {
    it("route authorization works", async done => {
      await request
        .get("/users/1")
        .expect(401);

      await request
        .get("/users/1")
        .set('Authorization', 'invalid token')
        .expect(403);
      done();
    });
    it("route returns controller value", async done => {
      sinon.stub(UserService.prototype, 'getUserById').returns(new Promise((res) => res(mockUserResponse as any)));

      request
        .get("/users/1")
        .set('Authorization', `$Bearer ${mockToken}`)
        .expect(mockUserResponse)
        .expect(200);
      done();
    });
    it("controller calls method with query vars", async done => {
      const stub = sinon.stub(UserService.prototype, 'getUserById').returns(new Promise((res) => res(mockUserResponse as any)));

      await request
        .get("/users/1")
        .set('Authorization', `$Bearer ${mockToken}`)
        .expect(200);
      expect(stub.getCall(0).args).toEqual([1]);
      done();
    });
    it("route accepts only valid queries", async done => {
      await request
        .get("/users/a")
        .set('Authorization', `$Bearer ${mockToken}`)
        .expect(400);
      done();
    });
    it("route returns 500 on controller error", async done => {
      sinon.stub(UserService.prototype, 'getUserById').rejects(new Error());

      await request
        .get("/users/1")
        .set('Authorization', `$Bearer ${mockToken}`)
        .expect(500);
      done();
    });
  });

  describe('POST /', () => {
    it("route authorization works", async done => {
      await request
        .post("/users")
        .expect(401);

      await request
        .post("/users")
        .set('Authorization', 'invalid token')
        .expect(403);
      done();
    });
    it("route returns controller value", async done => {
      sinon.stub(UserService.prototype, 'createNew').returns(new Promise((res) => res({ success: true, errors: [], user: mockUserResponse as any })));

      await request
        .post("/users")
        .set('Authorization', `$Bearer ${mockToken}`)
        .send(mockUserResponse)
        .expect({
          message: 'Created successfully',
          user: mockUserResponse
        })
        .expect(201);
      done();
    });
    it("route accepts only valid requests", async done => {
      await request
        .post("/users")
        .set('Authorization', `$Bearer ${mockToken}`)
        .send({})
        .expect(400);
      await request
        .post("/users")
        .set('Authorization', `$Bearer ${mockToken}`)
        .send({ login: 'log' })
        .expect(400);
      await request
        .post("/users")
        .set('Authorization', `$Bearer ${mockToken}`)
        .send({ password: 'pass' })
        .expect(400);
      await request
        .post("/users")
        .set('Authorization', `$Bearer ${mockToken}`)
        .send({ age: 123 })
        .expect(400);
      await request
        .post("/users")
        .set('Authorization', `$Bearer ${mockToken}`)
        .send({ login: 'log', password: 'pass' })
        .expect(400);
      await request
        .post("/users")
        .set('Authorization', `$Bearer ${mockToken}`)
        .send({ login: 'log', age: 123 })
        .expect(400);
      await request
        .post("/users")
        .set('Authorization', `$Bearer ${mockToken}`)
        .send({ password: 'pass', age: 123 })
        .expect(400);
      await request
        .post("/users")
        .set('Authorization', `$Bearer ${mockToken}`)
        .send({ login: 'log', password: 'pass', age: 131 })
        .expect(400);
      await request
        .post("/users")
        .set('Authorization', `$Bearer ${mockToken}`)
        .send({ login: 'log', password: 'pass', age: '120' })
        .expect(400);
      await request
        .post("/users")
        .set('Authorization', `$Bearer ${mockToken}`)
        .send({ login: 'log', password: 'pass', age: 3 })
        .expect(400);
      await request
        .post("/users")
        .set('Authorization', `$Bearer ${mockToken}`)
        .send({ login: 'log', password: 'pass', age: 'zero' })
        .expect(400);
      done();
    });
    it("route returns 500 on controller error", async done => {
      sinon.stub(UserService.prototype, 'createNew').rejects(new Error());

      request
        .post("/users")
        .set('Authorization', `$Bearer ${mockToken}`)
        .expect(500);
      done();
    });
  });


  describe('PATCH /:id ', () => {
    it("route authorization works", async done => {
      await request
        .patch("/users/1")
        .expect(401);

      await request
        .patch("/users/1")
        .set('Authorization', 'invalid token')
        .expect(403);
      done();
    });
    it("route returns controller value", async done => {
      sinon.stub(UserService.prototype, 'getUserById').returns(new Promise((res) => res(new Promise((res) => res(mockUserResponse as any)))));
      sinon.stub(UserService.prototype, 'patchUserById').returns(new Promise((res) => res({ success: true, errors: [], user: mockUserResponse as any })));

      await request
        .patch("/users/1")
        .set('Authorization', `$Bearer ${mockToken}`)
        .send(mockUserResponse)
        .expect({
          message: 'Updated successfully',
          user: mockUserResponse
        })
        .expect(200);
      done();
    });
    it("route accepts only valid requests", async done => {
      await request
        .patch("/users/1")
        .set('Authorization', `$Bearer ${mockToken}`)
        .send({ login: 123 })
        .expect(400);
      await request
        .patch("/users/1")
        .set('Authorization', `$Bearer ${mockToken}`)
        .send({ age: 3 })
        .expect(400);
      await request
        .patch("/users/1")
        .set('Authorization', `$Bearer ${mockToken}`)
        .send({ age: 'zero' })
        .expect(400);
      await request
        .patch("/users/1")
        .set('Authorization', `$Bearer ${mockToken}`)
        .send({ age: 131 })
        .expect(400);
      done();
    });
    it("route returns 500 on controller error", async done => {
      sinon.stub(UserService.prototype, 'getUserById').returns(new Promise((res) => res(new Promise((res) => res(mockUserResponse as any)))));
      sinon.stub(UserService.prototype, 'patchUserById').rejects(new Error());

      request
        .patch("/users/1")
        .set('Authorization', `$Bearer ${mockToken}`)
        .expect(500);
      done();
    });
  });

  describe('DELETE /:id ', () => {
    afterAll(() => {
      server.close();
    })
    it("route authorization works", async done => {
      await request
        .delete("/users/1")
        .expect(401);

      await request
        .delete("/users/1")
        .set('Authorization', 'invalid token')
        .expect(403);
      done();
    });
    it("route returns controller value", async done => {
      sinon.stub(UserService.prototype, 'getUserById').returns(new Promise((res) => res(new Promise((res) => res(mockUserResponse as any)))));
      sinon.stub(UserService.prototype, 'patchUserById').returns(new Promise((res) => res({ success: true, errors: [], user: mockUserResponse as any })));

      await request
        .delete("/users/1")
        .set('Authorization', `$Bearer ${mockToken}`)
        .expect(204);
      done();
    });
    it("route accepts only valid requests", async done => {
      await request
        .delete("/users/aaa")
        .set('Authorization', `$Bearer ${mockToken}`)
        .expect(400);
      done();
    });
    it("route returns 500 on controller error", async done => {
      sinon.stub(UserService.prototype, 'getUserById').returns(new Promise((res) => res(new Promise((res) => res(mockUserResponse as any)))));
      sinon.stub(UserService.prototype, 'patchUserById').rejects(new Error());

      request
        .delete("/users/1")
        .set('Authorization', `$Bearer ${mockToken}`)
        .expect(500);
      done();
    });
  });
});

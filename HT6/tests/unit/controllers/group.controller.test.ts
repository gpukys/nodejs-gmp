import express from 'express';
import { agent } from 'supertest';
import jwt from 'jsonwebtoken';
import { setup } from '../../../src/utils/setup';
import sinon from 'sinon';
import GroupService from '../../../src/services/group.service';


const app = express();
setup(app);
const server = app.listen(3000);
const request = agent(server);
const mockToken = jwt.sign({}, 'secret');

const mockGroupResponse = { name: 'admin ', permissions: ['READ'] };


describe('GroupController tests', () => {
  afterEach(() => {
    sinon.restore();
  });
  describe('GET /', () => {
    it("route authorization works", async done => {
      await request.get("/groups").expect(401);
      await request.get("/groups").set('Authorization', 'invalidToken').expect(403);
      done();
    });
    it("route returns controller value", async done => {
      sinon.stub(GroupService.prototype, 'getGroups').returns(new Promise((res) => res([mockGroupResponse] as any)));

      await request
        .get("/groups")
        .set('Authorization', `$Bearer ${mockToken}`)
        .expect([mockGroupResponse])
        .expect(200);

      done();
    });
    it("route returns 500 on controller error", async done => {
      sinon.stub(GroupService.prototype, 'getGroups').rejects(new Error());

      await request
        .get("/groups")
        .set('Authorization', `$Bearer ${mockToken}`)
        .expect(500);
      done();
    });
  });

  describe('GET /:id', () => {
    it("route authorization works", async done => {
      await request
        .get("/groups/1")
        .expect(401);

      await request
        .get("/groups/1")
        .set('Authorization', 'invalid token')
        .expect(403);
      done();
    });
    it("route returns controller value", async done => {
      sinon.stub(GroupService.prototype, 'getGroupById').returns(new Promise((res) => res(mockGroupResponse as any)));

      request
        .get("/groups/1")
        .set('Authorization', `$Bearer ${mockToken}`)
        .expect(mockGroupResponse)
        .expect(200);
      done();
    });
    it("controller calls method with query vars", async done => {
      const stub = sinon.stub(GroupService.prototype, 'getGroupById').returns(new Promise((res) => res(mockGroupResponse as any)));

      await request
        .get("/groups/1")
        .set('Authorization', `$Bearer ${mockToken}`)
        .expect(200);
      expect(stub.getCall(0).args).toEqual([1]);
      done();
    });
    it("route accepts only valid queries", async done => {
      await request
        .get("/groups/a")
        .set('Authorization', `$Bearer ${mockToken}`)
        .expect(400);
      done();
    });
    it("route returns 500 on controller error", async done => {
      sinon.stub(GroupService.prototype, 'getGroupById').rejects(new Error());

      await request
        .get("/groups/1")
        .set('Authorization', `$Bearer ${mockToken}`)
        .expect(500);
      done();
    });
  });

  describe('POST /', () => {
    it("route authorization works", async done => {
      await request
        .post("/groups")
        .expect(401);

      await request
        .post("/groups")
        .set('Authorization', 'invalid token')
        .expect(403);
      done();
    });
    it("route returns controller value", async done => {
      sinon.stub(GroupService.prototype, 'createNew').returns(new Promise((res) => res({ success: true, errors: [], group: mockGroupResponse as any })));

      await request
        .post("/groups")
        .set('Authorization', `$Bearer ${mockToken}`)
        .send(mockGroupResponse)
        .expect({
          message: 'Created successfully',
          group: mockGroupResponse
        })
        .expect(201);
      done();
    });
    it("route accepts only valid requests", async done => {
      await request
        .post("/groups")
        .set('Authorization', `$Bearer ${mockToken}`)
        .send({})
        .expect(400);
      
      await request
        .post("/groups")
        .set('Authorization', `$Bearer ${mockToken}`)
        .send({ permissions: [] })
        .expect(400);
      await request
        .post("/groups")
        .set('Authorization', `$Bearer ${mockToken}`)
        .send({ permissions: ['some'] })
        .expect(400);
      await request
        .post("/groups")
        .set('Authorization', `$Bearer ${mockToken}`)
        .send({ name: 'valid', permissions: ['READ', 'some'] })
        .expect(400);
      done();
    });
    it("route returns 500 on controller error", async done => {
      sinon.stub(GroupService.prototype, 'createNew').rejects(new Error());

      request
        .post("/groups")
        .send(mockGroupResponse)
        .set('Authorization', `$Bearer ${mockToken}`)
        .expect(500);
      done();
    });
  });


  describe('PATCH /:id ', () => {
    it("route authorization works", async done => {
      await request
        .patch("/groups/1")
        .expect(401);

      await request
        .patch("/groups/1")
        .set('Authorization', 'invalid token')
        .expect(403);
      done();
    });
    it("route returns controller value", async done => {
      sinon.stub(GroupService.prototype, 'getGroupById').returns(new Promise((res) => res(new Promise((res) => res(mockGroupResponse as any)))));
      sinon.stub(GroupService.prototype, 'patchGroupById').returns(new Promise((res) => res({ success: true, errors: [], group: mockGroupResponse as any })));

      await request
        .patch("/groups/1")
        .set('Authorization', `$Bearer ${mockToken}`)
        .send(mockGroupResponse)
        .expect({
          message: 'Updated successfully',
          group: mockGroupResponse
        })
        .expect(200);
      done();
    });
    it("route accepts only valid requests", async done => {
      sinon.stub(GroupService.prototype, 'getGroupById').returns(new Promise((res) => res(new Promise((res) => res(mockGroupResponse as any)))));
      sinon.stub(GroupService.prototype, 'patchGroupById').returns(new Promise((res) => res({ success: true, errors: [], group: mockGroupResponse as any })));

      await request
        .patch("/groups/1")
        .set('Authorization', `$Bearer ${mockToken}`)
        .send({ permissions: ['some'] })
        .expect(400);
      await request
        .patch("/groups/1")
        .set('Authorization', `$Bearer ${mockToken}`)
        .send({ name: 'valid', permissions: ['READ', 'some'] })
        .expect(400);
      done();
    });
    it("route returns 500 on controller error", async done => {
      sinon.stub(GroupService.prototype, 'getGroupById').returns(new Promise((res) => res(new Promise((res) => res(mockGroupResponse as any)))));
      sinon.stub(GroupService.prototype, 'patchGroupById').rejects(new Error());

      request
        .patch("/groups/1")
        .set('Authorization', `$Bearer ${mockToken}`)
        .expect(500);
      done();
    });
  });

  describe('DELETE /:id ', () => {
    it("route authorization works", async done => {
      await request
        .delete("/groups/1")
        .expect(401);

      await request
        .delete("/groups/1")
        .set('Authorization', 'invalid token')
        .expect(403);
      done();
    });
    it("route returns controller value", async done => {
      sinon.stub(GroupService.prototype, 'getGroupById').returns(new Promise((res) => res(new Promise((res) => res(mockGroupResponse as any)))));
      sinon.stub(GroupService.prototype, 'patchGroupById').returns(new Promise((res) => res({ success: true, errors: [], group: mockGroupResponse as any })));

      await request
        .delete("/groups/1")
        .set('Authorization', `$Bearer ${mockToken}`)
        .expect(204);
      done();
    });
    it("route accepts only valid requests", async done => {
      await request
        .delete("/groups/aaa")
        .set('Authorization', `$Bearer ${mockToken}`)
        .expect(400);
      done();
    });
    it("route returns 500 on controller error", async done => {
      sinon.stub(GroupService.prototype, 'getGroupById').returns(new Promise((res) => res(new Promise((res) => res(mockGroupResponse as any)))));
      sinon.stub(GroupService.prototype, 'patchGroupById').rejects(new Error());

      request
        .delete("/groups/1")
        .set('Authorization', `$Bearer ${mockToken}`)
        .expect(500);
      done();
    });
  });

  describe('POST /assign ', () => {
    afterAll(() => {
      server.close();
    })
    it("route authorization works", async done => {
      await request
        .post("/groups/assign")
        .expect(401);

      await request
        .post("/groups/assign")
        .set('Authorization', 'invalid token')
        .expect(403);
      done();
    });
    it("route returns controller value", async done => {
      sinon.stub(GroupService.prototype, 'addUsersToGroup').returns(new Promise((res) => res({ success: true, errors: [] })));

      await request
        .post("/groups/assign")
        .set('Authorization', `$Bearer ${mockToken}`)
        .send({groupId: 123, userIds: [123]})
        .expect({message: 'Assigned successfully'})
        .expect(200);
      done();
    });
    it("route accepts only valid requests", async done => {
      await request
        .post("/groups/assign")
        .send({})
        .set('Authorization', `$Bearer ${mockToken}`)
        .expect(400);
      await request
        .post("/groups/assign")
        .send({groupId: 123})
        .set('Authorization', `$Bearer ${mockToken}`)
        .expect(400);
        await request
        .post("/groups/assign")
        .send({userIds: ['aaa']})
        .set('Authorization', `$Bearer ${mockToken}`)
        .expect(400);
        await request
        .post("/groups/assign")
        .send({groupId: 'aaa', userIds: [123]})
        .set('Authorization', `$Bearer ${mockToken}`)
        .expect(400);
        await request
        .post("/groups/assign")
        .send({groupId: 123, userIds: ['aaa']})
        .set('Authorization', `$Bearer ${mockToken}`)
        .expect(400);
      done();
    });
    it("route returns 500 on controller error", async done => {
      sinon.stub(GroupService.prototype, 'addUsersToGroup').rejects(new Error());

      request
        .post("/groups/assign")
        .set('Authorization', `$Bearer ${mockToken}`)
        .expect(500);
      done();
    });
  });
});

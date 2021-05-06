import express from "express";
import { createValidator } from "express-joi-validation";
import { db, Group, User } from "../models";
import { assignGroupSchema, newGroupSchema, patchGroupSchema } from "../models/group.model";
import GroupService from "../services/group.service";

const validator = createValidator({});
const groupService = new GroupService(Group, User, db);
const GroupController = express.Router();


/* GET groups listing. */
GroupController.get('/', async (req, res, next) => {
  try {
    const groups = await groupService.getGroups();
    res.json(groups);
  } catch (e) {
    next(e);
  }
});

/* GET group by ID. */
GroupController.get('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (!isNaN(id)) {
      const group = await groupService.getGroupById(id);
      if (group) {
        res.json(group);
      } else {
        res.status(404).end('Group not found');
      }
    } else {
      res.status(400).end('ID must be an integer');
    }
  } catch (e) {
    next(e);
  }
});

/* POST new group. */
GroupController.post('/', validator.body(newGroupSchema), async (req, res, next) => {
  try {
    const { name, permissions } = req.body;
    const response = await groupService.createNew({ name, permissions });
    if (response.success) {
      res.status(201).json({
        message: 'Created successfully',
        group: response.group
      });
    } else {
      res.status(400).json({ message: response.errors.map(e => e.message).join() });
    }
  } catch (e) {
    next(e);
  }
});

/* Patch group. */
GroupController.patch('/:id', validator.body(patchGroupSchema), async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (!isNaN(id)) {
      const group = await groupService.getGroupById(id);
      if (group) {
        const response = await groupService.patchGroupById(id, req.body);
        if (response.success) {
          res.json({
            message: 'Updated successfully',
            group: response.group
          });
        } else {
          res.status(400).json({ message: response.errors.map(e => e.message).join() });
        }
      } else {
        res.status(404).end('Group not found');
      }
    } else {
      res.status(400).end('ID must be an integer');
    }
  } catch (e) {
    next(e);
  }
});

/* Hard delete group. */
GroupController.delete('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (!isNaN(id)) {
      const group = await groupService.getGroupById(id);
      if (group) {
        const response = await groupService.deleteById(id);
        console.log(response);
        if (response.success) {
          res.sendStatus(204);
        } else {
          res.status(400).json({ message: response.errors.map(e => e.message).join() });
        }
      } else {
        res.status(404).end('Group not found');
      }
    } else {
      res.status(400).end('ID must be an integer');
    }
  } catch (e) {
    next(e);
  }
});

/* POST new group. */
GroupController.post('/assign', validator.body(assignGroupSchema), async (req, res, next) => {
  try {
    const { groupId, userIds } = req.body;
    const response = await groupService.addUsersToGroup(groupId, userIds);
    if (response.success) {
      res.status(200).json({
        message: 'Assigned successfully'
      });
    } else {
      res.status(400).json({ message: response.errors.map(e => e.message).join() });
    }
  } catch (e) {
    next(e);
  }
});


export default GroupController;

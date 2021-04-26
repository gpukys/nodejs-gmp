import express from "express";
import { newUserSchema, patchUserSchema, userQuerySchema } from "../models/user.model";
import { createValidator } from 'express-joi-validation';
import UserService from "../services/user.service";
import { User } from "../models";

const validator = createValidator({});
const userService = new UserService(User);
const UserController = express.Router();


/* GET users listing. */
UserController.get('/', validator.query(userQuerySchema), async (req, res) => {
  try {
    const { loginSubstring, limit } = req.query || {};
    const users = await userService.getUsers(loginSubstring as string, (limit && parseInt(limit as string, 10)) || undefined);
    res.json(users);
  } catch {
    res.status(500).end('Internal error');
  }
});

/* GET user by ID. */
UserController.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (!isNaN(id)) {
      const user = await userService.getUserById(id);
      if (user) {
        res.json(user);
      } else {
        res.status(404).end('User not found');
      }
    } else {
      res.status(400).end('ID must be an integer');
    }
  } catch {
    res.status(500).end('Internal error');
  }
});

/* POST new user. */
UserController.post('/', validator.body(newUserSchema), async (req, res) => {
  try {
    const { login, password, age } = req.body;
    const response = await userService.createNew({ login, password, age });
    if (response.success) {
      res.status(201).json({
        message: 'Created successfully',
        user: response.user
      });
    } else {
      res.status(400).json({ message: response.errors.map(e => e.message).join() });
    }
  } catch (e) {
    res.status(500).end('Internal error');
  }
});

/* Patch user. */
UserController.patch('/:id', validator.body(patchUserSchema), async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (!isNaN(id)) {
      const user = await userService.getUserById(id);
      if (user) {
        const response = await userService.patchUserById(id, req.body);
        if (response.success) {
          res.json({
            message: 'Updated successfully',
            user: response.user
          });
        } else {
          res.status(400).json({ message: response.errors.map(e => e.message).join() });
        }
      } else {
        res.status(404).end('User not found');
      }
    } else {
      res.status(400).end('ID must be an integer');
    }
  } catch {
    res.status(500).end('Internal error');
  }
});

/* Soft delete user. */
UserController.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (!isNaN(id)) {
      const user = await userService.getUserById(id);
      if (user) {
        const response = await userService.patchUserById(id, { isDeleted: true });
        if (response.success) {
          res.sendStatus(204);
        } else {
          res.status(400).json({ message: response.errors.map(e => e.message).join() });
        }
      } else {
        res.status(404).end('User not found');
      }
    } else {
      res.status(400).end('ID must be an integer');
    }
  } catch {
    res.status(500).end('Internal error');
  }
});


export default UserController;

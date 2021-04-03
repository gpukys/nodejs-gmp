import express from "express";
import { User, newUserSchema, patchUserSchema, userQuerySchema } from "../models/User";
import { createValidator } from 'express-joi-validation';

const validator = createValidator({});
const UsersRouter = express.Router();
const users: User[] = [
  new User('abc', '1', 12),
  new User('abcd', '2', 23),
  new User('bcdf', '5', 25),
  new User('zert', '5', 35),
  new User('aaaaaaa', '5', 65)
];

function getUsersByParams(loginSubstring?: string, limit?: string): User[] {
  let res = users.sort((a, b) => (a.login > b.login) ? 1 : ((b.login > a.login) ? -1 : 0));
  if (loginSubstring) {
    res = res.filter(e => e.login.includes(loginSubstring));
  }
  if (limit) {
    res = res.slice(0, parseInt(limit, 10));
  }
  return res;
}

/* GET users listing. */
UsersRouter.get('/', validator.query(userQuerySchema), (req, res) => {
  console.log(req.query);
  const { loginSubstring, limit } = req.query;
  res.json(getUsersByParams(loginSubstring as string | undefined, limit as string | undefined));
});

/* GET user by ID. */
UsersRouter.get('/:id', (req, res) => {
  const user = users.find(e => e.id === parseInt(req.params.id, 10));
  if (user) {
    res.json(user);
  } else {
    res.status(404).end('User not found');
  }
});

/* POST new user. */
UsersRouter.post('/', validator.body(newUserSchema), (req, res) => {
  const { login, password, age } = req.body;
  const newUser = new User(login, password, age);
  if (users.some(e => e.login === login)) {
    res.status(400).end(`This login is already taken`);
  } else {
    users.push(newUser);
    res.status(201).json(newUser);
  }
});

/* Patch user. */
UsersRouter.patch('/:id', validator.body(patchUserSchema), (req, res) => {
  const user = users.find(e => e.id === parseInt(req.params.id, 10));
  if (!user) {
    res.status(404).end('User not found');
  } else {
    Object.assign(user, req.body);
    res.json(user);
  }
});

/* Soft delete user. */
UsersRouter.delete('/:id', (req, res) => {
  const user = users.find(e => e.id === parseInt(req.params.id, 10));
  if (!user) {
    res.status(404).end('User not found');
  } else {
    user.isDeleted = true;
    res.sendStatus(204);
  }
});


export default UsersRouter;

import express from 'express';
import jwt from 'jsonwebtoken';
import { createValidator } from 'express-joi-validation';
import { loginSchema } from '../models/user.model';
import AuthService from '../services/auth.service';
import { User } from '../models';

const AuthController = express.Router();
const authService = new AuthService(User);
const validator = createValidator({});

AuthController.post('/login', validator.body(loginSchema), async (req, res, next) => {
  try {
    const { login, password } = req.body;
    const user = await authService.userLogin(login, password);
    if (user) {
      const accessToken = jwt.sign({ login: user.login }, 'secret');
      return res.status(200).json({ accessToken });
    }
    return res.status(400).end('Invalid credentials');
  } catch (e) {
    next(e);
  }
});

export default AuthController;

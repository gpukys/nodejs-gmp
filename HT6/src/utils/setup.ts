import express from 'express';
import cors from 'cors';
import AuthController from '../controllers/auth.controller';
import GroupController from '../controllers/group.controller';
import UserController from '../controllers/user.controller';
import { errorHandler } from '../middlewares/errorHandler';
import { perfMonitor } from '../middlewares/performance';

export function setup(app: express.Express): void {
  app.use(cors());
  app.use(perfMonitor);
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use('/users', UserController);
  app.use('/groups', GroupController);
  app.use('/auth', AuthController);
  app.use(errorHandler);
}

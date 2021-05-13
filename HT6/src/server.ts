import express from "express";
import AuthController from "./controllers/auth.controller";
import GroupController from "./controllers/group.controller";
import UserController from "./controllers/user.controller";
import { errorHandler } from "./middlewares/errorHandler";
import { perfMonitor } from "./middlewares/performance";
import { db } from "./models";
import logger from "./services/logger.service";
import cors from 'cors';

(async function () {
  try {
    await db.sync();
    console.log('Database connection successful');
    const app = express();
    app.use(cors());
    app.use(perfMonitor);
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use('/users', UserController);
    app.use('/groups', GroupController);
    app.use('/auth', AuthController);
    app.use(errorHandler);

    app.listen(3000, () => {
      console.log('Server listening on port 3000');
    });
    process.on('uncaughtException', error => {
      logger.error(error);
    });
    process.on('unhandledRejection', error => {
      logger.error(error);
    });
  } catch (e) {
    console.error('Database error');
    console.error(e);
  }
}());


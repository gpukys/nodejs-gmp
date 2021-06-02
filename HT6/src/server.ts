import dotenv from 'dotenv';
dotenv.config();
import express from "express";
import { db } from "./models";
import logger from "./services/logger.service";
import { setup } from "./utils/setup";

(async function () {
  try {
    await db.sync();
    console.log('Database connection successful');
    const app = express();
    setup(app);

    app.listen(process.env.PORT || 3000, () => {
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


import express from "express";
import UserController from "./controllers/user.controller";
import { db } from "./models";

(async function () {
  try {
    await db.sync();
    console.log('Database connection successful');
    const app = express();

    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use('/users', UserController);

    app.listen(3000, () => {
      console.log('Server listening on port 3000');
    });
  } catch (e) {
    console.error('Database error');
    console.error(e);
  }
}());


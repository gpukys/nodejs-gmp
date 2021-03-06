import express from "express";
import UsersRouter from "./routes/User";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/users', UsersRouter);

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});

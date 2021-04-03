import Joi from "joi";
let counter = 0;

export class User {
  id: number;
  login: string;
  password: string;
  age: number;
  isDeleted: boolean;

  constructor(
    login: string,
    password: string,
    age: number
  ) {
    this.id = ++counter;
    this.login = login;
    this.password = password;
    this.age = age;
    this.isDeleted = false;
  }
}

export const newUserSchema = Joi.object({
  login: Joi.string().required(),
  password: Joi.string().alphanum().required(),
  age: Joi.number().min(4).max(130).required()
});

export const patchUserSchema = Joi.object({
  login: Joi.string(),
  password: Joi.string().alphanum(),
  age: Joi.number().min(4).max(130)
});

export const userQuerySchema = Joi.object({
  limit: Joi.number(),
  loginSubstring: Joi.string()
});

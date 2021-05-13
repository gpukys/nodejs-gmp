import Joi from "joi";
import { DataTypes, Sequelize } from "sequelize";
import { UserInstance } from "../types";

export function UserFactory(sequelize: Sequelize): UserInstance {
  return <UserInstance>sequelize.define("users", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    login: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 4, max: 130 }
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  });
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

export const loginSchema = Joi.object({
  login: Joi.string().required(),
  password: Joi.string().alphanum().required()
});

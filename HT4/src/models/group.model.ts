import Joi from "joi";
import { DataTypes, Sequelize } from "sequelize";
import { GroupInstance } from "../types";

export enum Permission {READ, WRITE, DELETE, SHARE, UPLOAD_FILES}

export function GroupFactory(sequelize: Sequelize): GroupInstance {
  return <GroupInstance>sequelize.define("groups", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    permissions: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
      allowNull: false
    }
  });
}

export const newGroupSchema = Joi.object({
  name: Joi.string().required(),
  permissions: Joi.array().required().items(Joi.string().valid(...Object.values(Permission).filter(e => typeof e === 'string')))
});

export const patchGroupSchema = Joi.object({
  name: Joi.string(),
  permissions: Joi.array().items(Joi.string().valid(...Object.values(Permission).filter(e => typeof e === 'string')))
});

export const assignGroupSchema = Joi.object({
  groupId: Joi.number().required(),
  userIds: Joi.array().required().items(Joi.number().valid())
});

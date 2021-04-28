import { BuildOptions, HasManyAddAssociationMixin, Model, Optional } from "sequelize";
import { Permission } from "../models/group.model";

export interface UserAttributes {
  id: number;
  login: string;
  password: string;
  age: number;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserCreateAttributes extends Optional<UserAttributes, "id" | "isDeleted"> { }
export interface UserPatchAttributes extends Optional<UserAttributes, "id" | "isDeleted" | "login" | "password" | "age"> { }
export interface UserModel extends Model<UserCreateAttributes>, UserAttributes { }
export class User extends Model<UserModel, UserAttributes> { }
export type UserInstance = typeof Model & {
  new(values?: object, options?: BuildOptions): UserModel;
};
export interface GroupAttributes {
  id: number;
  name: string;
  permissions: Permission[];
  createdAt?: Date;
  updatedAt?: Date;
}
export interface GroupCreateAttributes extends Optional<GroupAttributes, "id"> { }
export interface GroupPatchAttributes extends Optional<GroupAttributes, "id" | "name" | "permissions"> { }
export interface GroupModel extends Model<GroupCreateAttributes>, GroupAttributes {
  addUser: HasManyAddAssociationMixin<UserModel, number>;
}
export class Group extends Model<GroupModel, GroupAttributes> { }
export type GroupInstance = typeof Model & {
  new(values?: object, options?: BuildOptions): GroupModel;
};
